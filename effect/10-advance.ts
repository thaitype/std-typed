// https://www.youtube.com/watch?v=7jOD5okJC00&t=452s
// https://github.com/IMax153/advanced-effect-workshop/blob/main/workshop/samples/session-01/wrappers.ts

import { Data, Effect, Option, Secret, Stream } from "effect";
import { OpenAI as OpenAIApi } from "openai";


export interface OpenAIOptions {
  readonly apiKey: Secret.Secret;
  readonly organization: Option.Option<Secret.Secret>;
}

export class OpenAIError extends Data.TaggedError("OpenAIError")<{
  readonly error: unknown;
}> {}

const handleError = (error: unknown) =>
  new OpenAIError({ error: (error as any).error?.message ?? error });

// Option 1 = One-off Approach

export const oneOffApproach = (
  client: OpenAIApi,
  body: OpenAIApi.ChatCompletionCreateParamsNonStreaming,
  options?: Omit<OpenAIApi.RequestOptions, "signal">
) =>
  Effect.tryPromise({
    try: (signal) =>
      client.chat.completions.create(body, { ...options, signal }),
    catch: (error) => new OpenAIError({ error }),
  });

// Option 2 = Flexible Approach

export const flexibleApproach = (options: OpenAIOptions) =>
  Effect.gen(function* (_) {
    const client = yield* _(getClient(options));

    const call = <A>(
      f: (client: OpenAIApi, signal: AbortSignal) => Promise<A>
    ): Effect.Effect<A, OpenAIError> =>
      Effect.tryPromise({
        try: (signal) => f(client, signal),
        catch: (error) => handleError(error),
      });

    return {
      call,
    };
  });



// =============================================================================
// Internals
// =============================================================================

const getClient = (options: OpenAIOptions): Effect.Effect<OpenAIApi> =>
  Effect.sync(() =>
    new OpenAIApi({
      apiKey: Secret.value(options.apiKey),
      organization: options.organization.pipe(
        Option.map(Secret.value),
        Option.getOrNull
      )
    })
  )