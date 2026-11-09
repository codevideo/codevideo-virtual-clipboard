import { VirtualClipboard } from "../../src/VirtualClipboard";
import { describe, expect, it } from "@jest/globals";
import { IClipboard } from "@fullstackcraftllc/codevideo-types";

// What an editor does on Cmd+C, seeing only the IClipboard interface.
const copySelection = (clipboard: IClipboard, selectedText: string) => clipboard.setText(selectedText);

describe("VirtualClipboard", () => {
  describe("as an editor's IClipboard", () => {
    it("takes text an editor copies, and records it as clipboard-set-text", () => {
      const virtualClipboard = new VirtualClipboard();
      copySelection(virtualClipboard, "sortByFoo");
      expect(virtualClipboard.getText()).toEqual("sortByFoo");
      expect(virtualClipboard.getActionsApplied()).toEqual([{ name: "clipboard-set-text", value: "sortByFoo" }]);
    });

    it("gives every editor the same text, so a copy in one file pastes in another", () => {
      const shared = new VirtualClipboard();
      const editorA: IClipboard = shared;
      const editorB: IClipboard = shared;
      editorA.setText("export const answer = 42;");
      expect(editorB.getText()).toEqual("export const answer = 42;");
    });

    it("remembers a whole-line copy until the next copy", () => {
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.setText("const a = 1;\n", true);
      expect(virtualClipboard.isFullLine()).toBe(true);
      virtualClipboard.setText("a");
      expect(virtualClipboard.isFullLine()).toBe(false);
      virtualClipboard.setText("const b = 2;\n", true);
      virtualClipboard.applyAction({ name: "clipboard-set-text", value: "from a website" });
      expect(virtualClipboard.isFullLine()).toBe(false);
      virtualClipboard.setText("const c = 3;\n", true);
      virtualClipboard.applyAction({ name: "clipboard-clear", value: "1" });
      expect(virtualClipboard.isFullLine()).toBe(false);
    });

    it("keeps its text when an editor copies nothing", () => {
      const virtualClipboard = new VirtualClipboard([{ name: "clipboard-set-text", value: "earlier copy" }]);
      copySelection(virtualClipboard, "");
      expect(virtualClipboard.getText()).toEqual("earlier copy");
      expect(virtualClipboard.getActionsApplied()).toHaveLength(1);
    });
  });
});
