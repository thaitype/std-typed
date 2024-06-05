# Standard Typed

Experimental Implementation of the standard library for the TypeScript, inspired by Rust's standard library.

## Project Philosophy

- **Standard Library**: The standard library should be a collection of useful data structures and functions that are commonly used in everyday programming.
- **Type Safety**: The standard library should be type-safe.
- **Performance**: The standard library should be performant.
- **Error Handling**: The standard library should provide a way to handle errors.

## What's excluded? 
- No Functional Programming (FP) concepts, please use [Effect](https://effect.website/) for that.
- Complex scenarios using consider using [Effect](https://effect.website/).

## Considerations
- Implementing custom function ported from Rust using `napi` for performance.
  - However, this may cause issue with the performance, if's applied in the wrong way.
  - However, this may cause issue with Bundling, so, this, library should provided mimimal version e.g. `@std-types/minimal` 

## Resources

### Interesting Libraries for Enhancing Standard Library Concepts
- Data Structures: 
  - [immutable-js](https://github.com/immutable-js/immutable-js) e.g. List, Stack, Map, OrderedMap, Set, OrderedSet, and Record.
  - [data-structure-typed](https://github.com/zrwusa/data-structure-typed) - Heap, Binary Tree, Red Black Tree, Linked List, Deque, Trie, HashMap, Directed Graph, Undirected Graph, Binary Search Tree, AVL Tree, Priority Queue, Graph, Queue, Tree Multiset, Singly Linked List, Doubly Linked List, Max Heap, Max Priority Queue, Min Heap, Min Priority Queue, Stack.
- Result/Option Patterns:
  - [neverthrow](https://github.com/supermacro/neverthrow)
  - [ts-results](https://github.com/vultix/ts-results)
  - [true-myth](https://github.com/true-myth/true-myth)
- Pattern Matching:
  - [ts-pattern](https://github.com/gvergnaud/ts-pattern)
- Promise:
  - [Promise Fun](https://github.com/sindresorhus/promise-fun)
- FP (Functional Programming):
  - [Effect](https://effect.website/)
  
### Using Rust for Some Feature of Standard Library
- Using [napi](https://napi.rs/) for FFI (Foreign Function Interface) to Rust.
  - Good examples see [nodejs-polars](https://github.com/pola-rs/nodejs-polars)