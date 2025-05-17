import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CRYSTAL_STATE } from './states';
import { ICrystal } from '@app/core/models';

export const CrystalStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(CRYSTAL_STATE)),
  withMethods((store) => {
    return {
      loadOrders(crystal: Partial<ICrystal>) {
        patchState(store, { crystal: crystal });
      },
    };
  })
);
