const {
  //utils
  collection,
  doc,
  //Read
  getDocs,
  query,
  //Create
  setDoc
} = require('firebase/firestore');

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
    
      //! Check if barcode already exists or check error given by firebase
    return setDoc(documentRef, data)
      .then(() => callback(null, data))
      .catch((err) => {
        console.log(`Error creating tax: ${err}`);
        return callback(err);
      });
  }


  static getTaxes(params, callback) {
    const { filters = [] } = params;
    
    const documentRef = collection(db, collectionName);

    const filtersFirebase = filters.map((filter) => {
      return query.where(filter.field, filter.operator, filter.value)
    });

    const serviceFilter = filters.some(({ field }) => field === 'service');

    const q = query(documentRef, ...filtersFirebase);

    return getDocs(q)
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          const tax = {
            barcode: doc.id,
            dueDate: data.dueDate,
            importTax: data.importTax,
          };
          if (serviceFilter) {
            tax.service = data.service;
          }
          return tax;
        });
        return callback(null, docs);
      })
      .catch((err) => {
        console.log(`Error getting taxes: ${err}`);
        return callback(err);
      });
  }
}

module.exports = Tax;
