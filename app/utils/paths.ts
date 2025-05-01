// utils/paths.ts
export const getBasePath = () =>
    process.env.NODE_ENV === 'production' ? '/pxiaccount/topping-timer/blob/main/public/stickers' : '';
