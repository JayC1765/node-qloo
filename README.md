# QLOO NODE ASSESSMENT

A node backend server with two API endpoints, _fetch-data_ and _process-data_.

- **fetch-data**: This endpoint will send an HTTP request to a third-party API to fetch all the users and return that to the client. The data will be stored in the Redis cache with a **default expiration** of 1 hour. Future request to this endpoint will retrieve the data from the cache if data has not expired.

- **process-data**: This endpoint will send two HTTP request to fetch the most **updated** users and albums data. The data will be process and formatted to include the albums for each user and subsequently, storing each user in the Redis cache. An array of all users with their albums will be returned to the client. Eventually, the application will include other endpoints where the client may access an individual user's information (including album), which can be retrieved from the cache instead.

## Technologies Used

- Node
- Express
- Axios
- Redis

## Prerequisites

Make sure you have a recent version of [Node](https://nodejs.org/en/) v19.8.1 or above and [Redis](https://redis.io/docs/install/install-redis/) installed.

## Getting Started

1. Install dependencies by running `npm install`.
2. With Redis installed (Refer to prerequisites), start an instance of a Redis server by running `redis-server`.
3. Run `npm start` to start the backend express server on a separate terminal.
