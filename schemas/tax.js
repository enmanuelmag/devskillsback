module.exports.createTaxSanitize = function () {
  return {
    type: 'object',
    properties: {
      service: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      dueDate: {
        type: 'string',
      },
      amount: {
        type: 'number',
      },
      status: {
        type: 'string',
      },
      barcode: {
        type: 'string',
      },
    },
  };
};

module.exports.createTaxValidate = function () {
  return {
    type: 'object',
    properties: {
      service: {
        type: 'string',
        minLength: 1,
      },
      description: {
        type: 'string',
        minLength: 1,
      },
      dueDate: {
        type: 'string',
        minLength: 1,
      },
      amount: {
        type: 'number',
        gt: 0,
      },
      status: {
        type: 'string',
        eq: ['pending', 'paid', 'cancelled'],
      },
      barcode: {
        type: 'string',
        minLength: 1,
      },
    },
  };
};

module.exports.getTaxesSanitize = function () {
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
    },
  };
};

module.exports.getTaxesValidate = function () {
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
                'service',
                'description',
                'dueDate',
                'amount',
                'status',
                'barcode',
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
