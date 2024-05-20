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

    await interaction.reply(`<@${options.user.id}> GET MINING!!!! ${options.coal} COAL TO GO!!!!!!`);
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
    return await interaction.reply( {content:`No existing punishment`,ephemeral: true})
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
      
        return await interaction.reply(`You ${won ? 'won' : 'lost'}! Your coal amount is now ${newCoal}`);

    }
    return await interaction.reply({content:`No existing punishment`, ephemeral: true})
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
  let useroccurs = database.data.find((x) => x.id == options.user.id);
  if(useroccurs) {
    database.data = database.data.filter((x) => x.id != options.user.id);
    return await interaction.reply(`You freed <@${options.user.id}>! Lucky them.`)
  }
  return await interaction.reply({content:`That user isn't mining.`, ephemeral: true})
})

defineChatCommand(
  {
    name: "helpmine",
    description: "Help a user mine",
    options: {
      user: {
        type: ApplicationCommandOptionType.User,
        description: "User to help",
        required: true,
      }
    },
  },

  async (interaction, options) => {
    let record = database.data.find((x) => x.id == options.user.id)
    let usermining = (options.user.id == interaction.user.id)
    let userhelping = database.data.find((x) => x.helpid && x.id == interaction.user.id)

    if (record&&!usermining&&!userhelping) {
      database.data = [
        ...database.data,
        {
          id: interaction.user.id,
          helpid: options.user.id
        },
      ];
      return await interaction.reply(`<@${interaction.user.id}> is helping <@${options.user.id}> mine coal! How nice.`);
    }
    return await interaction.reply({content: userhelping ? `You're already helping someone!` : usermining ? `You can't help yourself!` : `You can't help that user`, ephemeral: true})
  }
);

defineChatCommand(
  {
    name: "stophelping",
    description: "Stop helping a user"
  },

  async (interaction, options) => {
    let record = database.data.find((x) => x.id == interaction.user.id);
    if(record&&record.helpid) {
      let helpuser = record.helpid;
      database.data = database.data.filter((x) => x.id != interaction.user.id);
      return await interaction.reply(`<@${interaction.user.id}> is no longer helping <@${helpuser}>. Sadge.`);
    }
    return await interaction.reply({content:`You're not helping anyone!`, ephemeral: true});
  }
);