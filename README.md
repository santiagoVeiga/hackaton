# Kudos Slack Bot 🎉

A Slack bot that enables team members to send kudos and recognition to their colleagues, fostering a positive workplace culture.

## Features ✨

- **Send Kudos**: Recognize teammates with meaningful messages
- **Categories**: Organize kudos by type (teamwork, innovation, leadership, etc.)
- **Real-time Notifications**: Get notified when you receive kudos
- **Analytics Dashboard**: Track recognition trends in your workspace
- **Slash Commands**: Quick and easy kudos sending via `/kudos`
- **Interactive UI**: Beautiful message formatting with Slack's Block Kit

## Installation 🚀

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Slack workspace admin access

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kudos-slack-bot.git
   cd kudos-slack-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `firebase.js` file in the root directory:
   ```javascript
   const { initializeApp } = require('firebase/app');
   const { getFirestore } = require('firebase/firestore');

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);

   module.exports = db;
   ```

4. **Set up environment variables**
   
   Create a `.env` file:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-token
   PORT=3000
   ```

5. **Create Slack App**
   
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Click "Create New App"
   - Choose "From scratch"
   - Add the following OAuth scopes:
     - `chat:write`
     - `commands`
     - `users:read`
     - `channels:read`
   - Install the app to your workspace

## Usage 💬

### Slash Commands

- `/kudos @user [message]` - Send a quick kudos
- `/kudos` - Open the kudos modal
- `/kudos-stats` - View your kudos statistics
- `/kudos-leaderboard` - See the recognition leaderboard

### Examples

```
/kudos @jane Thanks for your help with the deployment! 🚀
/kudos @team-marketing Amazing campaign launch! 🎯
```

## Development 🛠️

### Project Structure

```
kudos-slack-bot/
├── src/
│   ├── bot.js          # Main bot logic
│   ├── commands/       # Slash command handlers
│   ├── events/         # Event listeners
│   ├── blocks/         # Slack Block Kit templates
│   └── utils/          # Helper functions
├── tests_db/           # Database test scripts
├── firebase.js         # Firebase configuration
├── package.json
└── README.md
```

### Running Tests

```bash
npm test
```

### Populating Test Data

```bash
cd tests_db
node populate-db.js
```

## Database Schema 📊

### Messages Collection

```javascript
{
  workspace: 'W001',           // Slack workspace ID
