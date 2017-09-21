import { Recent, Song } from '../../models';

export const handleDeadMusic = (songId, songInfo) => {
  const { songName, artist, album, albumPic } = songInfo;
  Song.findOrCreate({
    where: { songId },
    defaults: {
      songId,
      artist,
      album,
      albumPic,
      name: songName,
    },
  }).then().catch(err => console.log(err));
  Recent.upsert({
    songId,
  }).then().catch(err => console.log(err));
};

export default handleDeadMusic;
