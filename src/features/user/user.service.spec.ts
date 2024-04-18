import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../../core/database/database.service';
import { usersMockData } from '../../core/mocks/user.mock';

describe('UserService', () => {
  let userService: UserService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, DatabaseService],
    }).compile();

    userService = module.get<UserService>(UserService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = usersMockData.usersData;
      jest
        .spyOn(databaseService.users, 'findMany')
        .mockImplementation(() => Promise.resolve(result) as any);

      expect(await userService.findAll(1, 10)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = usersMockData.userData;
      jest
        .spyOn(databaseService.users, 'findUnique')
        .mockImplementation(() => Promise.resolve(result) as any);

      expect(await userService.findOne(1)).toBe(result);
    });
  });
});
