/**
 * @param  {number} h 色相 0-360
 * @param  {number} s 饱和度 0-1
 * @param  {number} b 明度 0-1
 * @return {number[]}   [r,g,b]
 */
function HSBToRGB(h, s, b) {
  // 确保输入值在有效范围内
  h = ((h % 360) + 360) % 360; // 色相 0-360
  s = Math.max(0, Math.min(1, s)); // 饱和度 0-1
  b = Math.max(0, Math.min(1, b)); // 明度 0-1

  const c = b * s; // 色度
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;

  let r, g, bPrime;

  if (h >= 0 && h < 60) {
    [r, g, bPrime] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, bPrime] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, bPrime] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, bPrime] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, bPrime] = [x, 0, c];
  } else {
    [r, g, bPrime] = [c, 0, x];
  }

  // 转换为 0-255 的 RGB 值
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((bPrime + m) * 255);

  return [R, G, B];
}
