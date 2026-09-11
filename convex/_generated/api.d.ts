/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 * (Hand-maintained shim: real codegen runs with `npx convex dev` after login.
 * When adding convex modules, register them in the map below.)
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as categories from "../categories";
import type * as words from "../words";
import type * as users from "../users";
import type * as curriculum from "../curriculum";
import type * as admin from "../admin";

declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  words: typeof words;
  users: typeof users;
  curriculum: typeof curriculum;
  admin: typeof admin;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
