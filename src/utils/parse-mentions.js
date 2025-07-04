// returns userIds from mentions in the text
export const parseUserIdsFromMentions = (args) => {
  const mentionStrings = args.filter(
    (arg) => arg.startsWith("<@") && arg.includes(">")
  );

  if (!mentionStrings) {
    return { status: 400, error: { msg: "malformed" } };
  }

  const userIds = mentionStrings
    .map((mention) => {
      const match = mention.match(/<@(U[A-Z0-9]+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  return { status: 200, userIds };
};
