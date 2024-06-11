/**
 * Check if the value is a promise
 *
 * @param value
 * @returns
 */

export const isPromise = (value: unknown): value is Promise<unknown> => {
  return (
    value instanceof Promise ||
    (typeof value === "object" &&
      value !== null &&
      "then" in value &&
      typeof value.then === "function" &&
      "catch" in value &&
      typeof value.catch === "function")
  );
};
