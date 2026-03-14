import { getHash } from "https://core.noneos.com/nos/util/hash/get-hash.js";
import { get, init } from "https://core.noneos.com/nos/fs/main.js";
import jsBeautify from "https://cdn.jsdelivr.net/npm/js-beautify@1.15.1/+esm";

const FORMATTING_OPTIONS = {
  indent_size: 2,
  indent_char: " ",
  eol: "\n",
};

const HTML_TEMPLATE = (title, content) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      html,
      body {
        height: 100%;
        padding: 0;
        margin: 0;
      }
    </style>
  </head>
  <body>
    ${content}
  </body>
</html>
`;

const isHTML = (path) => path.endsWith(".html");
const isJS = (path) => path.endsWith(".js") || path.endsWith(".mjs");
const isCSS = (path) => path.endsWith(".css") || path.endsWith(".scss");

const formatContent = (path, content) => {
  if (isHTML(path)) {
    if (
      !content.startsWith("<template ") &&
      !content.toLowerCase().includes(`<!doctype`)
    ) {
      const title = path.split("/").pop().replace(".html", "");
      content = HTML_TEMPLATE(title, content);
    }
    return jsBeautify.html(content, {
      ...FORMATTING_OPTIONS,
      preserve_newlines: false,
    });
  }

  if (isJS(path)) {
    return jsBeautify.js(content, FORMATTING_OPTIONS);
  }

  if (isCSS(path)) {
    return jsBeautify.css(content, FORMATTING_OPTIONS);
  }

  return content;
};

export const resetProjectFile = async (projectJSON) => {
  const project = JSON.parse(projectJSON);
  const files = project.files;

  const projectHash = await getHash(JSON.stringify(project.files));

  await init("code-projects");
  const projectDir = await get("code-projects/" + projectHash, {
    create: "dir",
  });

  for await (const handle of projectDir.values()) {
    await handle.remove();
  }

  for (const { p: path, c: content } of files) {
    const handle = await projectDir.get(path, { create: "file" });
    const formattedContent = formatContent(path, content);
    await handle.write(formattedContent);
  }
};
