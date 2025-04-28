import connection from '../config/config.bd.js';

class Product {
    constructor(product) {
        this.idProduct = product.idProduct;
        this.Name = product.Name;
        this.Category = product.Category;
        this.Price = product.Price;
        this.Amount = product.Amount;
        this.idSupplier = product.idSupplier;
        this.idWarehouse = product.idWarehouse;
    }

    static create(newProduct, result) {
        connection.query("INSERT INTO Products set ?", newProduct, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res.insertId);
                result(null, res.insertId);
            }
        });
    }

    static findById(id, result) {
        connection.query("SELECT * FROM Products WHERE idProduct = ?", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }

    static findAll(result) {
        connection.query("SELECT * FROM Products", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('product : ', res);
                result(null, res);
            }
        });
    }

    static update(id, newProduct, result) {
        connection.query("UPDATE Products SET Name=?, Category=?, Price=?, Amount=?, idSupplier=?, idWarehouse=? WHERE idProduct = ?",
            [newProduct.Name, newProduct.Category, newProduct.Price, newProduct.Amount, newProduct.idSupplier, newProduct.idWarehouse, id],
            function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                } else {
                    result(null, res);
                }
            });
    }

    static delete(id, result) {
        connection.query("DELETE FROM Products WHERE idProduct = ?", [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        });
    }
}

export default Product; // Експортуємо клас за замовчуванням
