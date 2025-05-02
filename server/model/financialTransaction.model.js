import connection from '../config/config.bd.js';

class FinancialTransaction {
    constructor(financialTransaction) {
        this.idFinancialTransaction = financialTransaction.idFinancialTransaction;
        this.idOrder = financialTransaction.idOrder;
        this.Amount = financialTransaction.Amount;
        this.Date = financialTransaction.Date;
        this.Status = financialTransaction.Status;
        this.idWarehouse = financialTransaction.idWarehouse;
    }

    static create = function (newFinancialTransaction, result) {
        connection.query("INSERT INTO Financial_Transactions set ?", newFinancialTransaction, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res.insertId);
                result(null, res.insertId);
            }
        });
    }

    static findById = function (id, result) {
        connection.query("SELECT * FROM Financial_Transactions WHERE idFinancialTransaction = ?", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }

    static findAll = function (result) {
        connection.query("SELECT * FROM Financial_Transactions", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('financialTransaction : ', res);
                result(null, res);
            }
        });
    }

    static update = function (id, newFinancialTransaction, result) {
        connection.query("UPDATE Financial_Transactions SET idOrder=?, Amount=?, Date=?, Status=?, idWarehouse=? WHERE idFinancialTransaction = ?",
            [newFinancialTransaction.idOrder, newFinancialTransaction.Amount, newFinancialTransaction.Date, newFinancialTransaction.Status, newFinancialTransaction.idWarehouse, id],
            function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                } else {
                    result(null, res);
                }
            });
    }

    static delete = function (id, result) {
        connection.query("DELETE FROM Financial_Transactions WHERE idFinancialTransaction = ?", [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        })
    }
}
export default FinancialTransaction;
