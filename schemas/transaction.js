module.exports.payTransactionSanitize = function () {
  return {
    type: 'object',
    properties: {
      method: {
        type: 'string',
      },
      cardNumber: {
        type: 'string',
      },
      amount: {
        type: 'number',
      },
      barcode: {
        type: 'string',
      },
      paymentDate: {
        type: 'string',
      }
    },
  };
};

module.exports.payTransactionValidate = function () {
  return {
    type: 'object',
    properties: {
      method: {
        type: 'string',
        eq: ['debit_card', 'credit_card', 'cash'],
      },
      cardNumber: {
        type: 'string',
        minLength: 1,
      },
      amount: {
        type: 'number',
        gt: 0,
      },
      barcode: {
        type: 'string',
        minLength: 1,
      },
      paymentDate: {
        type: 'string',
        minLength: 1,
      }
    }
  };
};

module.exports.getTransactionsSanitize = function () {
  return {
    type: 'object',
    properties: {
      filters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
            value: {
              type: 'string',
            },
            operator: {
              type: 'string',
            },
          },
        },
      },
    }
  };
};

module.exports.getTransactionsValidate = function () {
  return {
    type: 'object',
    properties: {
      filters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              eq: [
                'paymentDate',
                'method',
                'amount',
              ],
            },
            value: {
              type: 'string',
              minLength: 1,
            },
            operator: {
              type: 'string',
              eq: ['==', '!=', '>', '<', '>=', '<='],
            },
          },
        },
      },
    },
  };
};
