async function exists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
}

const APP_DIR = "MacKeysControl";
const APPIMAGE_TOOL = "appimagetool";
const APPIMAGE_TOOL_URL =
  "https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage";

async function main() {
  console.log("🔨 Compiling application...");
  const compileCommand = new Deno.Command("deno", {
    args: [
      "desktop",
      "-A",
      "--include",
      "src",
      "--output",
      `${APP_DIR}.app`,
      "main.ts",
    ],
    stdout: "inherit",
    stderr: "inherit",
  });
  const compileResult = await compileCommand.output();
  if (!compileResult.success) {
    console.error("❌ Failed to compile application.");
    Deno.exit(1);
  }

  console.log("📦 Verifying build directory...");
  if (!(await exists(APP_DIR))) {
    console.error(`❌ Directory ${APP_DIR} was not created by the compiler.`);
    Deno.exit(1);
  }

  // 1. Download appimagetool if not exists
  if (!(await exists(APPIMAGE_TOOL))) {
    console.log(
      "⬇️ Downloading appimagetool (this only happens on the first run)...",
    );
    const response = await fetch(APPIMAGE_TOOL_URL);
    if (!response.ok) {
      console.error("❌ Failed to download appimagetool.");
      Deno.exit(1);
    }
    const file = await Deno.open(APPIMAGE_TOOL, { write: true, create: true });
    await response.body?.pipeTo(file.writable);
    await Deno.chmod(APPIMAGE_TOOL, 0o755); // Make executable
    console.log("✅ appimagetool downloaded successfully.");
  }

  // 2. Prepare AppDir format
  console.log("🔧 Preparing AppDir structure...");

  // Copy icon
  if (await exists("assets/icon.png")) {
    await Deno.copyFile("assets/icon.png", `${APP_DIR}/MacKeysControl.png`);
    await Deno.copyFile("assets/icon.png", `${APP_DIR}/.DirIcon`);
  } else {
    console.warn("⚠️ Icon not found at assets/icon.png");
  }

  // Create AppRun symlink (Required format for AppImage)
  const appRunPath = `${APP_DIR}/AppRun`;
  if (!(await exists(appRunPath))) {
    // We use a symlink to save space and point to the real binary
    await Deno.symlink("MacKeysControl", appRunPath);
  }

  // 3. Build AppImage
  console.log("🚀 Building AppImage...");
  const command = new Deno.Command(`./${APPIMAGE_TOOL}`, {
    args: [
      "--appimage-extract-and-run",
      APP_DIR,
      "MacKeysControl-x86_64.AppImage",
    ],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { success, code } = await command.output();

  if (success) {
    console.log(
      "🎉 AppImage created successfully: MacKeysControl-x86_64.AppImage",
    );
  } else {
    console.error(`❌ Failed to create AppImage. Exit code: ${code}`);
  }
}

main();
