import {
  ClipboardAction,
  IClipboard,
  IClipboardSnapshot,
} from "@fullstackcraftllc/codevideo-types";

/**
 * Represents a virtual clipboard: the text a paste would insert. It changes
 * through its own actions (clipboard-set-text, clipboard-clear) and through
 * editors copying to it, which the VirtualIDE connects through IClipboard.
 */
export class VirtualClipboard implements IClipboard {
  private text: string = "";
  private fullLine = false;
  private actionsApplied: ClipboardAction[] = [];
  private verbose = false;

  constructor(actions?: ClipboardAction[], verbose?: boolean) {
    this.verbose = verbose || false;
    if (actions) {
      this.applyActions(actions);
    }
  }

  /**
   * Restores the clipboard from a snapshot
   * @param snapshot The clipboard snapshot to restore
   */
  applySnapshot(snapshot: IClipboardSnapshot) {
    this.text = snapshot.text;
    this.fullLine = snapshot.isFullLine ?? false;
  }

  /**
   * Applies a series of clipboard actions
   * @param actions The actions to apply
   */
  applyActions(actions: ClipboardAction[]) {
    actions.forEach((action) => {
      this.applyAction(action);
    });
  }

  /**
   * Applies a clipboard action
   * @param action The action to apply
   */
  applyAction(action: ClipboardAction) {
    switch (action.name) {
      case "clipboard-set-text":
        this.text = action.value;
        this.fullLine = false;
        break;
      case "clipboard-clear":
        this.text = "";
        this.fullLine = false;
        break;
    }

    this.actionsApplied.push(action);

    if (this.verbose) {
      console.log(`Action Name: ${action.name}, Action Value: ${action.value}`);
    }
  }

  /**
   * Gets the text a paste would insert
   * @returns The clipboard's text, or "" when it's empty
   */
  getText(): string {
    return this.text;
  }

  /**
   * Whether the text is a whole line copied or cut with nothing selected. A
   * paste with nothing selected then inserts it above the caret's line, as
   * VS Code does.
   * @returns true for a whole-line copy
   */
  isFullLine(): boolean {
    return this.fullLine;
  }

  /**
   * Copies text onto the clipboard, as an editor's Cmd+C or Cmd+X does. It is
   * recorded as a clipboard-set-text action. Copying nothing leaves the
   * clipboard as it was.
   * @param text The copied text
   * @param isFullLine Whether it's a whole line copied with nothing selected
   */
  setText(text: string, isFullLine: boolean = false) {
    if (text === "") {
      return;
    }
    this.applyAction({ name: "clipboard-set-text", value: text });
    this.fullLine = isFullLine;
  }

  /**
   * Gets the current clipboard snapshot
   * @returns The current clipboard snapshot
   */
  getCurrentClipboardSnapshot(): IClipboardSnapshot {
    return { text: this.text, isFullLine: this.fullLine };
  }

  /**
   * Gets the actions applied to the clipboard
   * @returns The actions applied, in order
   */
  getActionsApplied(): ClipboardAction[] {
    return this.actionsApplied;
  }
}
