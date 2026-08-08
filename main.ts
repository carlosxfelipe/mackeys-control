import { serveDir } from "@std/http/file-server";
import {
  applyAbnt2,
  disableMacMode,
  enableMacMode,
  removeCmdQ,
  setupCedilha,
  setupCmdQ,
} from "./systemInterop.ts";

// In dev mode (--hmr), the working directory is the project root, so "src" exists.
// In build mode (.app bundle), we use import.meta.dirname to access the embedded files.
let fsRoot = "src";
try {
  Deno.statSync(fsRoot);
} catch {
  fsRoot = `${import.meta.dirname}/src`;
}

const server = Deno.serve({ port: 0, hostname: "127.0.0.1" }, async (req) => {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/")) {
    const action = url.pathname.replace("/api/", "");
    try {
      let message = "";
      switch (action) {
        case "enableMacMode":
          message = await enableMacMode();
          break;
        case "disableMacMode":
          message = await disableMacMode();
          break;
        case "applyAbnt2":
          message = await applyAbnt2();
          break;
        case "setupCedilha":
          message = await setupCedilha();
          break;
        case "setupCmdQ":
          message = await setupCmdQ();
          break;
        case "removeCmdQ":
          message = await removeCmdQ();
          break;
        default:
          return new Response(
            JSON.stringify({ error: "Ação não encontrada" }),
            { status: 404 },
          );
      }
      return new Response(JSON.stringify({ message }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  return serveDir(req, { fsRoot });
});

// @ts-ignore: Deno.BrowserWindow is provided by deno-desktop
const win = new Deno.BrowserWindow({
  title: "MacKeys Control",
  width: 500,
  height: 550,
  transparentTitlebar: true,
});

// Force the window to the front on macOS
win.setAlwaysOnTop(true);
setTimeout(() => win.setAlwaysOnTop(false), 200);

win.navigate(`http://127.0.0.1:${server.addr.port}/index.html`);

// Handle window close
win.onclose = () => {
  Deno.exit(0);
};
