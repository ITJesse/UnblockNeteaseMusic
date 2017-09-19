import { Pair, Song } from '../../models';

export const get = async (ctx) => {
  const { songId } = ctx.params;
  if (!/^\d+$/.test(songId)) {
    ctx.body = {
      error: -1,
    };
  } else {
    const pair = await Pair.findOne({
      include: [{
        as: 'song',
        model: Song,
      }],
      order: [
        ['updatedAt', 'DESC'],
      ],
    });
    if (pair) {
      ctx.body = {
        error: 0,
        result: pair,
      };
    } else {
      ctx.body = {
        error: -2,
      };
    }
  }
};

export default get;
