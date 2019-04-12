# rate-limiter

> A simple rate-limiter middleware built with Node.js & MongoDB.

This [page](https://react-rate-limiter.herokuapp.com/) demos the functionalities of the rate-limiter middleware.

## Usage

You're allowed to `GET /api/rateLimiter` 1000 times per hour.

If you do not excess the remaining amount, you'll see the message:

> Your IP address: {your_ip_address}
>
> Remains {remaining} connections in {X} mins {Y} secs.

Otherwise (too many requeset),

> Request failed with status code 429

## Methods

| Method | URL              | Operation                  |
| :----- | :--------------- | :------------------------- |
| `GET`  | /api/rateLimiter | Fetch the rateLimiter page |
| `GET`  | /api/visitors    | Fetch all visitors         |

## FrontEnd

Every time you

- land `/`
- refresh `/`
- or `GET /api/rateLimiter`

the React component will invoke following function `fetchRateLimiter()`

```js
fetchRateLimiter = async () => {
  try {
    const res = await axios.get('/api/rateLimiter');
    const ip = res.headers['ip'];
    const remaining = Number(res.headers['x-ratelimit-remaining']);
    const reset = Number(res.headers['x-ratelimit-reset']);

    this.setState({ ip, remaining, reset, err: false, success: true });
  } catch (err) {
    this.setState({ err: err.message, success: false });
  }
};
```

## Development

### Configuration

All configs can be found in `/config`

In `/config/index.js`:

- `ttl` means time to live and
- `max` specifies the limits.

After setting your MongoDB Atlas cluster, type following in your `/config/dev.js`:

```js
module.exports = {
  mongoURI:
    'mongodb+srv://{username}:{password}@{database_name}.mongodb.net/test?retryWrites=true'
};
```

### Run

```bash
npm i && npm i --prefix client  # install dependencies
npm run dev                     # run the development environment
```
