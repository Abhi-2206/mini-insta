
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



app.get('/health', (req, res) => {
    return res.status(200).json({
        status: "OK"
    });
});





app.get('/users', async (req, res) => {
    let page = Number(req.query.page || 1);
    let limit = Number(req.query.limit || 10);

    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const { isPrivate, search } = req.query;

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page <= 0 ||
        limit <= 0
    ) {
        return res.status(400).json({
            error: "page and limit must be positive integers"
        });
    }

    limit = Math.min(limit, 50);

    if (!['createdAt', 'username', 'fullname'].includes(sortBy)) {
        return res.status(400).json({
            error: "sortBy must be one of: createdAt, username, fullname"
        });
    }

    if (!['asc', 'desc'].includes(order)) {
        return res.status(400).json({
            error: "order must be asc or desc"
        });
    }

    if (isPrivate !== undefined &&
        isPrivate !== 'true' &&
        isPrivate !== 'false') {
        return res.status(400).json({
            error: "isPrivate must be true or false"
        });
    }

    const where = {};

    if (isPrivate !== undefined) {
        where.isPrivate = isPrivate === 'true';
    }

    if (search) {
        where.OR = [
            {
                username: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            {
                fullname: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        ];
    }

    try {
        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                orderBy: {
                    [sortBy]: order
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.user.count({
                where
            })
        ]);

        return res.status(200).json({
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


// Get one user
app.get('/users/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid user ID"
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(200).json(user);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});



app.post('/users', async (req, res) => {
    const { username, email, fullname, bio, isPrivate } = req.body;

    if (!username || !email || !fullname) {
        return res.status(400).json({
            error: "username, email and fullname are required"
        });
    }

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                fullname,
                bio: bio ?? null,
                isPrivate: isPrivate ?? false
            }
        });

        return res.status(201).json(user);

    } catch (err) {
        console.log(err);

        if (err.code === 'P2002') {
            return res.status(409).json({
                error: "username or email already taken"
            });
        }

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});



app.patch('/users/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { fullname, bio, isPrivate } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid user ID"
        });
    }

    const data = {};

    if (fullname !== undefined) data.fullname = fullname;
    if (bio !== undefined) data.bio = bio;
    if (isPrivate !== undefined) data.isPrivate = isPrivate;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            error: "No editable fields provided"
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        return res.status(200).json(updatedUser);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});



app.delete('/users/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid user ID"
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        await prisma.user.delete({
            where: { id }
        });

        return res.status(204).send();

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.get('/posts', async (req, res) => {
    let page = Number(req.query.page || 1);
    let limit = Number(req.query.limit || 10);

    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const { location, search, from, to } = req.query;

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page <= 0 ||
        limit <= 0
    ) {
        return res.status(400).json({
            error: "page and limit must be positive integers"
        });
    }

    limit = Math.min(limit, 50);

    if (!['createdAt', 'updatedAt'].includes(sortBy)) {
        return res.status(400).json({
            error: "sortBy must be one of: createdAt, updatedAt"
        });
    }

    if (!['asc', 'desc'].includes(order)) {
        return res.status(400).json({
            error: "order must be asc or desc"
        });
    }

    function validDate(value) {
        if (!value) return true;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
        }

        const date = new Date(value + 'T00:00:00.000Z');

        return !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value;
    }

    if (!validDate(from) || !validDate(to)) {
        return res.status(400).json({
            error: "from and to must be valid dates"
        });
    }

    const where = {};

    if (location) {
        where.location = {
            equals: location,
            mode: 'insensitive'
        };
    }

    if (search) {
        where.caption = {
            contains: search,
            mode: 'insensitive'
        };
    }

    if (from || to) {
        where.createdAt = {};

        if (from) {
            where.createdAt.gte = new Date(from + 'T00:00:00.000Z');
        }

        if (to) {
            where.createdAt.lt = new Date(to + 'T00:00:00.000Z');
        }
    }

    try {
        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                where,
                orderBy: {
                    [sortBy]: order
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.post.count({
                where
            })
        ]);

        return res.status(200).json({
            data: posts,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.get('/posts/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid post ID"
        });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        return res.status(200).json(post);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.post('/posts', async (req, res) => {
    const { imageUrl, caption, location } = req.body;

    if (!imageUrl) {
        return res.status(400).json({
            error: "imageUrl is required"
        });
    }

    try {
        const post = await prisma.post.create({
            data: {
                imageUrl,
                caption: caption ?? null,
                location: location ?? null
            }
        });

        return res.status(201).json(post);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.patch('/posts/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { caption, location } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid post ID"
        });
    }

    const data = {};

    if (caption !== undefined) data.caption = caption;
    if (location !== undefined) data.location = location;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            error: "No editable fields provided"
        });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data
        });

        return res.status(200).json(updatedPost);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.delete('/posts/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "Invalid post ID"
        });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        await prisma.post.delete({
            where: { id }
        });

        return res.status(204).send();

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
