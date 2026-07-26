"use strict";

module.exports = {
  names: ["GHW001", "no-list-nested-fenced-code"],
  description: "Do not nest fenced code blocks inside list items",
  tags: ["lists", "code"],
  function: function noListNestedFencedCode(params, onError) {
    let listItemDepth = 0;

    for (const token of params.parsers.markdownit.tokens) {
      if (token.type === "list_item_open") {
        listItemDepth += 1;
        continue;
      }

      if (token.type === "list_item_close") {
        listItemDepth = Math.max(0, listItemDepth - 1);
        continue;
      }

      if (token.type === "fence" && listItemDepth > 0) {
        onError({
          lineNumber: token.lineNumber,
          detail:
            "Move this fenced code block out of the list item so it renders at full width.",
        });
      }
    }
  },
};
