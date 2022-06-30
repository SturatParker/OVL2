export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function mock<T>(data: DeepPartial<T>): T {
  return data as T;
}
