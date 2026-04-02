export const prefixContent = `<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js#debug"><\/script>
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/theme.css" />
<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/palette.css" />\n`;

const decodeHTMLEntities = (str) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
};

export const getLanguageFromPath = (path) => {
  const ext = path.split(".").pop().toLowerCase();
  const langMap = {
    html: "html",
    htm: "html",
    js: "javascript",
    javascript: "javascript",
    ts: "typescript",
    typescript: "typescript",
    css: "css",
    json: "json",
    xml: "xml",
    md: "markdown",
    markdown: "markdown",
    py: "python",
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rs: "rust",
    rust: "rust",
    php: "php",
    rb: "ruby",
    ruby: "ruby",
    sql: "sql",
    yaml: "yaml",
    yml: "yaml",
    sh: "bash",
    bash: "bash",
    vue: "vue",
    jsx: "javascript",
    tsx: "typescript",
  };
  return langMap[ext] || "plaintext";
};

export const formatCode = async (content, language) => {
  try {
    const { default: jsBeautify } =
      await import("https://cdn.jsdelivr.net/npm/js-beautify@1.15.1/+esm");

    if (language === "html" || language === "xml") {
      return jsBeautify.html(content, {
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 2,
        preserve_newlines: true,
        indent_inner_html: true,
        wrap_line_length: 0,
        wrap_attributes: "auto",
        wrap_attributes_indent_size: 2,
        end_with_newline: true,
      });
    } else if (language === "javascript" || language === "typescript") {
      return jsBeautify.js(content, {
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 2,
        preserve_newlines: true,
        space_in_paren: false,
        space_in_empty_paren: false,
        jslint_happy: false,
        space_after_anon_function: true,
        space_after_named_function: false,
        space_before_conditional: true,
        keep_array_indentation: false,
        keep_function_indentation: false,
        unescape_strings: false,
        wrap_line_length: 0,
        e4x: false,
        comma_first: false,
        operator_position: "before-newline",
        indent_empty_lines: false,
        templating: ["auto"],
      });
    } else if (language === "css") {
      return jsBeautify.css(content, {
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 2,
        preserve_newlines: true,
        selector_separator_newline: true,
        end_with_newline: true,
        newline_between_rules: true,
        space_around_combinator: true,
      });
    }
  } catch (error) {
    console.warn("Code formatting failed:", error);
  }
  return content;
};

export const getFileContent = async (codes, getHash) => {
  const files = await Promise.all(
    codes
      .map(async (codeEl) => {
        let path = codeEl.attr("path");

        if (!path) {
          if (codes.length === 1) {
            path = "demo.html";
          } else {
            return;
          }
        }

        const firstCodeChild = codeEl[0];

        const isComponent =
          firstCodeChild && firstCodeChild.attr("component") !== null;
        const isPage = firstCodeChild && firstCodeChild.attr("page") !== null;

        let content = "";

        if (isPage) {
          content = `<template page\>${decodeHTMLEntities(firstCodeChild.html)}</template>`;
        } else if (isComponent) {
          content = `<template component\>${decodeHTMLEntities(firstCodeChild.html)}</template>`;
        } else if (
          codeEl.length === 1 &&
          (firstCodeChild.tag === "template" || firstCodeChild.tag === "pre")
        ) {
          content = decodeHTMLEntities(firstCodeChild.html);
        } else {
          content = decodeHTMLEntities(codeEl.html);
        }

        const contentHash = await getHash(content);

        if (
          !isComponent &&
          !isPage &&
          !!firstCodeChild &&
          firstCodeChild.tag === "template"
        ) {
          content =
            `<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/palette.css" />` +
            content;
          content =
            `<link rel="stylesheet" href="https://core.noneos.com/nos-tool/css/theme.css" />` +
            content;
          content =
            `<script src="https://cdn.jsdelivr.net/gh/kirakiray/ofa.js/dist/ofa.min.js#debug"><\/script>` +
            content;
        }

        const active = codeEl.attr("active") !== null;
        const preview = codeEl.attr("preview") !== null;
        const unimportant = codeEl.attr("unimportant") !== null;

        return {
          contentHash,
          path,
          content,
          isComponent,
          isPage,
          defaultActive: active,
          preview,
          unimportant,
        };
      })
      .filter((item) => !!item),
  );

  const totalHash = await getHash(
    files.map((item) => item.contentHash).join(""),
  );

  return {
    files,
    totalHash,
  };
};

export const handleOpenClick = async (
  fileItems,
  activeFilePath,
  compress,
  nameAttr,
) => {
  const files = fileItems.map((item) => ({
    p: item.path,
    c: item.content,
  }));

  const redata = {
    active: activeFilePath,
    files,
    name: nameAttr,
  };

  const str = JSON.stringify(redata);

  const compressedStr = await compress(str);
  const url = location.host.includes("localhost:4002")
    ? `/?redirect=w&d=${compressedStr}`
    : `https://playground.ofajs.com/?redirect=w&d=${compressedStr}`;

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.click();
};
