require ('dotenv').config();
const express = require('express');
const passport = require('passport')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 5000;

// Load mongoose models and connect to DB
require('./models/userModel');
require('./models/postModel');
require('./models/commentModel');
const connectDB = require('./config/db');

const app = express();

app.use(credentials);
app.use(cors(corsOptions));

require('./config/passport')(passport);
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain')
    next();
});

app.use((req, res, next) => {
    console.log(JSON.stringify(req.headers))
    next();
})

app.use('/comment', require('./routes/commentRouter'));
app.use('/user', require('./routes/userRouter'));
app.use('/post', require('./routes/postRouter'));

app.use(require('./middleware/errorMiddleware'));

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
})