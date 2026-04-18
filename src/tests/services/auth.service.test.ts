import * as bcrypt from 'bcryptjs';
import prismaMock from '../prisma-mock';
import {
  createUser,
  login,
  updateUser,
} from '../../app/routes/auth/auth.service';

const prismaUserMock = prismaMock.user as unknown as {
  create: unknown;
  update: unknown;
  findUnique: unknown;
};

const mockResolvedValue = <T>(mockFn: unknown, value: T) => {
  (mockFn as { mockResolvedValue: (mockValue: T) => void }).mockResolvedValue(
    value
  );
};

const mockResolvedValueOnce = <T>(mockFn: unknown, value: T) => {
  (
    mockFn as { mockResolvedValueOnce: (mockValue: T) => void }
  ).mockResolvedValueOnce(value);
};

describe('AuthService', () => {
  describe('createUser', () => {
    test('should create new user ', async () => {
      const uniqueIdentifier = Date.now().toString();
      // Given
      const user = {
        id: 123,
        username: `RealWorld ${uniqueIdentifier}`,
        email: `realworld-${uniqueIdentifier}@me`,
        password: '1234',
      };

      const mockedResponse = {
        id: 123,
        username: `RealWorld ${uniqueIdentifier}`,
        email: `realworld-${uniqueIdentifier}@me`,
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      mockResolvedValue(prismaUserMock.create, mockedResponse);

      // Then
      await expect(createUser(user)).resolves.toHaveProperty('token');
    });

    test('should throw an error when creating new user with empty username ', async () => {
      // Given
      const user = {
        id: 123,
        username: ' ',
        email: 'realworld@me',
        password: '1234',
      };

      // Then
      const error = String({ errors: { username: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an error when creating new user with empty email ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: '  ',
        password: '1234',
      };

      // Then
      const error = String({ errors: { email: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an error when creating new user with empty password ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: ' ',
      };

      // Then
      const error = String({ errors: { password: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an exception when creating a new user with already existing user on same username ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
      };

      const mockedExistingUser = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      mockResolvedValue(prismaUserMock.findUnique, mockedExistingUser);

      // Then
      const error = { email: ['has already been taken'] }.toString();
      await expect(createUser(user)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    test('should return a token', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: '1234',
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: hashedPassword,
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      mockResolvedValue(prismaUserMock.findUnique, mockedResponse);

      // Then
      await expect(login(user)).resolves.toHaveProperty('token');
    });

    test('should throw an error when the email is empty', async () => {
      // Given
      const user = {
        email: ' ',
        password: '1234',
      };

      // Then
      const error = String({ errors: { email: ["can't be blank"] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error when the password is empty', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: ' ',
      };

      // Then
      const error = String({ errors: { password: ["can't be blank"] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error when no user is found', async () => {
      // Given
      const noValidUser = {
        email: 'no-valid@me',
        password: '1234',
      };

      // When
      mockResolvedValue(prismaUserMock.findUnique, null);

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(noValidUser)).rejects.toThrow(error);
    });

    test('should throw an error if the password is wrong', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: 'novalid-password',
      };

      const hashedPassword = await bcrypt.hash('4321', 10);

      const mockedResponse = {
        id: 123,
        username: 'Gerome',
        email: 'realworld@me',
        password: hashedPassword,
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      mockResolvedValue(prismaUserMock.findUnique, mockedResponse);

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(user)).rejects.toThrow(error);
    });
  });

  describe('updateUser', () => {
    test('should update user without checking uniqueness for omitted fields', async () => {
      const updatedUser = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        bio: 'Updated bio',
        image: null,
      };

      mockResolvedValue(prismaUserMock.update, updatedUser);

      await expect(
        updateUser({ bio: 'Updated bio' }, 123)
      ).resolves.toHaveProperty('token');
      expect(prismaUserMock.findUnique).not.toHaveBeenCalled();
    });

    test('should allow updating when email and username belong to the same user', async () => {
      const updatedUser = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        bio: null,
        image: null,
      };

      mockResolvedValueOnce(prismaUserMock.findUnique, { id: 123 } as never);
      mockResolvedValueOnce(prismaUserMock.findUnique, { id: 123 } as never);
      mockResolvedValue(prismaUserMock.update, updatedUser);

      await expect(
        updateUser({ email: 'realworld@me', username: 'RealWorld' }, 123)
      ).resolves.toHaveProperty('token');
    });

    test('should throw an error when updating user with already existing email', async () => {
      mockResolvedValueOnce(prismaUserMock.findUnique, { id: 999 } as never);

      const error = String({ errors: { email: ['has already been taken'] } });
      await expect(updateUser({ email: 'realworld@me' }, 123)).rejects.toThrow(
        error
      );
    });

    test('should throw an error when updating user with already existing username', async () => {
      mockResolvedValueOnce(prismaUserMock.findUnique, { id: 999 } as never);

      const error = String({
        errors: { username: ['has already been taken'] },
      });
      await expect(updateUser({ username: 'RealWorld' }, 123)).rejects.toThrow(
        error
      );
    });

    test('should throw an error when updating user with already existing email and username', async () => {
      mockResolvedValueOnce(prismaUserMock.findUnique, { id: 999 } as never);
      mockResolvedValueOnce(prismaUserMock.findUnique, { id: 998 } as never);

      const error = String({
        errors: {
          email: ['has already been taken'],
          username: ['has already been taken'],
        },
      });
      await expect(
        updateUser({ email: 'realworld@me', username: 'RealWorld' }, 123)
      ).rejects.toThrow(error);
    });
  });
});
