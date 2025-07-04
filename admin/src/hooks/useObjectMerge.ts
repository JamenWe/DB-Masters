import { Dispatch, Reducer, useReducer } from 'react';

const mergeObject = <T>(previous: T, update: Partial<T>): T => {
    return { ...previous, ...update };
};

/**
 * A hook to merge partial objects into the previous object using shallow cloning.
 */
const useObjectMerge = <T>(init: T): [T, Dispatch<Partial<T>>] => {
    return useReducer<Reducer<T, Partial<T>>>(mergeObject, init);
};

export default useObjectMerge;
