/* 
Helper function to get data from cache, if available. Otherwise, invoke callback function
and cache the result in Redis with a default expiration of 1 hour
*/
const getOrSetCache = (redisClient, key, cb, default_exp = 3600) => {
  return new Promise((resolve, reject) => {
    redisClient
      .get(key)
      .then(async (response) => {
        if (response) {
          return resolve(JSON.parse(response));
        } else {
          const fetchedData = await cb();
          redisClient.setEx(key, default_exp, JSON.stringify(fetchedData));
          return resolve(fetchedData);
        }
      })
      .catch((err) => {
        console.error('Error inside getOrSetCache: ', err);
        return reject(err);
      });
  });
};

module.exports = {
  getOrSetCache,
};
