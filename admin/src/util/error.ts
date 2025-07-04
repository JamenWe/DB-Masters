// an optional error message
export type ErrorTextType = string | undefined;

// an object containing optional error texts for every key of another type
export type ErrorType<T> = {
    [P in keyof T]?: ErrorTextType;
};
