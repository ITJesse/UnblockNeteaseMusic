import { Pair } from '../../models';

export const unpair = async (ctx) => {
  const { songId } = ctx.params;
  const result = {};
  Pair.destroy({
    where: { songId },
  }).then().catch(err => console.log(err));
  result.error = 0;
  ctx.body = result;
};

export default unpair;

