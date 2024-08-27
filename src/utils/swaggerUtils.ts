export function normalizePath(path: string, baseURL: string) {
  if (baseURL) {
    const basePath = new URL(baseURL).pathname;
    if (path.startsWith(basePath)) {
      path = path.substring(basePath.length);
    }
  }
  return path;
}
