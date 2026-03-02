# o-playground

o-playground 是一款交互式代码预览组件，支持多文件编辑、实时预览等功能，主要用于展示 ofa.js 项目的运行效果。

## 基本用法

首先加载 ofa.js 基础库，再引入 o-playground 组件。

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
<l-m src="https://playground.ofajs.com/comps/o-playground/o-playground.html"></l-m>
<o-playground>
  <code path="demo.html">
    <div>Hello World</div>
  </code>
</o-playground>
```

## 多文件支持

可以通过多个 `<code>` 标签定义多个文件：

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

## 代码属性

### `path`

指定文件的路径和文件名。必填属性。

```html
<code path="index.html">...</code>
```

### `preview` (可选)

标记该文件为预览文件。组件会在预览区域加载此文件。如果不指定，组件会自动选择一个非 Page/Component 的文件作为预览文件。

```html
<code path="demo.html" preview>...</code>
```

### `active` (可选)

设置该文件为当前激活状态，即编辑器中默认显示的文件。

```html
<code path="main.js" active>...</code>
```

### `unimportant` (可选)

标记该文件为"不重要"的文件。配合设置中的「Hide unimportant files」功能，可以隐藏这些辅助文件。

```html
<code path="utils.js" unimportant>...</code>
```

## 文件类型自动识别

组件会自动识别以下文件类型：

| 类型      | 识别方式                       | 包装模板                             |
| --------- | ------------------------------ | ------------------------------------ |
| Page 组件 | `<template page>`              | `<template page>...</template>`      |
| 普通组件  | `<template component>`         | `<template component>...</template>` |
| 普通模板  | `<template>` 或 `<pre>` 或其他 | 直接使用内容                         |
| 其他文件  | 无特殊标记                     | 直接使用内容                         |

对于 `<template>` 类型的文件，系统会将其视为普通 HTML 内容，并自动注入以下资源：

```html
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/palette.css" />
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/theme.css" />
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js#debug"></script>
```

## 样式变量

| 变量               | 说明         | 默认值  |
| ------------------ | ------------ | ------- |
| `--editor-height`  | 编辑器高度   | `200px` |
| `--preview-height` | 预览区域高度 | `200px` |

```html
<o-playground style="--editor-height: 500px">
  ...
</o-playground>
```

## 功能特性

### 编辑器功能

- **多文件标签**：支持同时编辑多个文件，通过顶部标签切换
- **代码高亮**：内置代码高亮显示
- **文件切换**：点击标签切换当前编辑的文件
- **自动保存提示**：编辑后显示保存提示（Mac: Cmd+S, Windows: Ctrl+S）

### 预览功能

- **实时预览**：保存后自动刷新预览
- **手动刷新**：点击顶部刷新按钮重新加载预览
- **新窗口打开**：点击外部链接图标在新窗口中打开预览

### 设置功能

点击顶部设置按钮可访问以下选项：

- **Hide unimportant files**：隐藏标记为 unimportant 的文件标签
- **Restore Editor Size**：恢复编辑器的默认尺寸

### 主题支持

支持主题切换，可通过 PUI Consumer 获取主题并进行同步。

## 完整示例

### 1. 简单示例

```html
<o-playground style="--editor-height: 300px">
  <code>
    <div id="target1">
      <p>Hello NoneOS Demo Code</p>
    </div>
    <script>
      let count = 0;
      setInterval(() => {
        $("#target1").text = "change text " + count++;
      }, 500);
    </script>
  </code>
</o-playground>
```

### 2.ofa.js 应用示例

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

### 3.组件示例

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
              title: "NoneOS 组件示例",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
```

## 依赖

- [ofa.js](https://github.com/kirakiray/ofa.js)
- NoneOS PUI 组件库

## 文件结构

```
o-playground/
├── o-playground.html    # 主组件
├── playground-layout.html # 布局组件
├── writer.html          # 代码写入器
├── public.js           # 公共工具
└── case.html           # 使用案例
```
