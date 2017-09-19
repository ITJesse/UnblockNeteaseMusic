import { Recent, Pair } from '../../models';

export const save = async (ctx) => {
  const req = ctx.request;
  const result = {};
  const { songId, plugin, hash } = req.body;
  if (!/^QQ Music|Kugou$/.test(plugin)) {
    result.error = -1;
    ctx.body = result;
  } else if (!/^\d+$/.test(songId)) {
    result.error = -1;
    ctx.body = result;
  } else if (!/^[0-9,a-z,A-Z]+$/.test(songId)) {
    result.error = -1;
    ctx.body = result;
  } else {
    Pair.upsert({
      songId, plugin, hash,
    }).then().catch(err => console.log(err));
    Recent.destroy({
      where: { songId },
    }).then().catch(err => console.log(err));
    result.error = 0;
    ctx.body = result;
  }
};

export default save;
