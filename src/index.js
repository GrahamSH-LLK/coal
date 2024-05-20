import { GatewayIntentBits } from "discord.js";
import { login } from "strife.js";
import path from "node:path";
import url from "node:url";
import 'dotenv/config'
await login({
  clientOptions: {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessages
    ],
  },
  modulesDirectory: path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./modules"
  ),
});
