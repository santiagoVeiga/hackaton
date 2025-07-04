const { App } = require("@slack/bolt");
const { parseUserIdsFromMentions } = require("./utils/parse-mentions");
require("dotenv").config();

// Initializes your app with credentials
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
  parseMode: "full",
});

app.command("/kudos", async ({ ack, respond, command }) => {
  try {
    await ack();

    const text = command.text.trim();
    const args = text.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    const { status, error, userIds } = parseUserIdsFromMentions(args);

    const quotedMessage = args.find(
      (arg) => arg.startsWith('"') && arg.endsWith('"')
    );

    const invalidNumberOfArgs = args.length > 2 || args.length < 2;
    const noMention = status !== 200 && error?.msg === "malformed";
    const noQuotedMessage = !quotedMessage;

    if (invalidNumberOfArgs || noMention || noQuotedMessage) {
      respond({
        text: 'command /kudos usage: `/kudos @user "message"`',
        response_type: "ephemeral",
      });

      return;
    }

    const message = quotedMessage?.slice(1, -1);
    // format user ids so that slack creates the mention
    const mentions = userIds.map((id) => `<@${id}>`);

    await respond({
      text: `${mentions.join(", ")} ${message}`,
      response_type: "in_channel",
    });
  } catch (error) {
    console.error("Error in /kudos command:", error);

    await respond({
      text: "Something went wrong processing your command.",
      response_type: "ephemeral",
    });
  }
});

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log("Bolt app started!!");
})();
