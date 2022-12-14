import type { User } from "@prisma/client";

import { prisma } from "~/db.server";
import { comparePassword, hashPassword } from "~/utils";

export type { User } from "@prisma/client";

export async function getUserByUsername(username: User["username"]) {
  return prisma.user.findUnique({ where: { username } });
}

export async function createUser(username: User["username"], password: string) {
  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      username,
      password: hashedPassword
    }
  });
}

export async function updatePasswordByUsername(username: User["username"], password: string) {
  return prisma.user.update({ data: { password: await hashPassword(password) }, where: { username } });
}

export async function verifyLogin(
  username: User["username"],
  password: User["password"]
) {
  const user = await getUserByUsername(username);

  if (!user || !("password" in user))
    return null;

  const isValid = await comparePassword(password, user.password);

  if (!isValid)
    return null;

  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
