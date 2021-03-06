---
title: React.ts
nav_order: 3
parent: Modules
---

## React overview

React/Preact specific utilities for wrapping a Store in hooks.

Added in v8.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [DependencyList (type alias)](#dependencylist-type-alias)
  - [Dispatch (type alias)](#dispatch-type-alias)
  - [EffectCallback (type alias)](#effectcallback-type-alias)
  - [SetStateAction (type alias)](#setstateaction-type-alias)
  - [UseCallback (type alias)](#usecallback-type-alias)
  - [UseEffect (type alias)](#useeffect-type-alias)
  - [UseState (type alias)](#usestate-type-alias)
  - [useDispatchFactory](#usedispatchfactory)
  - [useStoreFactory](#usestorefactory)

---

# utils

## DependencyList (type alias)

Type annotation for React DependencyList

**Signature**

```ts
export type DependencyList = ReadonlyArray<any>
```

Added in v8.0.0

## Dispatch (type alias)

Type annotation for React Dispatch

**Signature**

```ts
export type Dispatch<A> = (value: A) => void
```

Added in v8.0.0

## EffectCallback (type alias)

Type annotation for React EffectCallback

**Signature**

```ts
export type EffectCallback = () => void | (() => void | undefined)
```

Added in v8.0.0

## SetStateAction (type alias)

Type annotation for React SetStateAction

**Signature**

```ts
export type SetStateAction<S> = S | ((prevState: S) => S)
```

Added in v8.0.0

## UseCallback (type alias)

Type annotation for the React useCallback hook.

**Signature**

```ts
export type UseCallback<T extends Fn<any, any>> = (callback: T, deps: DependencyList) => T
```

Added in v8.1.0

## UseEffect (type alias)

Type annotation for the React useEffect hook.

**Signature**

```ts
export type UseEffect = (effect: EffectCallback, deps?: DependencyList) => void
```

Added in v8.0.0

## UseState (type alias)

Type annotation for the React useState hook.

**Signature**

```ts
export type UseState = <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>]
```

Added in v8.0.0

## useDispatchFactory

**Signature**

```ts
export declare function useDispatchFactory<S>(store: Store<S>, useCallback: UseCallback<any>)
```

Added in v8.1.0

## useStoreFactory

Creates a useStore hook.

First function takes a store instance, a useState hook, and a useEffect hook. It
then returns a useStore hook.

Second function takes a selector and an optional comparator and
returns the output of the selector and the store's dispatch function

Updates only when comparator detects a change (by default on strict equality change)

**Signature**

```ts
export declare const useStoreFactory: <S>(
  store: Store<S>,
  useState: UseState,
  useEffect: UseEffect
) => <O>(selector: (s: S) => O, comparator?: (p: O, n: O) => boolean) => [O, (...as: TypedAction[]) => void]
```

Added in v8.0.0
