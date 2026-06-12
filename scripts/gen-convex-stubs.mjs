import { mkdirSync, writeFileSync } from "fs";

mkdirSync("convex/_generated", { recursive: true });

writeFileSync(
  "convex/_generated/api.js",
  'import { anyApi } from "convex/server";\nexport const api = anyApi;\nexport const internal = anyApi;\n'
);

writeFileSync(
  "convex/_generated/api.d.ts",
  "export declare const api: any;\nexport declare const internal: any;\n"
);

writeFileSync(
  "convex/_generated/server.js",
  'export { query, mutation, internalQuery, internalMutation, action, internalAction, httpRouter, httpAction } from "convex/server";\n'
);

writeFileSync(
  "convex/_generated/server.d.ts",
  'export { query, mutation, internalQuery, internalMutation, action, internalAction, httpRouter, httpAction } from "convex/server";\n'
);

console.log("✓ convex/_generated stubs written");
