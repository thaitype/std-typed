import { Std } from "std-typed";

/**
 * https://www.npmjs.com/package/p-retry
 * https://2024-effect-days-keynote.vercel.app/8
 * https://youtu.be/PxIBWjiv3og
 *
 * TODO: Unhandled throw Error, is missing
 */

/**
 * Sleep for a specified amount of time and return a promise
 */
export const mockFetchConfig = async () => {
  await Std.sleep(500);
  return Promise.reject(new Error("Failed to fetch config"));
  // return Promise.resolve({ stringCase: 'uppercase' });
};

// const config = (await Result.promise(() => mockFetchConfig())).$get;
// console.log(`Config: ${JSON.stringify(config)}`); // => `Config: {"stringCase":"uppercase"}

export const mockParseJson = async (res: Response, url: string): Promise<unknown> => {
  return url.includes('invalidJson') ? Promise.reject(new Error("Invalid JSON")) : res.json();
}