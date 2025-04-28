import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './router/product.routes.js';
import * as path from "node:path";

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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
