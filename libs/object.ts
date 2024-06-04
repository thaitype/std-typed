import { none, some, type Option } from "./option";

/**
 * Get the class name of an instance
 * @param instance
 * @returns
 */

export function getClassName(instance: unknown): Option<string> {
  if (instance && instance.constructor && instance.constructor.name) {
    if (typeof instance === "object") return some(instance.constructor.name);
  }
  return none;
}
