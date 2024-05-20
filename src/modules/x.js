import { defineChatCommand } from "strife.js";
import { ApplicationCommandOptionType } from "discord.js";
import { database } from "./punishmentdb.js";
defineChatCommand(
  {
    name: "addpunishment",
    description: "Add or update a punishment",
    options: {
      user: {
        type: ApplicationCommandOptionType.User,
        description: "Message content",
        required: true,
      },
      coal: {
        type: ApplicationCommandOptionType.Number,
        description: "Coal to mine",
        required: true,
      },
    },
  },

  async (interaction, options) => {
    database.data = [
      ...database.data.filter((x) => x.id != options.user.id),
      {
        id: options.user.id,
        coal: options.coal,
      },
    ];

    await interaction.reply("Pong!");
  }
);

defineChatCommand({
    name: 'getcoal',
    description: 'get coal for user',
    options: {
        user: {
          type: ApplicationCommandOptionType.User,
          description: "Message content",
          required: true,
        },
    }
},
async (interaction, options) => {
    let record = database.data.find((x) => x.id == options.user.id)
    if (record) {
        return await interaction.reply(`${record.coal} remaining`)
    }
    return await interaction.reply(`no existing punishment`)
})

defineChatCommand({
    name: 'gamble',
    description: 'gamble your coal',
    options: {
        amount: {
          type: ApplicationCommandOptionType.Number,
          description: "Amount to gamble",
          required: true,
        },
    }
},
async (interaction, options) => {
    let record = database.data.find((x) => x.id == interaction.user.id)
    if (record) {
        if (options.amount > record.coal || options.amount < 1) {
            return await interaction.reply(`invalid amount`)
        }
        let won = Math.random() > options.amount / record.coal;
        let newCoal = record.coal + (won ? -1.0 : 1.0 ) * options.amount
        database.data = [
            ...database.data.filter((x) => x.id != interaction.user.id),
            {
              id: interaction.user.id,
              coal: newCoal,
            },
          ];
      
        return await interaction.reply(`you ${won ? 'won' : 'lost'}! your coal amount is now ${newCoal}`);

    }
    return await interaction.reply(`no existing punishment`)
})
