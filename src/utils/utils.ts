export function formatBytes(bytes: number): string {
  const units = ["b", "KB", "MB", "GB", "TB"];

  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }

  return bytes.toFixed(2) + " " + units[index];
}
