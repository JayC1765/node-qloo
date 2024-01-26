/* 
Helper function to get data from cache, if available. Otherwise, invoke callback function
and cache the result in Redis with a default expiration of 1 hour
*/
const getOrSetCache = async (redisClient, key, cb, default_exp = 3600) => {
  try {
    const data = await redisClient.get(key);

    if (data) {
      return JSON.parse(data);
    } else {
      const fetchedData = await cb();
      await redisClient.setEx(key, default_exp, JSON.stringify(fetchedData));
      return fetchedData;
    }
  } catch (err) {
    console.error('Error inside getOrSetCache: ', err);
    throw err;
  }
};

module.exports = {
  getOrSetCache,
};
