const Order = require('../model/order.model');

exports.findAll = function (req, res) {
    Order.findAll(function (err, order) {
        if (err) {
            res.send(err);
        }
        console.log('res', order);
        res.send(order);
        //res.render('order.ejs', {Order: order});
    });
};

exports.create = function (req, res) {
    const new_order = new Order(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Order.create(new_order, function (err, order) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Order added successfully!", data: order });
            //res.redirect('/api/Orders');
        });
    }
}

exports.findById = function (req, res) {
    Order.findById(req.params.id, function (err, order) {
        if (err) {
            res.send(err);
        }
        res.json(order);
        //res.render('order_edit.ejs', {Order: order});
    });
}

exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Order.update(req.params.id, new Order(req.body), function (err, order) {
            if (err) {
                res.send(err);
            }
            res.json({ error: false, message: "Order successfully updated!", data: order });
            //res.redirect('/api/Orders');
        });
    }
}

exports.delete = function (req, res) {
    Order.delete(req.params.id, function (err, order) {
        if (err) {
            res.send(err);
        }
        res.json({ error: false, message: 'Order successfully deleted!' });
        //res.redirect('/api/Orders');
    });
}
