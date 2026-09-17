export function generateUniqueSku(size?: string, colorName?: string, prefix = "MP"): string {
  const sizeCode = size && size.trim() ? size.trim().toUpperCase() : "DEF";
  const colorCode =
    colorName && colorName.trim().length >= 3
      ? colorName.trim().slice(0, 3).toUpperCase()
      : colorName && colorName.trim()
      ? colorName.trim().toUpperCase()
      : "VAR";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${sizeCode}-${colorCode}-${randomSuffix}`;
}
