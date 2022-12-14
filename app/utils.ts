import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import bcrypt from "bcryptjs";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the destination is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param   id The route id
 * @returns The router data or undefined if not found
 */
export function useMatchesData(id: string) {
  const matchingRoutes = useMatches();

  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );

  return route?.data;
}

/**
 * Check if an object is a user.
 *
 * An object is regarded as a user if it has a string property "username".
 * @param user The given object
 */
function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.username === "string";
}

/**
 * A hook to get an optional user from a React function component.
 */
export function useOptionalUser() {
  const data = useMatchesData("root");

  if (!data || !isUser(data.user)) {
    return undefined;
  }

  return data.user;
}

/**
 * A hook to get a certain user from a React function component.
 *
 * If the user does not exist, an error will be thrown.
 */
export function useUser() {
  const maybeUser = useOptionalUser();

  if (!maybeUser) {
    throw new Error("用户未找到");
  }

  return maybeUser;
}

/**
 * Validate the given username.
 * @param username Anything that could be a username
 */
export function validateUsername(username: unknown): username is string {
  return typeof username === "string" && /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,16}$/.test(username);
}

/**
 * Validate the given password.
 * @param password Anything that could be a password
 */
export function validatePassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 6;
}

/**
 * Send an AJAX request.
 * @param method Request method
 * @param url Request url
 * @param data Request data, defaults to `{}`
 * @returns JSON response data
 */
export async function ajax(method: string, url: string, data: any = {}) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  return await (await fetch(url, options)).json();
}

/**
 * Hash the given password.
 * @param password The given password
 * @returns Hash value of the password
 */
export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

/**
 * Check if the password matches the hash value.
 * @param input The given password
 * @param hash The given hash value to compare against
 */
export function comparePassword(input: string, hash: string) {
  return bcrypt.compare(input, hash);
}

/**
 * Accesses in polygen
 *
 * **The Access-priority Rule**: Anyone who wants to use accesses on others OR anything owned by others must have a higher access level,
 * while the access itself results in a lower access level.
 *
 * Note that The Access-priority Rule is NOT applicable to non-user-owned fields, such as game rooms
 * and announcements.
 */
export const enum Access {
  /**
   * The basic access determining whether a user can visit polygen website.
   *
   * Generally, all visitors (unregistered) and all registered users have this access, while banned users don't.
   *
   * You are encouraged to require this access as often as possible to keep banned users away.
   */
  VisitWebsite = 0,

  /**
   * Whether a user can send posts, comments or in-game messages.
   *
   * Every registered user has this access.
   */
  Community = 1,
  /**
   * Whether a user can join or create rooms.
   *
   * Every registered user has this access.
   */
  PlayGame = 1,

  /**
   * Whether a user can update or delete posts and comments from others.
   *
   * Only admin users have this access.
   */
  ManageCommunity = 2,
  /**
   * Whether a user can change others' accesses.
   *
   * Only admin users have this access.
   */
  ManageAccess = 2,

  /**
   * Whether a user can create, update or delete announcements.
   *
   * Only super admin users have this access.
   */
  ManageAnnouncement = 3,
  /**
   * Whether a user can modify personal settings or homepages of other users.
   *
   * Only super admin users have this access.
   */
  ManageUser = 3,
  /**
   * Whether a user can forcibly create, modify, disable or delete game rooms.
   *
   * Only super admin users have this access.
   */
  ManageGame = 3,

  /**
   * Whether a user can run commands on the server.
   *
   * Only developers have this access.
   */
  ManageServer = 4,
  /**
   * Whether a user can run commands on the database.
   *
   * Only developers have this access.
   */
  ManageDb = 4,
}

/**
 * Configuration for the Vditor editor
 */
export const vditorConfig = {
  height: 120,
  toolbar: [
    "upload", "record", "|", "undo", "redo", "|", "fullscreen",
    {
      name: "more",
      toolbar: ["both", "edit-mode", "export", "outline", "preview"]
    }
  ],
  toolbarConfig: { pin: true },
  resize: { enable: true },
  tab: "    ",
  preview: { math: { inlineDigit: true }, hljs: { style: "autumn" } }
};