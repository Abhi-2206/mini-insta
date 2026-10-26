const express = require('express');
const { prisma } = require('../index');

const router = express.Router();

router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;
