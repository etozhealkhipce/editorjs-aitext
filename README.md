[![](https://flat.badgen.net/npm/v/@alkhipce/editorjs-aitext?icon=npm)](https://www.npmjs.com/package/@alkhipce/editorjs-aitext)
[![](https://flat.badgen.net/github/stars/etozhealkhipce/editorjs-aitext)](https://github.com/etozhealkhipce/editorjs-aitext)

# AI Text Tool for Editor.js

AI suggestion text Tool for the [Editor.js](https://editorjs.io/) based on the default [Paragraph Tool](https://github.com/editor-js/paragraph/tree/master).

While writing, you get an AI suggestion after a configurable delay. Accept or decline it with keyboard shortcuts.

![image](https://github.com/etozhealkhipce/editorjs-aitext/assets/38625168/ebedb41d-085c-4046-af02-d498babf6395)

> Using an older version? See the [1.2.0 readme](https://github.com/etozhealkhipce/editorjs-aitext/tree/79f111fe7eec2c0458f8c508d34858bfade5efeb).

## Installation

```shell
npm i @alkhipce/editorjs-aitext
```

```javascript
import AIText from '@alkhipce/editorjs-aitext'
```

## Usage

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
      aiText: {
        // if you do not use TypeScript you need to remove "as unknown as ToolConstructable" construction
        // type ToolConstructable imported from @editorjs/editorjs package
        class: AIText as unknown as ToolConstructable,
        config: {
          // here you need to provide your own suggestion provider (e.g., request to your backend)
          // this callback function must accept a string and return a Promise<string>
          callback: (text: string) => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve('AI: ' + text)
              }, 1000)
            })
          },
          acceptKeys: ['AltLeft', 'AltRight', 'Tab'], // default
          declineKeys: ['Escape', 'Backspace'],      // default
          debounceTimeout: 2000,               // default
          icon: '<svg>...</svg>',
          loaderIcon: '<svg>...</svg>',
        }
      },
  }

  ...
});
```

## Config

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `callback` | `(text: string) => Promise<string>` | — | **Required.** Called with current block content, must return a suggestion string |
| `acceptKeys` | `string[]` | `['AltLeft', 'AltRight', 'Tab']` | Keys that accept the suggestion (values are `KeyboardEvent.code`) |
| `declineKeys` | `string[]` | `['Escape', 'Backspace']` | Keys that decline the suggestion |
| `debounceTimeout` | `number` | `2000` | Delay in ms after last input before requesting a suggestion |
| `icon` | `string` | built-in SVG | Custom SVG icon for the toolbox |
| `loaderIcon` | `string` | built-in SVG | Custom SVG icon for the loader shown while fetching |

## Output

```json
{
  "type": "aiText",
  "data": {
    "text": "paragraph text here"
  }
}
```
