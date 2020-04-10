const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();
const authRouter = require('./routes/admin/auth');
const adminProductRouter = require('./routes/admin/products');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
app.use(express.static('public'));
app.use(cookieSession({ keys: [ 'ianoiufniubqiuebnwq' ] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authRouter);
app.use(adminProductRouter);
app.use(productRouter);
app.use(cartRouter);

// app.get('/', async (req, res) => {
// 	const a = await ProductsRepository.getAll();
// 	// res.send(a);
// 	res.send('a');
// });
// app.get('/', (req, res) => res.send('hello'));

app.listen(3000, () => console.log('Listening on Port:3000'));
