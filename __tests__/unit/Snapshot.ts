import { VirtualClipboard } from "../../src/VirtualClipboard";
import { describe, expect, it } from "@jest/globals";

describe("VirtualClipboard", () => {
  describe("snapshots", () => {
    it("reports what's on the clipboard", () => {
      const virtualClipboard = new VirtualClipboard();
      expect(virtualClipboard.getCurrentClipboardSnapshot()).toEqual({ text: "", isFullLine: false });
      virtualClipboard.applyAction({ name: "clipboard-set-text", value: "copied" });
      expect(virtualClipboard.getCurrentClipboardSnapshot()).toEqual({ text: "copied", isFullLine: false });
    });

    it("restores from a snapshot", () => {
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.applySnapshot({ text: "from an earlier lesson" });
      expect(virtualClipboard.getText()).toEqual("from an earlier lesson");
    });

    it("restores a whole-line copy, and treats snapshots without the flag as a normal copy", () => {
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.applySnapshot({ text: "const a = 1;\n", isFullLine: true });
      expect(virtualClipboard.isFullLine()).toBe(true);
      virtualClipboard.applySnapshot({ text: "older snapshot" });
      expect(virtualClipboard.isFullLine()).toBe(false);
    });

    it("round-trips into a new clipboard", () => {
      const original = new VirtualClipboard();
      original.setText("const x = 1;\n", true);
      const restored = new VirtualClipboard();
      restored.applySnapshot(original.getCurrentClipboardSnapshot());
      expect(restored.getCurrentClipboardSnapshot()).toEqual({ text: "const x = 1;\n", isFullLine: true });
    });

    it("hands out a copy, so changing a snapshot doesn't change the clipboard", () => {
      const virtualClipboard = new VirtualClipboard([{ name: "clipboard-set-text", value: "kept" }]);
      const snapshot = virtualClipboard.getCurrentClipboardSnapshot();
      snapshot.text = "changed";
      expect(virtualClipboard.getText()).toEqual("kept");
    });
  });
});
