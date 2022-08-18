const {
  //utils
  collection,
  doc,
  //Read
  getDoc,
  getDocs,
  query,
  where,
  //Create
  setDoc,
  //Update
  updateDoc,
} = require('firebase/firestore');


const moment = require('moment');
const _ = require('lodash');

const { db } = require('../firebase');
const async = require('async');

const taxCollectionName = 'taxes';
const collectionName = 'transactions';

const transactionConverter = {
  toFirestore: (data) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });
    return data;
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
    };
  },
};

class Transaction {

  static pay(params, callback) {
    const { data } = params;

    if (data.method !== 'cash' && !data.cardNumber) {
      return callback({
        message: 'Card number is required',
        code: 'card_number_required',
      });
    }

    const documentRef = doc(db, taxCollectionName, data.barcode);
    
    return async.waterfall([
      (cb) => {
        return getDoc(documentRef)
          .then((docSnap) => {
            if (!docSnap.exists()) {
              return cb({
                message: 'Tax not found',
                code: 'tax_not_found',
              });
            }
            return cb(null, docSnap.data());
          })
      },
      (tax, cb) => {
        if (tax.status === 'paid') {
          return cb({
            message: 'Tax already paid',
            code: 'tax_already_paid',
          });
        }
        console.log('Ref', documentRef);
        return updateDoc(documentRef, { status: 'paid' })
          .then(() => cb())
          .catch((err) => {
            console.log(`Error updating tax: ${err}`);
            return cb(err);
          });
      },
      (cb) => {
        const transactionRef = doc(db, collectionName, data.barcode);
        data.paymentDate = moment(data.paymentDate).toDate().getTime();
        return setDoc(transactionRef, data)
          .then(() => {
            data.paymentDate = moment(data.paymentDate).format('YYYY-MM-DD');
            return cb(null, data)
          })
          .catch((err) => {
            console.log(`Error creating transaction: ${err}`);
            return cb(err);
          });
      }
    ], (err, data) => callback(err, data));
  }

  static get(params, callback) {
    const { filters = [] } = params;

    const documentRef = collection(db, collectionName);

    const fvalues = [];

    const filtersFirebase = filters.map((filter) => {
      if (filter.field === 'paymentDate') {
        filter.value = moment(filter.value).toDate().getTime();
        fvalues.push(filter.value);
      }
      return where(filter.field, filter.operator, filter.value);
    });

    const q = query(documentRef, ...filtersFirebase);
    console.log('fvalues', fvalues);

    return getDocs(q)
      .then((snapshot) => {
        console.log('Len', snapshot.docs.length);
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            paymentDate: moment(data.paymentDate).format('YYYY-MM-DD'),
          };
        });
        const grouped = _.groupBy(docs, 'paymentDate');
        return callback(null, grouped);
      }).catch((err) => {
        console.log(`Error getting transactions: ${err}`);
        return callback({
          message: 'Error getting transactions',
          code: 'error_getting_transactions',
        });
      }
    );
  }
}

module.exports = Transaction;