/* Local typecheck stub mirroring `npx convex codegen` output. Gitignored. */
import {
  type DataModelFromSchemaDefinition,
  type GenericQueryCtx,
  type GenericMutationCtx,
  type GenericActionCtx,
  type QueryBuilder,
  type MutationBuilder,
  type ActionBuilder,
} from "convex/server";
import type schema from "../schema";

type DataModel = DataModelFromSchemaDefinition<typeof schema>;

export declare const query: QueryBuilder<DataModel, "public">;
export declare const mutation: MutationBuilder<DataModel, "public">;
export declare const action: ActionBuilder<DataModel, "public">;
export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;
