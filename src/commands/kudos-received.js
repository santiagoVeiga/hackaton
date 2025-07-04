const {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} = require("firebase/firestore");

const kudosReceived = (app) => {
  app.instance.command("/kudos-received", async ({ ack, respond, command }) => {
    try {
      await ack();

      const workspace = command.team_id;
      const userId = command.user_id;
      const args = command.text.trim().toLowerCase();
      const isHistory = args === "history";

      let kudosQuery;
      let title;

      if (isHistory) {
        // Get all kudos ever received
        kudosQuery = query(
          collection(app.db, "messages"),
          where("workspace", "==", workspace),
          where("recipientId", "==", userId),
          orderBy("timestamp", "desc")
        );
        title = "📚 All Kudos You've Received";
      } else {
        // Get kudos from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        kudosQuery = query(
          collection(app.db, "messages"),
          where("workspace", "==", workspace),
          where("recipientId", "==", userId),
          where("timestamp", ">=", Timestamp.fromDate(thirtyDaysAgo)),
          orderBy("timestamp", "desc")
        );
        title = "📅 Kudos Received (Last 30 Days)";
      }

      const snapshot = await getDocs(kudosQuery);

      if (snapshot.empty) {
        await respond({
          text: isHistory
            ? "You haven't received any kudos yet. Keep up the good work! 🌟"
            : "No kudos received in the last 30 days. Keep contributing! 💪",
          response_type: "ephemeral",
        });
        return;
      }

      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: title,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Total: ${snapshot.size} kudos*`,
          },
        },
        {
          type: "divider",
        },
      ];

      // Add each kudo as a block (limit display to prevent message being too long)
      const displayLimit = isHistory ? 50 : 30;
      const kudosToShow = snapshot.docs.slice(0, displayLimit);

      kudosToShow.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp.toDate();
        const timeString = `<!date^${Math.floor(timestamp.getTime() / 1000)}^{date_short} at {time}|${timestamp.toLocaleString()}>`;

        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message:* _"${data.message}"_\n*When:* ${timeString}`,
          },
        });

        if (data.channelName) {
          blocks.push({
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Sent in #${data.channelName}`,
              },
            ],
          });
        }

        blocks.push({
          type: "divider",
        });
      });

      // If there are more kudos than displayed
      if (snapshot.size > displayLimit) {
        blocks.push({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `_Showing ${displayLimit} of ${snapshot.size} total kudos_`,
            },
          ],
        });
      }

      // Add help text at the bottom
      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: isHistory
              ? "💡 _Use `/kudos-receive` to see only last 30 days_"
              : "💡 _Use `/kudos-receive history` to see all kudos ever received_",
          },
        ],
      });

      await respond({
        blocks: blocks,
        response_type: "ephemeral",
      });
    } catch (error) {
      console.error("Error in /kudos-receive command:", error);

      await respond({
        text: "Error fetching your kudos. Please try again later.",
        response_type: "ephemeral",
      });
    }
  });
};

module.exports = kudosReceived;
