import { inject } from '@angular/core';
import { IOrder } from '@app/core/models';
import { OrderService } from '@app/core/services';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { catchError, of, tap } from 'rxjs';
import { ORDER_STATE } from './states';

export const OrderStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(ORDER_STATE)),
  withMethods((store) => {
    const service = inject(OrderService);
    return {
      loadOrders() {
        patchState(store, { loading: true, error: null });
        service
          .getOrders()
          .pipe(
            tap((data) => {
              patchState(store, {
                loading: false,
                orders: data.value,
              });
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.messsage,
              });
              return of([]);
            })
          )
          .subscribe();
      },
      addOrder(order: Partial<IOrder>): void {
        service.addOrder(order).subscribe((resp) => {
          patchState(store, (state) => ({
            ...state,
            orders: [...state.orders, resp.value],
          }));
        });
      },
      updateOrder(order: Partial<IOrder>): void {
        service.updateOrder(order).subscribe((resp) => {
          patchState(store, (state) => {
            return {
              ...state,
              orders: [...state.orders, resp.value],
            };
          });
        });
      },
    };
  })
);
