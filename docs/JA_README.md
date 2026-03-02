# o-playground

o-playgroundはマルチファイル編集やリアルタイムプレビューをサポートするインタラクティブなコードプレビューコンポーネントです。主にofa.jsプロジェクトの実行効果を示すために使用されます。

## 基本的な使い方

まずofa.jsの基礎ライブラリを読み込み、次に変換o-playgroundコンポーネントを導入します。

```html
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.mjs" type="module"></script>
<l-m src="https://playground.ofajs.com/comps/o-playground/o-playground.html"></l-m>
<o-playground>
  <code path="demo.html">
    <div>Hello World</div>
  </code>
</o-playground>
```

## マルチファイルサポート

複数の`<code>`タグを使用して複数のファイルを定義できます：

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

## コード属性

### `path`

ファイルのパスとファイル名を指定します。必須属性です。

```html
<code path="index.html">...</code>
```

### `preview`（オプション）

このファイルをプレビューファイルとしてマークします。コンポーネントはプレビューエリアにこのファイルを読み込みます。指定しない場合、コンポーネントは自動的にPage/Component以外のファイルをプレビューファイルとして選択します。

```html
<code path="demo.html" preview>...</code>
```

### `active`（オプション）

このファイルを現在のアクティブ状態に設定します。つまり、エディタにデフォルトで表示されるファイルです。

```html
<code path="main.js" active>...</code>
```

### `unimportant`（オプション）

このファイルを「重要でない」ファイルとしてマークします。設定の「Hide unimportant files」オプションと組み合わせると、これらの補助ファイルを非表示にできます。

```html
<code path="utils.js" unimportant>...</code>
```

## ファイルタイプの自動認識

コンポーネントは次のファイルタイプを自動的に認識します：

| タイプ | 認識方法 | ラッパーテンプレート |
|--------|----------|---------------------|
| Pageコンポーネント | `<template page>` | `<template page>...</template>` |
| 通常のコンポーネント | `<template component>` | `<template component>...</template>` |
| 通常テンプレート | `<template>`または`<pre>`またはその他 | コンテンツを直接使用 |
| その他のファイル | 特別なマークなし | コンテンツを直接使用 |

`<template>`タイプのファイルについて、システムはそれらを通常のHTMLコンテンツとして扱い、以下のリソースを自動的に挿入します：

```html
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/palette.css" />
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/theme.css" />
<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js#debug"></script>
```

## スタイル変数

| 変数 | 説明 | デフォルト値 |
|------|------|--------------|
| `--editor-height` | エディタの高さ | `200px` |
| `--preview-height` | プレビューエリアの高さ | `200px` |

```html
<o-playground style="--editor-height: 500px">
  ...
</o-playground>
```

## 機能

### エディタ機能

- **マルチファイルタブ**: 複数のファイルを同時に編集でき、上部のタブで切り替え可能
- **コードハイライト**: 組み込みのコードハイライト表示
- **ファイル切り替え**: タブをクリックして現在編集中のファイルを切り替え
- **自動保存プロンプト**: 編集後に保存プロンプトを表示（Mac: Cmd+S、Windows: Ctrl+S）

### プレビュー機能

- **リアルタイムプレビュー**: 保存後に自動的にプレビューを更新
- **手動更新**: 上部の更新ボタンをクリックしてプレビューを再読み込み
- **新しいウィンドウで開く**: 外部リンクアイコンをクリックして新しいウィンドウでプレビューを開く

### 設定機能

上部の設定ボタンをクリックして以下のオプションにアクセス：

- **Hide unimportant files**: unimportantとしてマークされたファイルタブを非表示
- **Restore Editor Size**: エディタのデフォルトサイズを復元

### テーマサポート

テーマの切り替えがサポートされています。PUI Consumerを通じてテーマを取得し、同期することができます。

## 完全な例

### 1. シンプルな例

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

### 2. ofa.js アプリの例

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

### 3. コンポーネントの例

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
              title: "NoneOS コンポーネントの例",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
```

## 依存関係

- [ofa.js](https://github.com/kirakiray/ofa.js)
- NoneOS PUI コンポーネントライブラリ

## ファイル構造

```
o-playground/
├── o-playground.html    # メインコンポーネント
├── playground-layout.html # レイアウトコンポーネント
├── writer.html          # コードライター
├── public.js           # ユーティリティ
└── case.html           # 使用例
```
