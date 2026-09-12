/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as admin from "../admin";
import type * as categories from "../categories";
import type * as curriculum from "../curriculum";
import type * as stats from "../stats";
import type * as users from "../users";
import type * as words from "../words";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  categories: typeof categories;
  curriculum: typeof curriculum;
  stats: typeof stats;
  users: typeof users;
  words: typeof words;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
