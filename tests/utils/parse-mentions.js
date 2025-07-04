const { parseUserIdsFromMentions } = require("../../utils/parse-mentions");
var assert = require("assert");

describe("parse-mentions works", function () {
  it("should return the passed user ids inside the array of arguments", function () {
    const args = ["<@U0945Q70D4L|diego>", '"test"', "<@U000000D4L>"];
    const { status, userIds } = parseUserIdsFromMentions(args);

    assert.equal(status, 200);
    assert.deepEqual(userIds, ["U0945Q70D4L", "U000000D4L"]);
  });
});
