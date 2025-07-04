const kudos = require("./commands/kudos");

const registerCommands = (app) => {
  kudos(app);
  // Add more commands here as you create them
  // otherCommand(app);
};

module.exports = registerCommands;
