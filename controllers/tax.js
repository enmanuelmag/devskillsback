const router = require('express').Router();
const inspector = require('schema-inspector');

const Tax = require('../models/tax');
const TaxSchema = require('../schemas/tax');

router.post('/create', (req, res) => {
  const body = req.body;

  // Sanitize input
  const payload = inspector.sanitize(TaxSchema.createTaxSanitize(), body);

  // Validate input
  return inspector.validate(
    TaxSchema.createTaxValidate(),
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

      return Tax.create({ data: payload.data }, (err, tax) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(201).json({
          code: 'SC',
          message: 'Success: Tax created',
          data: tax,
        });
      });
    }
  );
});

router.post('/', (req, res) => {

  const payload = inspector.sanitize(TaxSchema.getTaxesSanitize(), req.body);

  return inspector.validate(
    TaxSchema.getTaxesValidate(),
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

      return Tax.get(payload.data, (err, taxes) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json({
          code: 'SC',
          message: 'Success: Taxes retrieved',
          data: taxes,
        });
      }
    );
  });
})

module.exports = router;