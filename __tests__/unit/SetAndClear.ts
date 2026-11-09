import { VirtualClipboard } from "../../src/VirtualClipboard";
import { describe, expect, it } from "@jest/globals";

describe("VirtualClipboard", () => {
  describe("clipboard-set-text and clipboard-clear", () => {
    it("starts empty", () => {
      const virtualClipboard = new VirtualClipboard();
      expect(virtualClipboard.getText()).toEqual("");
      expect(virtualClipboard.getActionsApplied()).toEqual([]);
    });

    it("holds the text it was given", () => {
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.applyAction({ name: "clipboard-set-text", value: "console.log('hi');" });
      expect(virtualClipboard.getText()).toEqual("console.log('hi');");
    });

    it("keeps line breaks, indentation and trailing whitespace exactly", () => {
      const text = "function add(a, b) {\n    return a + b;\n}\n\t// tab-indented  \n";
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.applyAction({ name: "clipboard-set-text", value: text });
      expect(virtualClipboard.getText()).toEqual(text);
    });

    it("keeps only the latest text", () => {
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.applyActions([
        { name: "clipboard-set-text", value: "first" },
        { name: "clipboard-set-text", value: "second" },
      ]);
      expect(virtualClipboard.getText()).toEqual("second");
    });

    it("is empty again after clipboard-clear", () => {
      const virtualClipboard = new VirtualClipboard();
      virtualClipboard.applyActions([
        { name: "clipboard-set-text", value: "something" },
        { name: "clipboard-clear", value: "1" },
      ]);
      expect(virtualClipboard.getText()).toEqual("");
    });

    it("applies the actions it is constructed with, and records every action in order", () => {
      const virtualClipboard = new VirtualClipboard([
        { name: "clipboard-set-text", value: "a" },
        { name: "clipboard-clear", value: "1" },
        { name: "clipboard-set-text", value: "b" },
      ]);
      expect(virtualClipboard.getText()).toEqual("b");
      expect(virtualClipboard.getActionsApplied().map((action) => action.name)).toEqual([
        "clipboard-set-text",
        "clipboard-clear",
        "clipboard-set-text",
      ]);
    });
  });
});
