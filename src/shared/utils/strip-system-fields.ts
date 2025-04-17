export function stripSystemFields<T extends object> (data: T): Partial<T> {
  const entries = Object.entries(data).filter(([key]) => !key.startsWith('$'));
  return Object.fromEntries(entries) as Partial<T>;
}
