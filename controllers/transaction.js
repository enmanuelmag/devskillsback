const router = require('express').Router();
const inspector = require('schema-inspector');

const Transaction = require('../models/transaction');
const TransactionSchema = require('../schemas/transaction');

router.post('/pay', (req, res) => {
  const body = req.body;

  // Sanitize input
  const payload = inspector.sanitize(TransactionSchema.payTransactionSanitize(), body);

  // Validate input
  return inspector.validate(
    TransactionSchema.payTransactionValidate(),
    payload.data,
    (error, result) => {
      if (!result.valid) {
        return res.status(404).json({
          code: 'BR',
          message: 'Bad Request: ' + result.format(),
        });
      } else if (error) {
        console.error(error);
        return res.status(500).json({
          code: 'UE',
          message: 'Server Error: ' + error.message,
        });
      }
      return Transaction.pay({ data: payload.data }, (err, transaction) => {
        if (err) {
          return res.status(500).json({
            code: 'UE',
            message: err.message,
          });
        }
        return res.status(201).json({
          code: 'SC',
          message: 'Success: Tax paid',
          data: transaction,
        });
      });
    });
});


router.post('/', (req, res) => {

  const payload = inspector.sanitize(TransactionSchema.getTransactionsSanitize(), req.body);

  return inspector.validate(
    TransactionSchema.getTransactionsValidate(),
    payload.data,
    (error, result) => {
      if (!result.valid) {
        return res.status(404).json({
          code: 'BR',
          message: 'Bad Request: ' + result.format(),
        });
      } else if (error) {
        return res.status(500).json({
          code: 'UE',
          message: 'Server Error: ' + error.message,
        });
      }

      return Transaction.get(payload.data, (err, transaction) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(201).json({
          code: 'SC',
          message: 'Success: Transaction found',
          data: transaction,
        });
      });
    }
  );
});

module.exports = router;