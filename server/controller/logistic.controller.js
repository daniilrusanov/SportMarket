import Logistic from '../model/logistic.model.js';

const findAll = function (req, res) {
    Logistic.findAll(function (err, logistic) {
        if (err) {
            res.send(err);
        }
        console.log('res', logistic);
        res.send(logistic);
        //res.render('logistic.ejs', {Logistic: logistic});
    });
};

const create = function (req, res) {
    const new_logistic = new Logistic(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Logistic.create(new_logistic, function (err, logistic) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Logistic added successfully!", data: logistic });
            //res.redirect('/api/logistics');
        });
    }
}

const findById = function (req, res) {
    Logistic.findById(req.params.id, function (err, logistic) {
        if (err) {
            res.send(err);
        }
        res.json(logistic);
        //res.render('logistic_edit.ejs', {Logistic: logistic});
    });
}

const update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Logistic.update(req.params.id, new Logistic(req.body), function (err, logistic) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Logistic successfully updated!", data: logistic });
            //res.redirect('/api/logistics');
        });
    }
}

const deleteLogistic = function (req, res) {
    Logistic.delete(req.params.id, function (err, logistic) {
        if (err) {
            res.send(err);
        }
        res.json({ error: false, message: 'Logistic successfully deleted!' });
        //res.redirect('/api/logistics');
    });
}

export default { findAll, create, findById, update, deleteLogistic };