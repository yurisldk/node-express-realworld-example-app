const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const tagNames = ['tech', 'health', 'science', 'travel', 'sports'];
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          password: faker.internet.password(),
          image: faker.image.avatar(),
          bio: faker.lorem.sentence(),
          demo: true,
        },
      })
    )
  );

  const articles = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: 10 }).map(() =>
        prisma.article.create({
          data: {
            slug: faker.lorem.slug(),
            title: faker.lorem.sentence(),
            description: faker.lorem.sentences(2),
            body: faker.lorem.paragraphs(3),
            authorId: user.id,
            tagList: {
              connect: [
                { name: tags[Math.floor(Math.random() * tags.length)].name },
              ],
            },
          },
        })
      )
    )
  );

  await Promise.all(
    articles.flatMap((article) =>
      users.map((user) =>
        prisma.comment.create({
          data: {
            body: faker.lorem.sentences(2),
            articleId: article.id,
            authorId: user.id,
          },
        })
      )
    )
  );

  for (const user of users) {
    const followTargets = users.filter((u) => u.id !== user.id);
    const followCount = faker.number.int({ min: 3, max: 5 });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        following: {
          connect: followTargets
            .sort(() => 0.5 - Math.random())
            .slice(0, followCount)
            .map((u) => ({ id: u.id })),
        },
      },
    });
  }

  for (const user of users) {
    const favoriteArticles = articles
      .sort(() => 0.5 - Math.random())
      .slice(0, faker.number.int({ min: 5, max: 15 }));

    await prisma.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          connect: favoriteArticles.map((article) => ({ id: article.id })),
        },
      },
    });
  }

  console.log('Database seeding completed!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });