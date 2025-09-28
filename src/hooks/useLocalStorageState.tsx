import { Dispatch, SetStateAction, useEffect, useState } from "react";

/**
 * On mount initializes the state with the data in local storage, if available (otherwise with the `defaultState`).
 * On each change of `state` value, updates local storage.
 */
export function useLocalStorageState<T extends Object>(
    id: string,
    defaultState: T
): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(localStorage.getItem(id)
        ? { ...defaultState, ...(JSON.parse(localStorage.getItem(id)!) as T)}
        : defaultState);

    useEffect(() => {
        localStorage.setItem(id, JSON.stringify(state));
    }, [state]);

    return [state, setState];
}
