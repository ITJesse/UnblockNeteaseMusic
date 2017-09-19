import { Pair, Song } from '../../models';

export const list = async (ctx) => {
  const pairs = await Pair.findAll({
    include: [{
      as: 'song',
      model: Song,
    }],
    order: [
      ['updatedAt', 'DESC'],
    ],
  });
  ctx.body = {
    error: 0,
    result: pairs.map(e => e.dataValues),
  };
};

export default list;
