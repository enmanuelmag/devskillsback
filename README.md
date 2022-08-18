# Desafio Back-end

En este desafío, creará una API REST de una versión súper simplificada de un proveedor de servicios de pago de impuestos.

## Contexto

En esencia, una empresa de pago de impuestos tiene dos funciones muy importantes:

1. Permitir a las empresas proveedoras de servicios cargar las boletas ("create-tax")
2. Efectuar el pago de un impuesto ("pay-tax")

Contamos entonces con dos entidades que representan esta información:

* `transactions`: representa la información de pagos, los datos de la tarjeta, el valor, etc.
* `payables`: representa las boletas creadas, con su status correspondiente (pending, paid, etc.)

> Nota: solo es posible pagar una sola vez cada boleta

## Requisitos

Debes crear un servicio con los siguientes endpoint API:

1. Debe permitir crear una boleta de pago son la siguiente información, recibiendo la siguiente información:
    * Tipo de servicio (Luz/Gas/etc...)
    * Descripción del servicio. Ej: `'Edenor S.A.'`
    * Fecha de vencimiento. Ej (2021-01-15)
    * Importe del servicio.
    * Status del pago (pending, paid, etc.).
    * Código de barra (debe ser único - PK)

2. Debe permitir realizar un pago (transacción), recibiendo la siguiente información:
    * Método de pago (`debit_card`, `credit_card` o `cash`)
    * Número de la tarjeta (solo en caso de no ser efectivo)
    * Importe del pago
    * Código de barra
    * Fecha de pago

3. Debe permitir listar aquellas boletas impagas en forma total o filtradas por tipo de servicio, devolviendo la siguiente información:
    * Tipo de servicio (solo si se lista sin filtro)
    * Fecha de vencimiento
    * Importe del servicio
    * Código de barra

4. Debe permitir listar los pagos (transacciones) entre un período de fechas, acumulando por día, devolviendo la siguiente información:
    * Fecha de pago
    * Importe acumulado
    * Cantidad de transacciones en esa fecha

## Restricciones

1. El servicio debe estar escrito en Node.js / Python
2. El proyecto debe tener un README.md con todas las instrucciones sobre cómo ejecutar y probar el proyecto y los servicios proporcionados.
3. Subir a un repositior git con privilegios publicos de lectura y compartir el link como resultado
