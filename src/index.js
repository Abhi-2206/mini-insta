
require('dotenv').config();

const express = require('express')
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require("@prisma/adapter-pg")
const { Pool } = require('pg')


const app = express()

app.use(express.json())

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter })




async function testConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Database connection successful");
    } catch (error) {
        console.error("❌ Database connection failed");
        console.error(error);
    }
}

testConnection();




app.get('/health', (req, res) => {

    res.status(200).json({ status: 'OK' })
})

app.get('/users', async(req, res) => {
    try{
        const user = await prisma.user.findMany();

        return res.status(200).json(user)
    }catch(err){

        console.log(err)

        return res.status(500).json({
            error:"Internal server error"
        })
    }
})

app.get('/users/:id', async (req, res) => {

    const id = +(req.params.id);


    try{
        const user = await prisma.user.findUnique({
            where:{
                id:id
            }
        })

        if(!user){
            return res.status(404).json({
                error:"User not found"
            })
        }
        return res.status(200).json(user)
    }catch(err){
        console.log(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }

})

app.get('/posts', (req, res) => {

})

app.get('/posts/:id', (req, res) => {

})


app.post('/users', async (req, res) => {

    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            error: "username and email are required"
        });
    }

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email
            }
        });

        return res.status(201).json(user);

    } catch (err) {
       
            return res.status(409).json({
                error: "username or email already taken"
            });

        console.log(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.post('/posts', (req, res) => {

})


app.patch('/users/:id', (req, res) => {

})

app.patch('/posts/:id', (req, res) => {

})


app.delete('/users/:id', (req, res) => {

})

app.delete('/posts/:id', (req, res) => {

})


app.listen(3000)
