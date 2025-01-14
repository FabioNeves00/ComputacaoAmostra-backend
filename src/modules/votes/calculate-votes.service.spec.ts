import { Test } from '@nestjs/testing';
import { CalculateVotesService } from './calculate-votes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { mockUsersRepository } from '../../../test/utils/mocks/users.repository';
import { Project } from '../projects/entities/project.entity';
import { mockProjectsRepository } from '../../../test/utils/mocks/projects.repository';
import { mockUsers } from '../../../test/utils/mocks/users';
import { mockProjects } from '../../../test/utils/mocks/projects';

describe('CalculateVotesService', () => {
  let calculateVotesService: CalculateVotesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CalculateVotesService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    calculateVotesService = moduleRef.get<CalculateVotesService>(
      CalculateVotesService,
    );
  });

  it('should be defined', () => {
    expect(calculateVotesService).toBeDefined();
  });

  it('should add a vote to user', async () => {
    await calculateVotesService.addVotesUser(mockUsers[0].id)
    expect(mockUsers[0].voteCount).toBe(1);
  });

  it('should add a unique vote and normal vote to project', async () => {
    await calculateVotesService.addVotesProject(mockProjects[0].id, true)
    expect(mockProjects[0].uniqueVotes).toBe(1);
    expect(mockProjects[0].totalVotes).toBe(1);
  });

  it('should add a normal vote to project', async () => {
    await calculateVotesService.addVotesProject(mockProjects[0].id, false)
    expect(mockProjects[0].totalVotes).toBe(2);
    expect(mockProjects[0].uniqueVotes).toBe(1);
  });
});
