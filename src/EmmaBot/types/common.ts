// Common reusable types used throughout the application
export type ReactNode = React.ReactNode;

export type StringOrNumber = string | number;
export type TypeOrNull<T> = T | null;
export type NullOrUndefined = null | undefined;
export type UnknownOrAny = unknown;
export type ArrayGeneric<T> = Array<T>;
export type ObjectGeneric<
  K extends string = string,
  V = StringOrNumber | UnknownOrAny | NullOrUndefined,
> = Record<K, V | ArrayGeneric<V> | Record<K, V>>;

// API response types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
};

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullableFields<T, K extends keyof T> = T & {
  [P in K]: NonNullable<T[P]>;
};

// Theme and styling types
export type Theme = 'light' | 'dark' | 'system';

// Localization types
export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'zh';

export type LocalizedString = {
  [key in Locale]: string;
};

export type LocalizedContent<T> = {
  [key in Locale]: T;
};
