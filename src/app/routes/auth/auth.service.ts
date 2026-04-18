import * as bcrypt from 'bcryptjs';
import { LoginInput } from './login-input.model';
import { RegisterInput } from './register-input.model';
import { UpdateUserInput } from './update-user-input.model';
import prisma from '../../../prisma/prisma-client';
import HttpException from '../../models/http-exception.model';
import { RegisteredUser } from './registered-user.model';
import generateToken from './token.utils';
import { User } from './user.model';

type CheckUserUniquenessParams = {
  email?: string;
  username?: string;
  excludeUserId?: number;
};

const checkUserUniqueness = async ({
  email,
  username,
  excludeUserId,
}: CheckUserUniquenessParams) => {
  const existingUserByEmail = email
    ? await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      })
    : null;

  const existingUserByUsername = username
    ? await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      })
    : null;

  const emailTaken =
    existingUserByEmail && existingUserByEmail.id !== excludeUserId;
  const usernameTaken =
    existingUserByUsername && existingUserByUsername.id !== excludeUserId;

  if (emailTaken || usernameTaken) {
    throw new HttpException(422, {
      errors: {
        ...(emailTaken ? { email: ['has already been taken'] } : {}),
        ...(usernameTaken ? { username: ['has already been taken'] } : {}),
      },
    });
  }
};

export const createUser = async (
  input: RegisterInput
): Promise<RegisteredUser> => {
  const email = input.email?.trim();
  const username = input.username?.trim();
  const password = input.password?.trim();
  const image = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
  const { bio, demo = false } = input;

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkUserUniqueness({ email, username });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      ...(image ? { image } : {}),
      ...(bio ? { bio } : {}),
      ...(demo ? { demo } : {}),
    },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  return {
    ...user,
    token: generateToken(user.id),
  };
};

export const login = async (userPayload: LoginInput) => {
  const email = userPayload.email?.trim();
  const password = userPayload.password?.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      bio: true,
      image: true,
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: generateToken(user.id),
      };
    }
  }

  throw new HttpException(403, {
    errors: {
      'email or password': ['is invalid'],
    },
  });
};

export const getCurrentUser = async (id: number) => {
  const user = (await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      image: true,
    },
  })) as User;

  return {
    ...user,
    token: generateToken(user.id),
  };
};

export const updateUser = async (userPayload: UpdateUserInput, id: number) => {
  const { email, username, password, image, bio } = userPayload;
  let hashedPassword;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  await checkUserUniqueness({
    ...(email ? { email } : {}),
    ...(username ? { username } : {}),
    excludeUserId: id,
  });

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...(email ? { email } : {}),
      ...(username ? { username } : {}),
      ...(password ? { password: hashedPassword } : {}),
      ...(image ? { image } : {}),
      ...(bio ? { bio } : {}),
    },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  return {
    ...user,
    token: generateToken(user.id),
  };
};
