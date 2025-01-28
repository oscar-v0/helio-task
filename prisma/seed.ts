import prisma from '../src/prisma';

const main = async () => {
  const company = await prisma.company.create({
    data: {
      id: '6798ef6a2b7b801acc439f00',
      name: 'helio',
      industry: 'Crypto',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      id: '6798ef6a2b7b801acc439f01',
      name: 'user1',
      email: 'user1@email.com',
      companyId: company.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: '6798ef6a2b7b801acc439f02',
      name: 'user1',
      email: 'user1@email.com',
      companyId: company.id,
    },
  });

  await prisma.project.create({
    data: {
      id: '6798ef6a2b7b801acc439f10',
      name: `Project-NoAccess`,
      status: 'Active',
      description: `Random project description. Default user has no access`,
      companyId: company.id,
    },
  });

  await Promise.all(
    [...Array(6)]
      .map((_, i) => i + 1)
      .map(async (i) => {
        const project = await prisma.project.create({
          data: {
            id: `6798ef6a2b7b801acc439f1${i}`,
            name: `Project${i}`,
            status: i % 2 === 1 ? 'Archived' : 'Active',
            description: i % 2 === 0 ? `Random project description ${i}` : null,
            companyId: company.id,
          },
        });

        await prisma.resourcePermission.create({
          data: {
            id: `6798ef6a2b7b801acc439f2${i}`,
            type: i === 1 ? ['Admin'] : i === 2 ? ['Read', 'Write'] : ['Read'],
            userId: user1.id,
            resourceId: project.id,
            resourceType: 'project',
          },
        });

        if (i % 3 === 0) {
          await prisma.resourcePermission.create({
            data: {
              id: `6798ef6a2b7b801acc439f3${i}`,
              type: ['Admin'],
              userId: user2.id,
              resourceId: project.id,
              resourceType: 'project',
            },
          });
        }
      }),
  );
};

main().catch((e) => {
  console.error('Error seeding data:', e);
  process.exit(1);
});
