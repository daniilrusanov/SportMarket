import Product from '../model/product.model.js';

const findAll = function (req, res) {
    Product.findAll(function (err, product) {
        if (err) {
            res.send(err);
        }
        console.log('res', product);
        // res.send(product);
        res.render('products', { Product: product });
    });
};

const create = function (req, res) {
    const new_product = new Product(req.body);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Product.create(new_product, function (err, product) {
            if (err) {
                res.send(err);
            }
            // res.json({ error: false, message: "Product added successfully!", data: product });
            res.redirect('/');
        });
    }
}

const findById = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            res.send(err);
        }
        // res.json(product);
        res.render('product_edit', { Product: product });
    });
}

const update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        Product.update(req.params.id, new Product(req.body), function (err, product) {
            if (err) {
                res.send(err);
            }
            // res.json({ error: false, message: "Product successfully updated!", data: product });
            res.redirect('/');
        });
    }
}

const deleteProduct = function (req, res) {
    Product.delete(req.params.id, function (err, product) {
        if (err) {
            res.send(err);
        }
        // res.json({ error: false, message: 'Product successfully deleted!' });
        res.redirect('/');
    });
}

// Тепер експортуємо методи за замовчуванням
export default { findAll, create, findById, update, deleteProduct };
