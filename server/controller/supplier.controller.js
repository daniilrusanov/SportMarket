import Supplier from '../model/supplier.model.js';

const findAll = function (req, res) {
    Supplier.findAll(function (err, supplier) {
        if (err) {
            res.send(err);
        }
        console.log('res', supplier);
        res.send(supplier);
        //res.render('supplier.ejs', {Supplier: supplier});
    });
};

const create = function (req, res) {
    const new_supplier = new Supplier(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Supplier.create(new_supplier, function (err, supplier) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Supplier added successfully!", data: supplier });
            //res.redirect('/api/Suppliers');
        });
    }
}

const findById = function (req, res) {
    Supplier.findById(req.params.id, function (err, supplier) {
        if (err) {
            res.send(err);
        }
        res.json(supplier);
        //res.render('supplier_edit.ejs', {Supplier: supplier});
    });
}

const update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Supplier.update(req.params.id, new Supplier(req.body), function (err, supplier) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Supplier successfully updated!", data: supplier });
            //res.redirect('/api/Suppliers');
        });
    }
}

const deleteSupplier = function (req, res) {
    Supplier.delete(req.params.id, function (err, supplier) {
        if (err) {
            res.send(err);
        }
        res.json({ error: false, message: 'Supplier successfully deleted!' });
        //res.redirect('/api/Suppliers');
    });
}

export default { findAll, create, findById, update, deleteSupplier };