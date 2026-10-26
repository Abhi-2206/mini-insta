// prisma/seed.js
// Run with: npx prisma db seed  OR  npm run seed
//
// Strategy for idempotency (safe to run multiple times):
//   1. Delete all posts first (no FK constraints in our schema, but good practice)
//   2. Delete all users
//   3. Create all users in one query
//   4. Create all posts in one query
//
// This guarantees exactly 12 users and 24 posts after every run.

require('dotenv').config();

const { prisma } = require('../src/db');
const { users, posts } = require('./seed-data');

async function main() {
    // Step 1: Wipe existing data (posts first, then users)
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Step 2: Insert all users in a single query
    const createdUsers = await prisma.user.createManyAndReturn({
        data: users
    });

    // Step 3: Insert all posts in a single query
    const createdPosts = await prisma.post.createManyAndReturn({
        data: posts
    });

    console.log(`🌱 Seeded ${createdUsers.length} users and ${createdPosts.length} posts`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
