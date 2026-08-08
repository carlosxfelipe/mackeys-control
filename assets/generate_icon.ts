import { Resvg } from "@resvg/resvg-js";

const SVG_FILE = "icon_source.svg";
const PNG_FILE = "icon.png";

try {
  const svg = Deno.readTextFileSync(SVG_FILE);
  console.log(
    "Generating icon.png directly from SVG (perfect rasterization)...",
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 512 },
    shapeRendering: 2, // geometricPrecision
  });
  const pngData = resvg.render();
  Deno.writeFileSync(PNG_FILE, pngData.asPng());

  console.log(`Success! Created ${PNG_FILE}.`);
} catch (err) {
  console.error("Error generating icon:", err);
  Deno.exit(1);
}
