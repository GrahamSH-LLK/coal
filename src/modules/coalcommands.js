import { ApplicationCommandOptionType } from "discord.js";
import { defineChatCommand } from "strife.js";
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

    await interaction.reply(`<@${options.user.id}> GET MINING`);
  }
);

defineChatCommand({
    name: 'getcoal',
    description: 'get coal for user',
    options: {
        user: {
          type: ApplicationCommandOptionType.User,
          description: "user to get coal",
          required: true,
        },
    }
},
async (interaction, options) => {
    let record = database.data.find((x) => x.id == options.user.id)
    if (record) {
        return await interaction.reply(`${record.coal} remaining`)
    }
    return await interaction.reply( {content:`no existing punishment`,ephemeral: true})
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
            return await interaction.reply( {content: `invalid amount`,ephemeral: true})
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
    return await interaction.reply({content:`no existing punishment`, ephemeral: true})
})

defineChatCommand({
  name: 'free',
  description: 'free a user',
  options: {
      user: {
        type: ApplicationCommandOptionType.User,
        description: "user to free",
        required: true,
      },
  }
},
async (interaction, options) => {
  database.data = database.data.filter((x) => x.id != message.author.id);
  
  return await interaction.reply(`you freed ${interaction.user.name}! lucky them.`)
})