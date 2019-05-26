export function escapeForCli(filepath) {
  if (!filepath || filepath.trim().length === 0) {
    return './';
  }
  return filepath.replace(
    /([\s\(\)\-])/g,
    `${process.platform === 'win32' ? '^' : '\\'}$1`
  );
}
