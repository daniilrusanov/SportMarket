import connection from '../config/config.bd.js';

class Warehouse {
    constructor(warehouse) {
        this.idWarehouse = warehouse.idWarehouse;
        this.Location = warehouse.Location;
        this.Capacity = warehouse.Capacity;
        this.Workloaad = warehouse.Workloaad;
    }

    static create = function (newWarehouse, result) {
        connection.query("INSERT INTO Warehouses set ?", newWarehouse, function (err, res) {
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
        connection.query("SELECT * FROM Warehouses WHERE idWarehouse = ?", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }

    static findAll = function (result) {
        connection.query("SELECT * FROM Warehouses", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('warehouse : ', res);
                result(null, res);
            }
        });
    }

    static update = function (id, newWarehouse, result) {
        connection.query("UPDATE Warehouses SET Location=?, Capacity=?, Workloaad=? WHERE idWarehouse = ?",
            [newWarehouse.Location, newWarehouse.Capacity, newWarehouse.Workloaad, id],
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
        connection.query("DELETE FROM Warehouses WHERE idWarehouse = ?", [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        })
    }
}

export default Warehouse;
