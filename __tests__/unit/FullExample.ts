import { VirtualClipboard } from "../../src/VirtualClipboard";
import { describe, expect, it } from "@jest/globals";
import { ClipboardAction } from "@fullstackcraftllc/codevideo-types";

describe("VirtualClipboard", () => {
  describe("full example", () => {
    it("follows a lesson that pastes outside text, then copies code within the project", () => {
      // The author copied mock data from a website before the lesson.
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.applySnapshot({ text: "[{ \"id\": 1 }]" });
      expect(virtualClipboard.getText()).toEqual("[{ \"id\": 1 }]");

      // More data, copied off screen during the lesson.
      const actions: Array<ClipboardAction> = [
        { name: "clipboard-set-text", value: "[{ \"id\": 1 }, { \"id\": 2 }]" },
      ];
      virtualClipboard.applyActions(actions);
      expect(virtualClipboard.getText()).toEqual("[{ \"id\": 1 }, { \"id\": 2 }]");

      // Then a function copied in the editor, pasted below it.
      virtualClipboard.setText("function sortByFoo() {}");
      expect(virtualClipboard.getText()).toEqual("function sortByFoo() {}");

      // And cleared at the end.
      virtualClipboard.applyAction({ name: "clipboard-clear", value: "1" });
      expect(virtualClipboard.getCurrentClipboardSnapshot()).toEqual({ text: "", isFullLine: false });
      expect(virtualClipboard.getActionsApplied()).toHaveLength(3);
    });
  });
});
