import { defineEvent } from "strife.js";
import { database } from "./punishmentdb.js";
let INSULTS = ["KEEP WORKING", "WORK HARDER", "WORK FASTER", "MORE COAL", "FUCK YOU!"];
defineEvent("messageCreate", async (message) => {
  let coalCount = message.content.split("<:coal:1204805721007595550>").length - 1;
  let thishelpid = database.data.find((x) => x.helpid && x.id == message.author.id);
  
  if(thishelpid) {
    let targetuser = database.data.find((x) => x.id == thishelpid.helpid);
    if (coalCount < 1) {
      return message.reply(`Why aren't you helping?`);
    }
    targetuser.coal -= coalCount;
    database.data = [
      ...database.data.filter((x) => x.id != targetuser.id),
      ...(targetuser.coal >= 1 ? [targetuser] : []),
    ];
    if (targetuser.coal < 1) {
      database.data = database.data.filter((x) => (x.id != message.author.id||!x.helpid))
      return await message.reply(`<@${targetuser.id}> is free, thanks to <@${message.author.id}>!`);
    }
    return await message.reply(`You helped mine ${coalCount} coal!`);
  
  } else if (database.data.some((x) => x.id == message.author.id)) {
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
    message.reply(Math.floor(Math.random()*100)==0? "i love you hehe" : INSULTS[Math.floor(Math.random() * INSULTS.length)]);
  }
  // code here...
});
