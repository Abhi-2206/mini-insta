require('dotenv').config();

const express = require('express');
const { prisma } = require('./db');

const app = express();

app.use(express.json());

async function testConnection() {
    try {
        console.log("Database connection successful");
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
}

testConnection();


module.exports = { prisma };

const userRouter = require('./router/userRouter');
const postRouter = require('./router/postRouter');

app.get('/health', (req, res) => {
    return res.status(200).json({
        status: "OK"
    });
});

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
