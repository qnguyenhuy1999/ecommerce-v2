export type Nullable<T> = T | null;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type ValueOf<T> = T[keyof T];

export type PickRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
