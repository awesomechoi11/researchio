import { useSearchParams } from "react-router-dom";
import * as JSURL from "jsurl";
import { useCallback, useMemo } from "react";

export default function useQueryParam(key) {
    let [searchParams, setSearchParams] = useSearchParams();
    let paramValue = searchParams.get(key);

    let value = useMemo(() => JSURL.parse(paramValue), [paramValue]);

    let setValue = useCallback(
        (newValue, options) => {
            let newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set(key, JSURL.stringify(newValue));
            setSearchParams(newSearchParams, options);
        },
        [key, searchParams, setSearchParams]
    );

    return [value, setValue];
}
