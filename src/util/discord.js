export function extractMessageExtremities(message) {
  const embeds = [
    ...message.stickers.map((sticker) => ({
      color: Colors.Blurple,
      image: { url: sticker.url },
      footer: { text: sticker.name },
    })),
    ...message.embeds
      .filter(
        (embed) =>
          !embed.video && !message.flags.has(MessageFlags.SuppressEmbeds)
      )
      .map(({ data }) => {
        const automodInfo = (data.fields ?? []).reduce(
          (accumulator, field) => ({
            ...accumulator,
            [field.name]: field.value,
          }),
          {
            flagged_message_id: message.id,
            channel_id: message.channel.id,
            keyword: "",
            rule_name: "",
          }
        );

        const newEmbed =
          message.type === MessageType.AutoModerationAction
            ? {
                description: data.description ?? message.content,
                color: message.member?.displayColor ?? data.color,
                author: {
                  icon_url: (
                    message.member ?? message.author
                  ).displayAvatarURL(),
                  name: (message.member ?? message.author).displayName,
                },
                url: messageLink(
                  message.guild?.id ?? "@me",
                  automodInfo.channel_id,
                  automodInfo.flagged_message_id
                ),
                footer: {
                  text: `${
                    automodInfo.keyword && `Keyword: ${automodInfo.keyword}`
                  }${
                    automodInfo.keyword &&
                    automodInfo.rule_name &&
                    constants.footerSeperator
                  }${
                    automodInfo.rule_name && `Rule: ${automodInfo.rule_name}`
                  }`,
                },
              }
            : { ...data };

        return newEmbed;
      }),
  ];

  return {
    embeds: embeds.slice(0, 10),
    files: [...message.attachments.values()],
  };
}
export async function getAllMessages(channel) {
  const messages = [];

  let lastId;

  do {
    const fetchedMessages = await channel.messages.fetch({
      before: lastId,
      limit: 100,
    });

    messages.push(...fetchedMessages.values());
    lastId = fetchedMessages.lastKey();
  } while (lastId);

  return messages;
}
