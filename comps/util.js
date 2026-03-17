// 压缩数据，支持字符串或 Uint8Array 输入，返回 base64 字符串
export const compress = async (data, format = "deflate") => {
  const inputData =
    typeof data === "string" ? new TextEncoder().encode(data) : data;

  const cs = new CompressionStream(format);
  const writer = cs.writable.getWriter();
  const reader = cs.readable.getReader();

  writer.write(inputData);
  writer.close();

  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const blob = new Blob(chunks);
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  const urlSafe = base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return urlSafe;
};

// 解压缩数据
export const decompress = async (data, format = "deflate") => {
  let inputData = data;
  if (typeof data === "string") {
    let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    inputData = bytes;
  }

  const ds = new DecompressionStream(format);
  const writer = ds.writable.getWriter();
  const reader = ds.readable.getReader();

  writer.write(inputData);
  writer.close();

  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const blob = new Blob(chunks);
  const arrayBuffer = await blob.arrayBuffer();
  const text = new TextDecoder().decode(arrayBuffer);
  return text;
};
