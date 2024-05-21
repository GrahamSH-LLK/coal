import { defineEvent } from "strife.js";
import { database } from "./punishmentdb.js";
let INSULTS = [
  "KEEP WORKING",
  "WORK HARDER",
  "WORK FASTER",
  "MORE COAL",
  "FUCK YOU!",
];
defineEvent("messageCreate", async (message) => {
  let coalCount =
    message.content.split("<:coal:1204805721007595550>").length - 1;
  let user = database.data.find((x) => x.id == message.author.id);
  let isHelping = !!user?.helpid;
  let targetuser = database.data.find(
    (x) => x.id == (isHelping ? user.helpid : message.author.id)
  );

  if (targetuser) {
    if (coalCount < 1 && !isHelping) {
      return message.reply("GET BACK TO WORK");
    }
    targetuser.coal -= coalCount;
    database.data = [
      ...database.data.filter((x) => x.id != targetuser.id),
      ...(targetuser.coal >= 1 ? [targetuser] : []),
    ];
    if (targetuser.coal < 1) {
      if (isHelping) {
        database.data = [...database.data.filter((x) => x.id != user.id)];
      }

      return await message.reply(
        isHelping
          ? `<@${targetuser.id}> is free thanks to you!`
          : `You're free!`
      );
    }
    if (!isHelping) message.reply(INSULTS[Math.floor(Math.random() * INSULTS.length)]);
  }
});
