const { App } = require("@slack/bolt");
const { parseUserIdsFromMentions } = require("./utils/parse-mentions");
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } = require('firebase/firestore');
require("dotenv").config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
  parseMode: "full",
});

app.command("/kudos", async ({ ack, respond, command, client }) => {
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
    const recipientId = userIds[0];

    try {
      const kudoData = {
        workspace: command.team_id,
        recipientId: recipientId,
        message: message,
        timestamp: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'messages'), kudoData);
      console.log("Kudo saved with ID: ", docRef.id);

      // Format user ids so that slack creates the mention
      const mentions = userIds.map((id) => `<@${id}>`);

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

// Kudos receiveds command - last month or history
app.command("/kudos-received", async ({ ack, respond, command }) => {
  try {
    await ack();

    const workspace = command.team_id;
    const userId = command.user_id;
    const args = command.text.trim().toLowerCase();
    const isHistory = args === 'history';

    let kudosQuery;
    let title;

    if (isHistory) {
      // Get all kudos ever received
      kudosQuery = query(
        collection(db, 'messages'),
        where('workspace', '==', workspace),
        where('recipientId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      title = "📚 All Kudos You've Received";
    } else {
      // Get kudos from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      kudosQuery = query(
        collection(db, 'messages'),
        where('workspace', '==', workspace),
        where('recipientId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo)),
        orderBy('timestamp', 'desc')
      );
      title = "📅 Kudos Received (Last 30 Days)";
    }

    const snapshot = await getDocs(kudosQuery);
    
    if (snapshot.empty) {
      await respond({
        text: isHistory ? "You haven't received any kudos yet. Keep up the good work! 🌟" : "No kudos received in the last 30 days. Keep contributing! 💪",
        response_type: "ephemeral"
      });
      return;
    }

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: title,
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Total: ${snapshot.size} kudos*`
        }
      },
      {
        type: "divider"
      }
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
          text: `*Message:* _"${data.message}"_\n*When:* ${timeString}`
        }
      });

      if (data.channelName) {
        blocks.push({
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Sent in #${data.channelName}`
            }
          ]
        });
      }

      blocks.push({
        type: "divider"
      });
    });

    // If there are more kudos than displayed
    if (snapshot.size > displayLimit) {
      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `_Showing ${displayLimit} of ${snapshot.size} total kudos_`
          }
        ]
      });
    }

    // Add help text at the bottom
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: isHistory ? "💡 _Use `/kudos-receive` to see only last 30 days_" : "💡 _Use `/kudos-receive history` to see all kudos ever received_"
        }
      ]
    });

    await respond({
      blocks: blocks,
      response_type: "ephemeral"
    });

  } catch (error) {
    console.error("Error in /kudos-receive command:", error);
    
    await respond({
      text: "Error fetching your kudos. Please try again later.",
      response_type: "ephemeral"
    });
  }
});

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log("⚡️ Kudos Bot is running!");
  console.log(`🔥 Firebase connected to project: ${firebaseConfig.projectId}`);
})();