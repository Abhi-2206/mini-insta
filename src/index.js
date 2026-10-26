require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log("Database connection successful");
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
}

testConnection();

// Export prisma so the routers share the same database connection
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
