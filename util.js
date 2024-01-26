const getOrSetCache = async (redisClient, key, cb, default_exp = 3600) => {
  try {
    const data = await redisClient.get(key);

    if (data) {
      return JSON.parse(data);
    } else {
      console.log('Cache missed');
      const fetchedData = cb();
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
