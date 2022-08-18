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
        if (data.amount !== tax.amount) {
          return cb({
            message: 'Amount does not match',
            code: 'amount_does_not_match',
          });
        }

        return updateDoc(documentRef, { status: 'paid' })
          .then(() => cb())
          .catch((err) => {
            console.error(`Error updating tax: ${err}`);
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
            console.error(`Error creating transaction: ${err}`);
            return cb(err);
          });
      }
    ], (err, data) => callback(err, data));
  }

  static get(params, callback) {
    const { filters = [] } = params;

    const documentRef = collection(db, collectionName);

    const filtersFirebase = filters.map((filter) => {
      if (filter.field === 'paymentDate') {
        filter.value = moment(filter.value).toDate().getTime();
      }
      return where(filter.field, filter.operator, filter.value);
    });

    const q = query(documentRef, ...filtersFirebase);

    return getDocs(q)
      .then((snapshot) => {
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
        console.error(`Error getting transactions: ${err}`);
        return callback({
          message: 'Error getting transactions',
          code: 'error_getting_transactions',
        });
      }
    );
  }
}

module.exports = Transaction;