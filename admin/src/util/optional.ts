export type Optional<T> = T | undefined;

// type guard for optional value
export const isPresent = <T>(value: Optional<T>): value is T => {
    return value !== undefined;
};
