---
title: Store.ts
nav_order: 6
parent: Modules
---

# Store overview

Added in v8.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [MetaReducer (type alias)](#metareducer-type-alias)
- [RunEvery (type alias)](#runevery-type-alias)
- [RunOnce (type alias)](#runonce-type-alias)
- [Selector (type alias)](#selector-type-alias)
- [StoreApi (type alias)](#storeapi-type-alias)
- [createStore](#createstore)

---

# MetaReducer (type alias)

A MetaReducer is a function that takes a reducer and returns a reducer. It's useful
for modifying or tracking the state before and after a reducer fires.

**Signature**

```ts
export type MetaReducer<S> = (reducer: Reducer<S>) => Reducer<S>
```

**Example**

```ts
import { MetaReducer } from '../../src/Store'

export const loggingMetaReducer: MetaReducer<any> = reducer => {
  return function loggingReducer(previousState, action) {
    const state = reducer(previousState, action)
    console.log(action.type, { previousState, state, action })
    return state
  }
}
```

Added in v8.0.0

# RunEvery (type alias)

An Epic encapsulates side effects or temporal changes for the store.
It is given access to the current action and state, the action and
state observables, and may return nothing, an action, a promise that
contains an action, or an observable of actions.

**Signature**

```ts
export type RunEvery<S> = (
  state: S,
  action: TypedAction
) => Observable<TypedAction> | Promise<TypedAction | void> | TypedAction | void
```

**Example**

```ts
import { RunEvery } from '../../src/Store'

export const logger: RunEvery<any> = (action, state) => {
  console.log(`State after ${action.type} reduced:`, { state, action })
}
```

Added in v8.0.0

# RunOnce (type alias)

**Signature**

```ts
export type RunOnce<S> = (actions$: Observable<TypedAction>, state$: Observable<S>) => Observable<TypedAction>
```

Added in v8.0.0

# Selector (type alias)

A Selector narrows or modifies the state. It is effectively a lens into a particular
part of the state.

**Signature**

```ts
export type Selector<S, O> = (state: S) => O
```

**Example**

```ts
import { createStore } from '../../src/Store'

const store = createStore({ count: 0 }).addReducers((state, _) => ({ count: state.count + 1 }))
store.select(state => state.count).subscribe(count => console.log(`New count is: ${count}`))
store.dispatch({ type: 'ANY_ACTION' })
```

Added in v8.0.0

# StoreApi (type alias)

The store API.

**Signature**

```ts
export type StoreApi<S> = {
  getState: () => S
  setState: (s: S) => void
  addReducers: (...reducers: Reducer<S>[]) => StoreApi<S>
  removeReducers: (...reducers: Reducer<S>[]) => StoreApi<S>
  addMetaReducers: (...metaReducers: MetaReducer<S>[]) => StoreApi<S>
  removeMetaReducers: (...metaReducers: MetaReducer<S>[]) => StoreApi<S>
  addRunEverys: (...everys: RunEvery<S>[]) => StoreApi<S>
  removeRunEverys: (...everys: RunEvery<S>[]) => StoreApi<S>
  addRunOnces: (...onces: RunOnce<S>[]) => StoreApi<S>
  removeRunOnces: (...onces: RunOnce<S>[]) => StoreApi<S>
  select: <O>(selector: Selector<S, O>, predicate?: (a: O, b: O) => boolean) => Observable<O>
  dispatch: (...as: TypedAction[]) => void
  destroy: () => void
}
```

Added in v8.0.0

# createStore

While the redux pattern is powerful, it is also painful to instrument. This implementation
of the redux pattern combines redux-observable and a more flexible interface for adding
and removed reducers, metareducers(middleware), and epics.

The ordering of events in a running store is very specific:

1. A new action is received.
2. MetaReducers are run in the order they were added.
3. Reducers are run in the order they were added.
4. Selectors are called in the order they were added.
5. Epics are called in the order they were added.
6. Actions that are emitted by Epics are pushed back into the queue.

**Signature**

```ts
export const createStore = <S>(state: S): StoreApi<S> => ...
```

**Example**

```ts
import { createStore } from '../../src/Store'

type State = {
  count: number
}
const initialState: State = { count: 0 }

export const myStore = createStore(initialState)
```

Added in v8.0.0