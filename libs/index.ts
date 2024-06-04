/**
 * Main entry point of the library
 * 
 * typed-std is a collection of TypeScript types and utilities for standard JavaScript objects and functions.
 * 
 */
export * as Std from "./root";

/**
 * Option module
 */
export * as Option from "./option";

/**
 * Result module
 */
export * as Result from "./result";

// --- Prevent duplicate name with JavaScript's global objects ---

/**
 * Number module
 */
export * as $Number from "./number";
/**
 * Promise module
 */
export * as $Promise from "./promise";