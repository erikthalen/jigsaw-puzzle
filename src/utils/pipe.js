export const pipe = (...fns) => (x) => [...fns].reduce((acc, f) => f(acc), x);
