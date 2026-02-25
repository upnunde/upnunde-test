import fs from "fs/promises";
import path from "path";

export type InkEditorSource = {
  styles: string;
  script: string;
  body: string;
};

export async function loadInkEditorSource(): Promise<InkEditorSource> {
  const filePath = path.join(
    process.cwd(),
    "..",
    "prototype",
    "ink-editor.html"
  );

  const html = await fs.readFile(filePath, "utf8");

  const styleMatch = html.match(
    /<style[^>]*>([\s\S]*?)<\/style>/i
  );
  const scriptMatch = html.match(
    /<script[^>]*>([\s\S]*?)<\/script>/i
  );
  const bodyMatch = html.match(
    /<body[^>]*>([\s\S]*?)<\/body>/i
  );

  return {
    styles: styleMatch?.[1] ?? "",
    script: scriptMatch?.[1] ?? "",
    body: bodyMatch?.[1] ?? ""
  };
}

