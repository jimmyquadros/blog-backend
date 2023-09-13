const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;