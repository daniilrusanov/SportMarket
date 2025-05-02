import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import * as path from "node:path";

import productRoutes from './router/product.routes.js';
const financialTransactionRoutes = require('./router/financialTransaction.routes');
const logisticsRoutes = require('./router/logistic.routes');
const ordersRoutes = require('./router/order.routes');
const suppliersRoutes = require('./router/supplier.routes');
const warehouseRoutes = require('./router/warehouse.routes');


const PORT = 5000;
const app = express();

app.set('views', path.join('server', 'views'));

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static('.'));

app.get('/', (req, res) => {
    res.status(200).json({'Сервер працює': 'Успішно'});
    // res.render('index.ejs');
})

app.use('/api/Products', productRoutes);
app.use('/api/FinancialTransactions', financialTransactionRoutes);
app.use('/api/Logistics', logisticsRoutes);
app.use('/api/Orders', ordersRoutes);
app.use('/api/Suppliers', suppliersRoutes);
app.use('/api/Warehouses', warehouseRoutes);


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
