/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as categories from "../categories";
import type * as words from "../words";

declare const fullApi: ApiFromModules<{
  categories: typeof categories;
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
