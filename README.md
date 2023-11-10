[![](https://flat.badgen.net/npm/v/editorjs-aitext?icon=npm)](https://www.npmjs.com/package/editorjs-aitext)
[![](https://flat.badgen.net/github/stars/etozhealkhipce/editorjs-aitext)](https://github.com/etozhealkhipce/editorjs-aitext)

# AI Text Tool for Editor.js

AI suggestion text Tool for the [Editor.js](https://ifmo.su/editor) based on the default [Paragraph Tool](https://github.com/editor-js/paragraph/tree/master) and [OpenAI library](https://github.com/openai/openai-node)

## Installation

Get the package

```shell
npm i editorjs-aitext
```

Include module at your application

```javascript
import AIText from 'editorjs-aitext'
```

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
      aiText: {
        // if you do not use TypeScript you need to remove "as unknown as ToolConstructable" construction
        class: AIText as unknown as ToolConstructable,
        config: {
          openaiKey: 'YOUR_OPEN_AI_KEY'
        }
      },
  }

  ...
});
```

## Config Params

The AI Text Tool supports these configuration parameters:

| Field | Type     | Description        |
| ----- | -------- | ------------------ |
| placeholder | `string` | The placeholder. Will be shown only in the first paragraph when the whole editor is empty.  |
| preserveBlank | `boolean` | (default: `false`) Whether or not to keep blank paragraphs when saving editor data |
| openaiKey | `string` | Required parameter |

## Output data

| Field  | Type     | Description      |
| ------ | -------- | ---------------- |
| text   | `string` | paragraph's text |


```json
{
    "type" : "aiText",
    "data" : {
        "text" : "Check out our projects on a <a href=\"https://github.com/codex-team\">GitHub page</a>.",
    }
}
```