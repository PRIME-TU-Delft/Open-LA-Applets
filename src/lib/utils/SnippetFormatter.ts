import type { Snippet } from 'svelte';

type Convert<A extends unknown[]> = {
  [K in keyof A]: A[K] extends A[K] ? (() => A[K]) | undefined : never;
};

// type FillArgs<A extends unknown[], B extends unknown[]> = {
//   [K in keyof A]: A[K] extends undefined ? B[K] : A[K];
// };

export function snippetFormatter<Args extends unknown[] = []>(
  snippet: Snippet<Args>,
  args: Convert<Args>
) {
  function fillArgs(arg1: Args[], arg2: Args[]): Args[] {
    for (let index = 0; index < arg1.length; index++) {
      if (arg1[index] === undefined) {
        arg1[index] = arg2.shift();
      }
    }
    if (arg2.length > 0) {
      arg1.push(...arg2);
    }
    return arg1;
  }

  if (snippet.length - 1 === args.length) {
    return function ($$anchor: any) {
      return snippet($$anchor, ...args);
    };
  }

  return function ($$anchor: any, ...arg: Partial<Args>) {
    const fullArguments = fillArgs(args, arg);
    return snippet($$anchor, ...fullArguments);
  };
}
