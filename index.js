const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const dbConnect = require("./config/dbConnect");

const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

//Router Here
const router = require('./routes/index');

//Database Connection
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

//add routes
app.use(router);

app.all('*', (req, res) => {
    res.send("404 Not Found");
});

app.use('/', (req, res) => {
    res.send("Hello from server side");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});