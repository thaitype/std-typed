# typed-std

Experimental Implementation of the standard library for the TypeScript, inspired by Rust's standard library.

## Interesting Libraries for Enhancing Standard Library Concepts
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
  
## Using Rust for Some Feature of Standard Library
- Using [napi](https://napi.rs/) for FFI (Foreign Function Interface) to Rust.
  - may cause issue with the performance, but it's worth to try.
  - may cause issue with Bundling, but it's worth to try.
  - Good examples see [nodejs-polars](https://github.com/pola-rs/nodejs-polars)