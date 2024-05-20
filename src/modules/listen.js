import { defineEvent } from "strife.js";
import { database } from "./punishmentdb.js";
let INSULTS = ["KEEP WORKING", "WORK HARDER", "WORK FASTER", "MORE COAL"];
defineEvent("messageCreate", async (message) => {
  let coalCount =
    message.content.split("<:coal:1204805721007595550>").length - 1;
  if (database.data.some((x) => x.id == message.author.id)) {
    if (coalCount < 1) {
      return message.reply("GET BACK TO WORK");
    }
    let record = database.data.find((x) => {
      return x.id == message.author.id;
    });
    record.coal -= coalCount;
    database.data = [
      ...database.data.filter((x) => x.id != message.author.id),
      ...(record.coal >= 1 ? [record] : []),
    ];
    if (record.coal < 1) {
      return await message.reply(`You're free!`);
    }
    message.reply(INSULTS[Math.floor(Math.random() * INSULTS.length)]);
  }
  // code here...
});
