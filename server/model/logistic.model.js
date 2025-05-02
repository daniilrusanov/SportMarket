import connection from '../config/config.bd.js';

class Logistic {
    constructor(logistic) {
        this.idLogistic = logistic.idLogistic;
        this.Name = logistic.Name;
        this.Position = logistic.Position;
        this.Contacts = logistic.Contacts;
        this.Salary = logistic.Salary;
        this.idWarehouse = logistic.idWarehouse;
    }

    static create = function (newLogistic, result) {
        connection.query("INSERT INTO Logistics set ?", newLogistic, function (err, res) {
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
        connection.query("SELECT * FROM Logistics WHERE idLogistic = ?", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }

    static findAll = function (result) {
        connection.query("SELECT * FROM Logistics", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('logistic : ', res);
                result(null, res);
            }
        });
    }

    static update = function (id, newLogistic, result) {
        connection.query("UPDATE Logistics SET Name=?, Position=?, Contacts=?, Salary=?, idWarehouse=? WHERE idLogistic = ?",
            [newLogistic.Name, newLogistic.Position, newLogistic.Contacts, newLogistic.Salary, newLogistic.idWarehouse, id],
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
        connection.query("DELETE FROM Logistics WHERE idLogistic = ?", [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        })
    }
}

export default Logistic;
