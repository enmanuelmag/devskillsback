# Usage

1. Install dependencies

```bash
npm install
```

2. Run the server

```bash
npm start
```

3. Test backend, you can use postman or curl to test the API. In the root of the project you can find a JSON file with a Postman collection to be imported in Postman.

```json
http://localhost:9050/v1/tax/create
{
    "service": "luz",
    "description": "luz pública",
    "amount": 50,
    "status": "pending",
    "barcode": "fq9i3hfiqbriub3uhfq9",
    "dueDate": "2020-08-17"
}

http://localhost:9050/v1/tax
{
    "filters": [
        {
            "field": "service",
            "operator": "==",
            "value": "agua"
        }
    ]
}


http://localhost:9050/v1/transaction/pay
{
    "method": "cash",
    "amount": 50,
    "barcode": "fq9i3hfiqbriub3uhfq9",
    "paymentDate": "2022-08-15"
}

http://localhost:9050/v1/transaction
{
    "filters": [
        {
            "field": "paymentDate",
            "operator": ">",
            "value": "2022-08-10"
        },
        {
            "field": "paymentDate",
            "operator": "<",
            "value": "2022-08-20"
        }
    ]
}
```
