const kudos = require("./commands/kudos");
const kudosReceived = require("./commands/kudos-received");

const registerCommands = (app) => {
  kudos(app);
  kudosReceived(app);
  // Add more commands here as you create them
  // otherCommand(app);
};

module.exports = registerCommands;
