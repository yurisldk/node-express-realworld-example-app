import * as bcrypt from 'bcryptjs';
import { createUser, login } from '../../app/routes/auth/auth.service';
import prismaMock from '../prisma-mock';

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
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue(mockedResponse);

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
      prismaMock.user.findUnique.mockResolvedValue(mockedExistingUser);

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
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

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
      prismaMock.user.findUnique.mockResolvedValue(null);

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
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(user)).rejects.toThrow(error);
    });
  });
});
