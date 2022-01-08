import { atom, atomFamily, selector } from "recoil";

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

export const profileAtomFamily = atomFamily({
    key: "profile",
    default: null,
});

export const createListingProjectAtom = atom({
    key: "createListingProjectAtom",
    default: {
        project: undefined,
        listing: undefined,
    },
});
