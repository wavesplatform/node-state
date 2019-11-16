/**
 * This symbol definition is used to determine whether the last argument
 * passed into a middleware is already a defined `next` call.
 *
 * This allows for `compose(mw1, compose(mw2, mw3))` to work as intended.
 */
const isNext = Symbol('isNext');

/**
 * `middlewareWithContext` is variadic and takes middlewares as input.
 * It returns a variadic function which is invoked with context(s) and then executes
 * the middleware, currently `left-to-right`, returning a new `async` function.
 */
export const middlewareWithContext = (...mw: any) =>
  async function(...args: any) {
    /**
     * The last `next` in the chain, should either call the `next` handler
     * passed via `args` (denoting a continuation into another composition),
     * or do a no-op.
     */
    const nxt = args[args.length - 1][isNext] ? args.pop() : () => {};
    /**
     * `await` execution of all the middleware provided, by reducing each
     * supplied middleware and wrapping each function execution.
     */
    await mw.reduceRight(
      (next: any, curr: any) =>
        async function() {
          /**
           * Decorate each `next` handler with our `isNext` symbol to facilitate
           * composition of compositions.
           */
          next[isNext] = true;
          await curr(...args.concat(next));
        },
      nxt
    )();
  };
