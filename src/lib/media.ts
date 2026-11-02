export type ImageFormat =
  | "png"
  | "jpeg"
  | "gif"
  | "webp"
  | "bmp"
  | "tiff"
  | "ico"
  | "pnm"
  | "svg"
  | "unknown";

const RASTER: ImageFormat[] = [
  "png",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "tiff",
  "ico",
  "pnm",
];

const MIME_FORMATS: Record<string, ImageFormat> = {
  png: "png",
  jpeg: "jpeg",
  jpg: "jpeg",
  gif: "gif",
  webp: "webp",
  bmp: "bmp",
  xbitmap: "bmp",
  tiff: "tiff",
  xicon: "ico",
  vndmicrosofticon: "ico",
  "x-portable-anymap": "pnm",
  "x-portable-bitmap": "pnm",
  "x-portable-pixmap": "pnm",
  "x-portable-greymap": "pnm",
  svg: "svg",
  "svg+xml": "svg",
  xml: "svg",
};

const EXTENSION_FORMATS: Record<string, ImageFormat> = {
  png: "png",
  jpg: "jpeg",
  jpeg: "jpeg",
  jpe: "jpeg",
  gif: "gif",
  webp: "webp",
  bmp: "bmp",
  dib: "bmp",
  tif: "tiff",
  tiff: "tiff",
  ico: "ico",
  cur: "ico",
  pbm: "pnm",
  pgm: "pnm",
  ppm: "pnm",
  pnm: "pnm",
  svg: "svg",
  xml: "svg",
};

export function imageFormatOf(mimeType: string): ImageFormat {
  const base = (mimeType.split(";")[0] ?? mimeType).trim().toLowerCase();
  if (!base.startsWith("image/"))
    return MIME_FORMATS[base] ?? (base === "svg" ? "svg" : "unknown");
  return MIME_FORMATS[base.slice("image/".length)] ?? "unknown";
}

export function isRasterFormat(format: ImageFormat): boolean {
  return RASTER.includes(format);
}

export function isRasterMimeType(mimeType: string): boolean {
  return isRasterFormat(imageFormatOf(mimeType));
}

export function isRasterFormatName(name: string): boolean {
  return isRasterFormat(imageFormatOfExtension(name));
}

export function imageFormatOfExtension(name: string): ImageFormat {
  const leaf = name.slice(name.lastIndexOf("/") + 1).toLowerCase();
  const dot = leaf.lastIndexOf(".");
  if (dot < 0) return "unknown";
  return EXTENSION_FORMATS[leaf.slice(dot + 1)] ?? "unknown";
}

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64HeadBytes(value: string, count: number): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < value.length && bytes.length < count; i += 4) {
    let acc = 0;
    let bits = 0;
    for (const char of value.slice(i, i + 4)) {
      const code = ALPHABET.indexOf(char);
      if (code < 0) break;
      acc = (acc << 6) | code;
      bits += 6;
    }
    for (let shift = bits - 8; shift >= 0 && bytes.length < count; shift -= 8)
      bytes.push((acc >>> shift) & 255);
  }
  return bytes;
}

function ascii(bytes: number[], start: number, length: number): string {
  return bytes
    .slice(start, start + length)
    .map((byte) => String.fromCharCode(byte))
    .join("");
}

function isPnm(bytes: number[]): boolean {
  if (bytes[0] !== "P".charCodeAt(0)) return false;
  const digit = Number(ascii(bytes, 1, 1));
  return digit >= 1 && digit <= 7;
}

function formatOfBytes(bytes: number[]): ImageFormat | undefined {
  if (bytes.length < 4) return undefined;
  if (bytes[0] === 0x89 && ascii(bytes, 1, 3) === "PNG") return "png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "jpeg";
  if (ascii(bytes, 0, 4) === "GIF8") return "gif";
  if (ascii(bytes, 0, 2) === "BM") return "bmp";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP")
    return "webp";
  if (
    (ascii(bytes, 0, 2) === "II" && bytes[2] === 42) ||
    (ascii(bytes, 0, 2) === "MM" && bytes[3] === 42)
  )
    return "tiff";
  if (bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1) return "ico";
  if (isPnm(bytes)) return "pnm";
  const markup = ascii(bytes, 0, Math.min(bytes.length, 16)).replace(
    /^[\s\ufeff]+/,
    "",
  );
  if (markup.startsWith("<")) return "svg";
  return undefined;
}

export function imageFormatOfSource(src: string): ImageFormat {
  const trimmed = src.trim();
  if (trimmed.startsWith("data:")) {
    const comma = trimmed.indexOf(",");
    if (comma < 0) return imageFormatOf(trimmed.slice(5, comma + 5));
    const meta = trimmed.slice(5, comma);
    const declared = imageFormatOf(meta);
    const payload = trimmed.slice(comma + 1);
    if (meta.toLowerCase().includes(";base64")) {
      const sniffed = formatOfBytes(base64HeadBytes(payload, 16));
      if (sniffed !== undefined) return sniffed;
      return declared;
    }
    let text = payload;
    try {
      text = decodeURIComponent(payload);
    } catch {
      text = payload;
    }
    const head = text.replace(/^[\s\ufeff]+/, "").slice(0, 64);
    if (head.startsWith("<")) return "svg";
    return declared;
  }
  const extension = imageFormatOfExtension(trimmed);
  return extension;
}

export function isRenderableImage(src: string, mimeType?: string): boolean {
  if (src.trim() === "") return false;
  const sniffed = imageFormatOfSource(src);
  if (isRasterFormat(sniffed)) return true;
  if (mimeType === undefined) return false;
  return isRasterMimeType(mimeType) && sniffed !== "svg";
}
