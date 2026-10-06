export function generateUniqueSku(
  size?: string,
  colorName?: string,
  styleName?: string | null,
  materialName?: string | null,
  prefix = "MP"
): string {
  const sizeCode = size && size.trim() ? size.trim().toUpperCase() : "DEF";
  const colorCode =
    colorName && colorName.trim().length >= 3
      ? colorName.trim().slice(0, 3).toUpperCase()
      : colorName && colorName.trim()
      ? colorName.trim().toUpperCase()
      : "VAR";
  const styleCode =
    styleName && styleName.trim().length >= 2
      ? styleName.trim().slice(0, 2).replace(/\s+/g, "").toUpperCase()
      : "";
  const materialCode =
    materialName && materialName.trim().length >= 2
      ? materialName.trim().slice(0, 2).replace(/\s+/g, "").toUpperCase()
      : "";

  const parts = [prefix, styleCode, materialCode, sizeCode, colorCode].filter(Boolean);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${parts.join("-")}-${randomSuffix}`;
}
