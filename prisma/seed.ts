import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function fakeContent() {
  const randomNumber = Math.floor(Math.random() * 7) + 1;
  return faker.lorem.paragraphs(randomNumber, "<br/>");
}

async function seed() {
  // Clean up the tables
  await prisma.collection.deleteMany({});
  await prisma.article.deleteMany({});

  // Create the records
  const { id: designId } = await prisma.collection.create({
    data: {
      name: "Design",
      description: 'Refere-se a edição em banners para web, edição de fotos e artes gráficas para uso no projeto.',
    },
  });

  const { id: developmentId } = await prisma.collection.create({
    data: {
      name: "Desenvolvimento",
      description: 'Dúvidas relacionadas ao desenvolvimento da aplicação.',
    },
  });

  const { id: specsId } = await prisma.collection.create({
    data: {
      name: "Especificações e requisições.",
      description: 'Elaboração de características técnicas para aquisição de documentações e contextos utilizados no desenvolvimento.',
    },
  });

  const { id: managerUserId } = await prisma.collection.create({
    data: {
      name: "Gerenciamento de usuário / Login.",
      description: 'Refere-se a modificação de senha, grupos (G:), requisição de login para acesso a sistemas e computadores.',
    },
  });

  const { id: helpDeskId } = await prisma.collection.create({
    data: {
      name: "Helpdesk.",
      description: 'Dúvidas em geral.',
    },
  });


  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
