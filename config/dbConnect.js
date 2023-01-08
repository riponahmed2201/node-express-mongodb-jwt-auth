const { default: mongoose } = require("mongoose");

mongoose.set('strictQuery', false);

const dbConnect = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully!");
    } catch (error) {
        console.log("Database error");
        throw new Error(error);
    }
};

module.exports = dbConnect;