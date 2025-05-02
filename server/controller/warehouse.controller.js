import Warehouse from '../model/warehouse.model.js';

const findAll = function (req, res) {
    Warehouse.findAll(function (err, warehouse) {
        if (err) {
            res.send(err);
        }
        console.log('res', warehouse);
        res.send(warehouse);
        //res.render('warehouse.ejs', {Warehouse: warehouse});
    });
};

const create = function (req, res) {
    const new_warehouse = new Warehouse(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Warehouse.create(new_warehouse, function (err, warehouse) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Warehouse added successfully!", data: warehouse });
            //res.redirect('/api/Warehouses');
        });
    }
}

const findById = function (req, res) {
    Warehouse.findById(req.params.id, function (err, warehouse) {
        if (err) {
            res.send(err);
        }
        res.json(warehouse);
        //res.render('warehouse_edit.ejs', {Warehouse: warehouse});
    });
}

const update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Warehouse.update(req.params.id, new Warehouse(req.body), function (err, warehouse
        ) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Warehouse successfully updated!", data: warehouse });
            //res.redirect('/api/Warehouses');
        });
    }
}

const deleteWarehouse = function (req, res) {
    Warehouse.delete(req.params.id, function (err, warehouse) {
        if (err) {
            res.send(err);
        }
        res.json({ error: false, message: 'Warehouse successfully deleted!' });
        //res.redirect('/api/Warehouses');
    });
}

export default { findAll, create, findById, update, deleteWarehouse };