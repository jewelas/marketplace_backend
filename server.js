const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
const app = express()
const mongoose = require('mongoose')
const config = require('./config/keys')

//Controllers
const ActivityController = require('./controllers/ActivityController')
const AdminController = require('./controllers/AdminController')
const UserController = require('./controllers/UserController')
const CollectionController = require('./controllers/CollectionController')
const ItemController = require('./controllers/ItemController')
const BidController = require('./controllers/BidController')
const OrderController = require('./controllers/OrderController')

var http = require('http').createServer(app);
var io = require('socket.io')(http);

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
let db = mongoose.connection;
db.once('open', () => console.log('MongoDB connected'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(session({
    secret: "k5Zurj4",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true
    }
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
app.use('/activity', ActivityController);
app.use('/user', UserController);
app.use('/admin', AdminController);
app.use('/collection', CollectionController);
app.use('/item', ItemController);
app.use('/bid', BidController);
app.use('/order', OrderController);
app.listen(process.env.PORT || 5000, () => { });

io.on('connection', (socket) => {
    console.log('new client connected');
    socket.emit('connection', null);
});