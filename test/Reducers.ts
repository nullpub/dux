import { DatumEither, failure, initial, pending, success, toRefresh } from '@nll/datum/lib/DatumEither';
import * as assert from 'assert';
import { Lens } from 'monocle-ts';

import * as A from '../src/Actions';
import * as R from '../src/Reducers';

const asyncAction = A.asyncActionCreators<number, number, number>('ASYNC');
const otherAction = A.actionCreator<number>('OTHER');
const anotherAction = A.actionCreator<number>('ANOTHER');
const neverHandledAction = A.actionCreator<any>('NEVER');

const caseFn = R.caseFn(otherAction, (s: number, a) => s + a);
const casesFn = R.casesFn(
  [otherAction, anotherAction],
  (s: number, a) => s + a
);

type State = {
  n: DatumEither<number, number>;
};
const idLens = new Lens((s: State) => s.n, n => s => ({ n }));

type EntityState = {
  ns: Record<string, DatumEither<number, number>>;
};
const entityLens = new Lens((s: EntityState) => s.ns, ns => s => ({ ns }));
const entityIdLens = new Lens(
  (s: number) => s.toString(),
  a => s => parseInt(a, 10)
);

describe('Reducers', () => {
  it('caseFn', () => {
    assert.equal(caseFn(0, otherAction(1)), 1);
  });

  it('casesFn', () => {
    assert.equal(casesFn(0, otherAction(1)), 1);
    assert.equal(casesFn(0, anotherAction(1)), 1);
    assert.equal(casesFn(0, neverHandledAction(1)), 0);
  });

  it('reducerFn', () => {
    const reducer = R.reducerFn(caseFn, casesFn);
    assert.equal(reducer(0, otherAction(1)), 2);
    assert.equal(reducer(0, anotherAction(1)), 1);
  });

  it('reducerDefaultFn', () => {
    const reducer = R.reducerDefaultFn(0, caseFn, casesFn);
    assert.equal(reducer(undefined, otherAction(1)), 2);
    assert.equal(reducer(undefined, anotherAction(1)), 1);
    assert.equal(reducer(0, otherAction(1)), 2);
    assert.equal(reducer(0, anotherAction(1)), 1);
  });

  // asyncReducerFactory
  it('asyncReducerFactory', () => {
    const asyncReducer = R.asyncReducerFactory(asyncAction, idLens);
    const reducer = R.reducerDefaultFn<State>({ n: initial }, asyncReducer);
    assert.deepStrictEqual(reducer(undefined, otherAction(1)), { n: initial });

    assert.deepStrictEqual(reducer(undefined, asyncAction.pending(1)), {
      n: pending,
    });
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.success({ params: 1, result: 2 })),
      { n: success(2) }
    );
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.failure({ params: 1, error: 2 })),
      { n: failure(2) }
    );

    assert.deepStrictEqual(reducer({ n: pending }, asyncAction.pending(1)), {
      n: pending,
    });
    assert.deepStrictEqual(
      reducer({ n: pending }, asyncAction.success({ params: 1, result: 2 })),
      { n: success(2) }
    );
    assert.deepStrictEqual(
      reducer({ n: pending }, asyncAction.failure({ params: 1, error: 2 })),
      { n: failure(2) }
    );

    assert.deepStrictEqual(reducer({ n: failure(1) }, asyncAction.pending(1)), {
      n: toRefresh(failure(1)),
    });
    assert.deepStrictEqual(
      reducer({ n: failure(1) }, asyncAction.success({ params: 1, result: 2 })),
      { n: success(2) }
    );
    assert.deepStrictEqual(
      reducer({ n: failure(1) }, asyncAction.failure({ params: 1, error: 2 })),
      { n: failure(2) }
    );

    assert.deepStrictEqual(reducer({ n: success(1) }, asyncAction.pending(1)), {
      n: toRefresh(success(1)),
    });
    assert.deepStrictEqual(
      reducer({ n: success(1) }, asyncAction.success({ params: 1, result: 2 })),
      { n: success(2) }
    );
    assert.deepStrictEqual(
      reducer({ n: success(1) }, asyncAction.failure({ params: 1, error: 2 })),
      { n: failure(2) }
    );
  });

  // asyncEntityReducer
  it('asyncEntityReducer', () => {
    const asyncReducer = R.asyncEntityReducer(
      asyncAction,
      entityLens,
      entityIdLens
    );
    const reducer = R.reducerDefaultFn<EntityState>(
      { ns: { '1': initial } },
      asyncReducer
    );

    assert.deepStrictEqual(reducer(undefined, otherAction(1)), {
      ns: {
        '1': initial,
      },
    });

    assert.deepStrictEqual(reducer(undefined, asyncAction.pending(1)), {
      ns: {
        '1': pending,
      },
    });
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.success({ params: 1, result: 2 })),
      {
        ns: {
          '1': success(2),
        },
      }
    );
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.failure({ params: 1, error: 2 })),
      {
        ns: {
          '1': failure(2),
        },
      }
    );
  });

  it('asyncReducersFactory', () => {
    assert.doesNotThrow(() => {
      const reducers = R.asyncReducersFactory(asyncAction);
      reducers.reducer(idLens);
      reducers.entityReducer(entityLens, entityIdLens);
    });
  });
});