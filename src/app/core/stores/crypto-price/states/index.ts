import { InjectionToken } from '@angular/core';
import { CryptoState } from '../models';

const initialState: CryptoState = {
  crystal: {},
};

export const CRYSTAL_STATE = new InjectionToken<CryptoState>('CrystalState', {
  factory: () => initialState,
});
