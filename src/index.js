
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

// Test database connection
async function testConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed');
        console.error(error);
    }
}

testConnection();


app.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'OK'
    });
});

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        return res.status(200).json(users);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.get('/users/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid user ID'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.post('/users', async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            error: 'username and email are required'
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
        console.error(err);

        if (err.code === 'P2002') {
            return res.status(409).json({
                error: 'username or email already taken'
            });
        }

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.patch('/users/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid user ID'
        });
    }

    const { username, email, ...otherFields } = req.body;

    const data = {};

    if (Object.hasOwn(otherFields, 'bio')) {
        data.bio = otherFields.bio;
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            error: 'No editable fields provided'
        });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.delete('/users/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid user ID'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        await prisma.user.delete({
            where: { id }
        });

        return res.status(204).send();
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});


app.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany();

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.get('/posts/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid post ID'
        });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        return res.status(200).json(post);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.post('/posts', async (req, res) => {
    const { imageUrl, caption, location } = req.body;

    if (!imageUrl) {
        return res.status(400).json({
            error: 'imageUrl is required'
        });
    }

    try {
        const post = await prisma.post.create({
            data: {
                imageUrl,
                caption,
                location
            }
        });

        return res.status(201).json(post);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.patch('/posts/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid post ID'
        });
    }

    const data = {};
    const { caption, location } = req.body;

    if (Object.hasOwn(req.body, 'caption')) {
        data.caption = caption;
    }

    if (Object.hasOwn(req.body, 'location')) {
        data.location = location;
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            error: 'No editable fields provided'
        });
    }

    try {
        const existingPost = await prisma.post.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data
        });

        return res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.delete('/posts/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid post ID'
        });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        await prisma.post.delete({
            where: { id }
        });

        return res.status(204).send();
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
});

async function shutdown() {
    server.close(async () => {
        try {
            await prisma.$disconnect();
            await pool.end();
            process.exit(0);
        } catch (err) {
            console.error('Error closing database connection:', err);
            process.exit(1);
        }
    });
}

