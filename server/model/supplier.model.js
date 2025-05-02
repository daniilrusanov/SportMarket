import connection from '../config/config.bd.js';

class Supplier {
    constructor(supplier) {
        this.idSupplier = supplier.idSupplier;
        this.Name = supplier.Name;
        this.Contacts = supplier.Contacts;
        this.Terms = supplier.Terms;
        this.Status = supplier.Status;
    }

    static create = function (newProduct, result) {
        connection.query("INSERT INTO Suppliers set ?", newProduct, function (err, res) {
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
        connection.query("SELECT * FROM Suppliers WHERE idSupplier = ?", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }

    static findAll = function (result) {
        connection.query("SELECT * FROM Suppliers", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('supplier : ', res);
                result(null, res);
            }
        });
    }

    static update = function (id, newProduct, result) {
        connection.query("UPDATE Suppliers SET Name=?, Contacts=?, Terms=?, Status=? WHERE idSupplier = ?",
            [newProduct.Name, newProduct.Contacts, newProduct.Terms, newProduct.Status, id],
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
        connection.query("DELETE FROM Suppliers WHERE idSupplier = ?", [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        })
    }
}

export default Supplier;
