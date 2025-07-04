const { parseUserIdsFromMentions } = require("../utils/parse-mentions");
const { collection, addDoc, Timestamp } = require("firebase/firestore");
require("dotenv").config();

const kudos = (app) => {
  app.instance.command("/kudos", async ({ ack, respond, command, client }) => {
    try {

      console.log("llegamos al handler");
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

      const recipientId = userIds[0];

      try {
        const kudoData = {
          workspace: command.team_id,
          recipientId: recipientId,
          message: message,
          timestamp: Timestamp.now(),
        };

        const docRef = await addDoc(collection(app.db, "messages"), kudoData);
        console.log("Kudo saved with ID: ", docRef.id);

        respond({
          text: "Tu kudo ha sido enviado 🚀 ¡Qué hermoso gesto de reconocimiento! 💝",
          response_type: "ephemeral",
        });
      } catch (firebaseError) {
        console.error("Error saving to Firebase:", firebaseError);

        // Still send the kudos even if Firebase fails
        const mentions = userIds.map((id) => `<@${id}>`);
        await respond({
          text: `${mentions.join(", ")} ${message}`,
          response_type: "in_channel",
        });
      }
    } catch (error) {
      console.error("Error in /kudos command:", error);

      await respond({
        text: "Something went wrong processing your command.",
        response_type: "ephemeral",
      });
    }
  });
};

module.exports = kudos;
