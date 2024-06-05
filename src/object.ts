import * as Option from "./option.js";

/**
 * Get the class name of an instance
 * @param instance
 * @returns
 */

export function getClassName(instance: unknown): Option.Option<string> {
  if (instance && instance.constructor && instance.constructor.name) {
    if (typeof instance === "object") return Option.some(instance.constructor.name);
  }
  return Option.none;
}
