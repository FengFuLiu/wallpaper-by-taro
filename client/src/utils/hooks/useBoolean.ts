import { useState } from 'react';

export function useBoolean(
    initialValue: boolean
): [boolean, () => void, () => void] {
    const [value, setValue] = useState(initialValue);

    const setTrue = () => setValue(true);
    const setFalse = () => setValue(false);

    return [value, setTrue, setFalse];
}
