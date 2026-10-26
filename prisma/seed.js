
const { prisma } = require("../src/db");
const { users, posts, likes } = require("./seed-data");

async function main() {
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    })),
  });

  const userIdByUsername = new Map(
    createdUsers.map((user) => [user.username, user.id])
  );

  const createdPosts = await prisma.post.createManyAndReturn({
    data: posts.map((post) => {
      const { author, key, ...postData } = post;
      const authorId = userIdByUsername.get(author);

      if (!authorId) {
        throw new Error(`User not found for post author: ${author}`);
      }

      return {
        ...postData,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        authorId,
      };
    }),
  });

  const postIdByKey = new Map(
    createdPosts.map((createdPost) => {
      const originalPost = posts.find(
        (post) => post.imageUrl === createdPost.imageUrl
      );

      if (!originalPost) {
        throw new Error(
          `Seed data not found for post: ${createdPost.imageUrl}`
        );
      }

      return [originalPost.key, createdPost.id];
    })
  );

  const createdLikes = await prisma.like.createMany({
    data: likes.map((like) => {
      const userId = userIdByUsername.get(like.user);
      const postId = postIdByKey.get(like.post);

      if (!userId) {
        throw new Error(`User not found for like: ${like.user}`);
      }

      if (!postId) {
        throw new Error(`Post not found for like: ${like.post}`);
      }

      return { userId, postId };
    }),
  });

  console.log(
    `🌱 Seeded ${createdUsers.length} users, ${createdPosts.length} posts and ${createdLikes.count} likes`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
