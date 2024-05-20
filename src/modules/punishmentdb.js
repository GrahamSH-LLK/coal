import Database from "../util/database.js";
export const database = new Database("test")
await database.init();
