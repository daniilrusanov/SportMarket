import FinancialTransaction from '../model/financialTransaction.model.js';

const findAll = function (req, res) {
    FinancialTransaction.findAll(function (err, financialTransaction) {
        if (err) {
            res.send(err);
        }
        console.log('res', financialTransaction);
        res.send(financialTransaction);
        //res.render('financialTransaction.ejs', {FinancialTransaction: financialTransaction});
    });
};

const create = function (req, res) {
    const new_financialTransaction = new FinancialTransaction(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        FinancialTransaction.create(new_financialTransaction, function (err, financialTransaction) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "FinancialTransaction added successfully!", data: financialTransaction });
            //res.redirect('/api/FinancialTransactions');
        });
    }
}

const findById = function (req, res) {
    FinancialTransaction.findById(req.params.id, function (err, financialTransaction) {
        if (err) {
            res.send(err);
        }
        res.json(financialTransaction);
        //res.render('financialTransaction_edit.ejs', {FinancialTransaction: financialTransaction});
    });
}

const update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        FinancialTransaction.update(req.params.id, new FinancialTransaction(req.body), function (err, financialTransaction) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "FinancialTransaction successfully updated!", data: financialTransaction });
            //res.redirect('/api/FinancialTransactions');
        });
    }
}

const deleteFinancialTransaction = function (req, res) {
    FinancialTransaction.delete(req.params.id, function (err, financialTransaction) {
        if (err) {
            res.send(err);
        }
        res.json({ error: false, message: 'FinancialTransaction successfully deleted!' });
        //res.redirect('/api/FinancialTransactions');
    });
}

export default { findAll, create, findById, update, deleteFinancialTransaction };