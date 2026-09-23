import { useCallback, useRef } from "react";

const useFocus = (): [React.RefObject<HTMLInputElement>, () => void] => {
    const inputFocus = useRef<HTMLInputElement>(null);
    const setFocus = useCallback(() => { inputFocus.current?.focus() }, []);
    return [inputFocus, setFocus]
};

export default useFocus;
