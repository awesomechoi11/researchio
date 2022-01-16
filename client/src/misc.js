import { customAlphabet } from "nanoid";

const randomId = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    16
);

export { randomId };
