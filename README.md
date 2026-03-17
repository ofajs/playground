# o-playground

[中文文档](./docs/CN_README.md) | [日本語](./docs/JA_README.md)

o-playground is an interactive code preview component that supports multi-file editing, real-time preview, and other features. It is mainly used to demonstrate the running effects of the ofa.js project.

## Basic Usage

First load the ofa.js base library, then introduce the o-playground component.

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
<l-m src="https://playground.ofajs.com/comps/o-playground/o-playground.html"></l-m>
<o-playground>
  <code path="demo.html">
    <template>
      <div>Hello World</div>
    </template>
  </code>
</o-playground>
```

## Multi-File Support

You can define multiple files using multiple `<code>` tags:

```html
<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    export const home = "./home.html";
  </code>
  <code path="home.html">
    <template page>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
```

## Code Attributes

### `path`

Specifies the file path and filename. This is a required attribute.

```html
<code path="index.html">...</code>
```

### `preview` (optional)

Marks this file as a preview file. The component will load this file in the preview area. If not specified, the component will automatically select a non-Page/Component file as the preview file.

```html
<code path="demo.html" preview>...</code>
```

### `active` (optional)

Sets this file as the currently active state, meaning it is the file displayed in the editor by default.

```html
<code path="main.js" active>...</code>
```

### `unimportant` (optional)

Marks this file as an "unimportant" file. Combined with the "Hide unimportant files" option in settings, these auxiliary files can be hidden.

```html
<code path="utils.js" unimportant>...</code>
```

## Automatic File Type Recognition

The component automatically recognizes the following file types:

| Type | Recognition Method | Wrapper Template |
|------|-------------------|-------------------|
| Page Component | `<template page>` | `<template page>...</template>` |
| Regular Component | `<template component>` | `<template component>...</template>` |
| Regular Template | `<template>` or `<pre>` or other | Use content directly |
| Other Files | No special markers | Use content directly |

For `<template>` type files, the system treats them as regular HTML content and automatically injects the following resources:

```html
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/palette.css" />
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/theme.css" />
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js#debug"></script>
```

## Style Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `--editor-height` | Editor height | `200px` |
| `--preview-height` | Preview area height | `200px` |

```html
<o-playground style="--editor-height: 500px">
  ...
</o-playground>
```

## Features

### Editor Features

- **Multi-file Tabs**: Support for editing multiple files simultaneously, switchable via top tabs
- **Code Highlighting**: Built-in code highlighting display
- **File Switching**: Click tabs to switch the currently edited file
- **Auto-save Prompt**: Display save prompt after editing (Mac: Cmd+S, Windows: Ctrl+S)

### Preview Features

- **Real-time Preview**: Auto-refresh preview after saving
- **Manual Refresh**: Click the refresh button at the top to reload the preview
- **Open in New Window**: Click the external link icon to open the preview in a new window

### Settings Features

Click the settings button at the top to access the following options:

- **Hide unimportant files**: Hide file tabs marked as unimportant
- **Restore Editor Size**: Restore the default size of the editor

### Theme Support

Theme switching is supported. You can get the theme through PUI Consumer and synchronize it.

## Complete Examples

### 1. Simple Example

```html
<o-playground style="--editor-height: 300px">
  <code>
    <template>
      <div id="target1">
        <p>Hello NoneOS Demo Code</p>
      </div>
      <script>
        let count = 0;
        setInterval(() => {
          $("#target1").text = "change text " + count++;
        }, 500);
      </script>
    </template>
  </code>
</o-playground>
```

### 2. ofa.js App Example

```html
<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    export const home = "./home.html";
  </code>
  <code path="home.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
```

### 3. Component Example

```html
<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-page src="./demo-page.html"></o-page>
    </template>
  </code>
  <code path="demo-page.html">
    <template page>
      <l-m src="./cc.html"></l-m>
      <div id="target1">
        <p>Hello NoneOS Demo Code</p>
      </div>
      <cc-comp></cc-comp>
    </template>
  </code>
  <code path="cc.html" active>
    <template component>
      <style>
        :host {
          display: block;
        }
      </style>
      <h3>{{title}}</h3>
      <script>
        export default async ({ load }) => {
          return {
            tag: "cc-comp",
            data: {
              title: "NoneOS Component Example",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
```

## Dependencies

- [ofa.js](https://github.com/kirakiray/ofa.js)
- NoneOS PUI Component Library

## File Structure

```
o-playground/
├── o-playground.html    # Main component
├── playground-layout.html # Layout component
├── writer.html          # Code writer
├── public.js           # Public utilities
└── case.html           # Usage examples
```
