import connection from '../config/config.bd.js';

class Order {
    constructor(order) {
        this.idOrder = order.idOrder;
        this.idSupplier = order.idSupplier;
        this.idProduct = order.idProduct;
        this.Amount = order.Amount;
        this.Status = order.Status;
    }

    static create = function (newProduct, result) {
        connection.query("INSERT INTO Orders set ?", newProduct, function (err, res) {
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
        connection.query("SELECT * FROM Orders WHERE idOrder = ?", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }

    static findAll = function (result) {
        connection.query("SELECT * FROM Orders", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('order : ', res);
                result(null, res);
            }
        });
    }

    static update = function (id, newProduct, result) {
        connection.query("UPDATE Orders SET idSupplier=?, idProduct=?, Amount=?, Status=? WHERE idOrder = ?",
            [newProduct.idSupplier, newProduct.idProduct, newProduct.Amount, newProduct.Status, id],
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
        connection.query("DELETE FROM Orders WHERE idOrder = ?", [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        })
    }
}
export default Order;
