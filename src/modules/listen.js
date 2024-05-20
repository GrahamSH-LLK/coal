import { defineEvent } from "strife.js";

import { database } from "./punishmentdb.js";
let INSULTS = [
    "KEEP WORKING",
    "WORK HARDER",
    "WORK FASTER",
    "MORE COAL"
]
defineEvent("messageCreate", async (message) => {
  if (database.data.some((x) => x.id == message.author.id)) {
    let record = database.data.find((x) => {
      return x.id == message.author.id;
    });
    record.coal -=
      message.content.split("<:coal:1204805721007595550>").length - 1;
      database.data = [
        ...database.data.filter((x) => x.id != message.author.id),
        record
      ];
      message.reply(INSULTS[Math.floor(Math.random() * INSULTS.length) ])
    }
  // code here...
});