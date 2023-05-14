const getBaseUrl = (world: string) => {
  const host = 'https://screeps.com';
  if (world === 'season') {
    return host + '/season';
  }
  return host;
};

export const getShardsUrl = (world: string) => getBaseUrl(world) + '/api/game/shards/info';

export const getRoomTerrainUrl = (world: string, shard: string, room: string) =>
  getBaseUrl(world) + `/api/game/room-terrain?encoded=1&room=${room}&shard=${shard}`;

export const getRoomObjectsUrl = (world: string, shard: string, room: string) =>
  getBaseUrl(world) + `/api/game/room-objects?room=${room}&shard=${shard}`;
