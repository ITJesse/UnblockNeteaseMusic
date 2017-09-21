export { recent } from './recent';
export { list } from './list';
export { save } from './save';
export { get } from './get';
export { unpair } from './unpair';

export const check = (ctx) => {
  ctx.body = {
    error: 0,
    result: 'ok',
  };
};
