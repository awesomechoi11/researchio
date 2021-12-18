import { atom, atomFamily, selector, useRecoilState } from "recoil";

/*
        get: {
            open: bool,
            data: any
        },
    */
export const modalAtomFamily = atomFamily({
    key: "modalAtomFamily",
    default: {
        open: false,
        data: 1,
    },
});
