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
  setDoc
} = require('firebase/firestore');

const async = require('async');
const moment = require('moment');
const { db } = require('../firebase');
const collectionName = 'taxes';

const taxConverter = {
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

class Tax {

  static create(params, callback) {
    const { data } = params;

    const documentRef = doc(db, collectionName, data.barcode)
      .withConverter(taxConverter);
    
    return async.waterfall([
      (cb) => {
        //check if barcode already exists
        return getDoc(documentRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              return cb({
                message: 'Barcode already exists',
                code: 'barcode_already_exists',
              });
            }
            return cb();
          })
          .catch((err) => {
            console.error(`Error checking if barcode exists: ${err}`);
            return cb({
              message: 'Error checking if barcode exists',
              code: 'unknown_error',
            });
          });
      },
      (cb) => {
        data.dueDate = moment(data.dueDate).toDate().getTime();
        return setDoc(documentRef, data)
          .then(() => {
            data.dueDate = moment(data.dueDate).format('YYYY-MM-DD');
            return cb(null, data)
          })
          .catch((err) => {
            console.error(`Error creating tax: ${err}`);
            return cb({
              message: 'Error creating tax',
              code: 'error_creating_tax',
            });
          });
      }
    ], (err, data) => callback(err, data));
  }


  static get(params, callback) {
    const { filters = [] } = params;
    
    const documentRef = collection(db, collectionName);

    const filtersFirebase = filters.map((filter) => {
      return where(filter.field, filter.operator, filter.value);
    });
    filtersFirebase.push(where('status', '==', 'pending'));

    const serviceFilter = filters.some(({ field }) => field === 'service');

    const q = query(documentRef, ...filtersFirebase);

    return getDocs(q)
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          const tax = {
            barcode: doc.id,
            dueDate: moment(data.dueDate).format('YYYY-MM-DD'),
            amount: data.amount,
          };
          if (!serviceFilter) {
            tax.service = data.service;
          }
          return tax;
        });
        return callback(null, docs);
      })
      .catch((err) => {
        console.error(`Error getting taxes: ${err}`);
        return callback({
          message: 'Error getting taxes',
          code: 'error_getting_taxes',
        });
      });
  }
}

module.exports = Tax;
