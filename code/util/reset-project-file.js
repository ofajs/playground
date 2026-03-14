import { getHash } from "https://core.noneos.com/nos/util/hash/get-hash.js";
import { get, init } from "https://core.noneos.com/nos/fs/main.js";
import jsBeautify from "https://cdn.jsdelivr.net/npm/js-beautify@1.15.1/+esm";

export const resetProjectFile = async (originStr) => {
  const hash = await getHash(originStr);

  await init("code-projects");
  const projectDirHandle = await get("code-projects/" + hash, {
    create: "dir",
  });

  // 先清空项目文件
  for await (const handle of projectDirHandle.values()) {
    await handle.remove();
  }

  // 写入项目文件
  const data = JSON.parse(originStr);
  for (let { p: path, c: content } of data) {
    const handle = await projectDirHandle.get(path, {
      create: "file",
    });

    // 判断是html文件，则格式化html
    if (path.endsWith(".html")) {
      // 判断如果是不完整的html内容，则补充模板内容
      if (
        !content.startsWith("<template ") &&
        !content.toLowerCase().includes(`<!doctype`)
      ) {
        content = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${path.split("/").pop().replace(".html", "")}</title>
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
      }

      content = jsBeautify.html(content, {
        indent_size: 2,
        indent_char: " ",
        eol: "\n",
        preserve_newlines: false,
      });
    } else if (path.endsWith(".js") || path.endsWith(".mjs")) {
      content = jsBeautify.js(content, {
        indent_size: 2,
        indent_char: " ",
        eol: "\n",
      });
    } else if (path.endsWith(".css") || path.endsWith(".scss")) {
      content = jsBeautify.css(content, {
        indent_size: 2,
        indent_char: " ",
        eol: "\n",
      });
    }

    await handle.write(content);
  }
};
