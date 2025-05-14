import { inject } from '@angular/core';
import { ICloseOrderRequest, IOrder } from '@app/core/models';
import { OrderService } from '@app/core/services';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { catchError, debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
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
        service
          .addOrder(order)
          .pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap((response) => {
              patchState(store, (state) => ({
                loading: false,
                orders: state.orders.length
                  ? [...state.orders, response.value]
                  : [response.value],
              }));
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return of(null);
            })
          )
          .subscribe();
      },
      updateOrder(order: Partial<IOrder>): void {
        service
          .updateOrder(order)
          .pipe(
            tap((response) => {
              patchState(store, (state) => ({
                loading: false,
                orders: state.orders.map((item) =>
                  item.orderId === order.orderId ? response.value : item
                ),
              }));
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return of(null);
            })
          )
          .subscribe();
      },
      closeOrder(closeOd: ICloseOrderRequest) {
        service
          .closeOrder(closeOd)
          .pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap((response) => {
              patchState(store, (state) => ({
                loading: false,
                orders: state.orders.map((item) =>
                  item.orderId === closeOd.orderId ? response.value : item
                ),
              }));
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return of(null);
            })
          )
          .subscribe();
      },
    };
  })
);
