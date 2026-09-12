const fs = require('fs');
const path = require('path');

const generatedDir = path.join(__dirname, '..', 'convex', '_generated');
fs.mkdirSync(generatedDir, { recursive: true });

// 1. dataModel.d.ts
const dataModelDTS = `/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 */

import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  TableNamesInDataModel,
  SystemTableNames,
} from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

/**
 * An identifier for a document in Convex.
 */
export type Id<TableName extends TableNames | SystemTableNames> =
  GenericId<TableName>;

/**
 * A type describing your Convex data model.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;
`;

// 2. server.d.ts
const serverDTS = `/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 */

import {
  ActionBuilder,
  HttpEndpoint,
  MutationBuilder,
  QueryBuilder,
  GenericDatabaseReader,
  GenericDatabaseWriter,
  GenericMutationCtx,
  GenericQueryCtx,
  GenericActionCtx,
} from "convex/server";
import { DataModel } from "./dataModel";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;
export type DatabaseReader = GenericDatabaseReader<DataModel>;
export type DatabaseWriter = GenericDatabaseWriter<DataModel>;

export declare const query: QueryBuilder<DataModel, "public">;
export declare const internalQuery: QueryBuilder<DataModel, "internal">;
export declare const mutation: MutationBuilder<DataModel, "public">;
export declare const internalMutation: MutationBuilder<DataModel, "internal">;
export declare const action: ActionBuilder<DataModel, "public">;
export declare const internalAction: ActionBuilder<DataModel, "internal">;
export declare const httpEndpoint: (
  func: (
    ctx: GenericActionCtx<DataModel>,
    request: Request
  ) => Promise<Response>
) => HttpEndpoint;
`;

// 3. server.js
const serverJS = `/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 */

import {
  actionGeneric,
  httpActionGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
  mutationGeneric,
  queryGeneric,
} from "convex/server";

export const query = queryGeneric;
export const internalQuery = internalQueryGeneric;
export const mutation = mutationGeneric;
export const internalMutation = internalMutationGeneric;
export const action = actionGeneric;
export const internalAction = internalActionGeneric;
export const httpEndpoint = httpActionGeneric;
`;

// 4. api.d.ts
const apiDTS = `/* eslint-disable */
/**
 * Generated \`api\` utility.
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
`;

// 5. api.js
const apiJS = `/* eslint-disable */
/**
 * Generated \`api\` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 */

import { anyApi } from "convex/server";

export const api = anyApi;
export const internal = anyApi;
`;

fs.writeFileSync(path.join(generatedDir, 'dataModel.d.ts'), dataModelDTS);
fs.writeFileSync(path.join(generatedDir, 'server.d.ts'), serverDTS);
fs.writeFileSync(path.join(generatedDir, 'server.js'), serverJS);
fs.writeFileSync(path.join(generatedDir, 'api.d.ts'), apiDTS);
fs.writeFileSync(path.join(generatedDir, 'api.js'), apiJS);

console.log('Convex _generated files created successfully!');
