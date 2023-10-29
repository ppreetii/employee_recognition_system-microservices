export const removePermission = (original: number[], remove: number[]) => {
  const toRemove = new Set(remove);
  return original.filter((x) => !toRemove.has(x));
};
