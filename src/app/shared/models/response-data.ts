export interface IResponse<T> {
  code: string;
  message: string;
  value: T;
}
