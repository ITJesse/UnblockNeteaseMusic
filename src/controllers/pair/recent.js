import { Recent, Song } from '../../models';

export const recent = async (ctx) => {
  const recents = await Recent.findAll({
    include: [{
      as: 'song',
      model: Song,
    }],
    order: [
      ['updatedAt', 'DESC'],
    ],
    limit: 50,
  });
  ctx.body = recents.map(e => e.dataValues);
};

export default recent;
