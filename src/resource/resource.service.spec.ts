import { ResourceService } from './resource.service';

const dummy = {
  user: [
    {
      id: '6798ef6a2b7b801acc439f01',
      name: 'user1',
      email: 'user1@email.com',
      companyId: '6798ef6a2b7b801acc439f00',
    },
  ],

  project: [
    {
      id: '6798ef6a2b7b801acc439f10',
      name: 'Dummy',
      status: 'Active',
      description: '',
      companyId: '6798ef6a2b7b801acc439f22',
    },
  ],
  resourcePermission: [
    {
      id: '6798ef6a2b7b801acc439f20',
      userId: '6798ef6a2b7b801acc439f01',
      resourceType: 'project',
      resourceId: '6798ef6a2b7b801acc439f10',
      type: ['Read'],
    },
  ],
};

jest.mock('../prisma', () => {
  return {
    __esModule: true, // this property makes it work
    default: {
      user: {
        findUnique: ({ where: { id } }) => {
          return dummy.user.find((u) => u.id === id);
        },
      },
      project: {
        findUnique: ({ where: { id } }) => {
          return dummy.project.find((p) => p.id === id);
        },
      },
      resourcePermission: {
        findUnique: ({
          where: {
            resourceId_resourceType_userId: { resourceId, resourceType, userId },
          },
        }) => {
          return dummy.resourcePermission.find(
            (r) => r.resourceId === resourceId && r.resourceType === resourceType && r.userId === userId,
          );
        },
      },
    },
  };
});

describe('Resource Service', () => {
  let resourceService: ResourceService;

  beforeEach(async () => {
    resourceService = new ResourceService();
  });

  it('should be authorized', async () => {
    const res = await resourceService.getOne({
      userId: dummy.user[0].id,
      resourceId: dummy.project[0].id,
      resourceType: 'project',
    });

    expect(res).toEqual(dummy.project[0]);
  });

  it('should NOT be authorized', async () => {
    const res = resourceService.deleteOne({
      userId: dummy.user[0].id,
      resourceId: dummy.project[0].id,
      resourceType: 'project',
    });

    expect(res).rejects.toThrow(`Required permission: Delete, granted: Read`);
  });
});
