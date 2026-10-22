export type Schema<T> = (value: unknown, path?: string) => T;
function fail(path: string, expected: string): never {
  throw new TypeError(`${path}: expected ${expected}`);
}
export const string: Schema<string> = (v, p = "$") =>
  typeof v === "string" ? v : fail(p, "string");
export const number: Schema<number> = (v, p = "$") =>
  typeof v === "number" && Number.isFinite(v) ? v : fail(p, "finite number");
export const boolean: Schema<boolean> = (v, p = "$") =>
  typeof v === "boolean" ? v : fail(p, "boolean");
export function optional<T>(schema: Schema<T>): Schema<T | undefined> {
  return (v, p) => (v === undefined ? undefined : schema(v, p));
}
export function array<T>(schema: Schema<T>): Schema<T[]> {
  return (v, p = "$") =>
    Array.isArray(v)
      ? v.map((x, i) => schema(x, `${p}[${i}]`))
      : fail(p, "array");
}
export function object<S extends Record<string, Schema<unknown>>>(
  shape: S,
): Schema<{ [K in keyof S]: ReturnType<S[K]> }> {
  return (v, p = "$") => {
    if (v === null || typeof v !== "object" || Array.isArray(v))
      return fail(p, "object");
    const input = v as Record<string, unknown>;
    const out = Object.create(null) as { [K in keyof S]: ReturnType<S[K]> };
    for (const key of Object.keys(shape) as (keyof S & string)[])
      out[key] = shape[key]!(
        Object.hasOwn(input, key) ? input[key] : undefined,
        p + "." + key,
      ) as ReturnType<S[typeof key]>;
    return out;
  };
}
