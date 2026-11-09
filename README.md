# @fullstackcraft/codevideo-virtual-clipboard

![NPM Version](https://img.shields.io/npm/v/@fullstackcraftllc/codevideo-virtual-clipboard)

`codevideo-virtual-clipboard` is a TypeScript class that simulates a clipboard: the text a paste would insert. Like the other virtual layers, it changes only through actions, so every moment of a lesson can be replayed exactly.

This library heavily relies on the types from [codevideo-types](https://github.com/codevideo/codevideo-types).

## Example Usage

```typescript
import { VirtualClipboard } from '@fullstackcraftllc/codevideo-virtual-clipboard';

const virtualClipboard = new VirtualClipboard();

// Text copied somewhere off screen, such as a website
virtualClipboard.applyActions([
  { name: 'clipboard-set-text', value: 'const answer = 42;' }
]);

console.log(virtualClipboard.getText()); // "const answer = 42;"

// Snapshots save and restore it, like the other layers
const snapshot = virtualClipboard.getCurrentClipboardSnapshot(); // { text: "const answer = 42;", isFullLine: false }
```

## Copying and pasting in the editor

`VirtualClipboard` implements `IClipboard` from codevideo-types (`getText`, `isFullLine` and `setText`), which is all an editor needs for Cmd+C, Cmd+X and Cmd+V. The VirtualIDE gives every editor the same clipboard, so text copied in one file can be pasted in another. Text an editor copies is recorded as a `clipboard-set-text` action; copying nothing leaves the clipboard as it was. A whole line copied or cut with nothing selected is flagged (`isFullLine()`), so pasting it with nothing selected inserts it above the caret's line, as VS Code does.

## Why?

Why do we need a seemingly useless class? This library, along with many others, creates an entire event sourcing framework for the IDE. This is a small part of a larger project to create a declarative way to build, edit, and generate step by step educational video software courses.

See more at [codevideo.io](https://codevideo.io)
