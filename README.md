## Installation

Requires node.js 17 or later

## Environment

See .env.example for a required fields.
`NODE_ENV=production` is required to launch the bot in production mode. All other values will default to development mode

## Serve

`npm run serve`

## PM2

Application can be served via pm2 to automatically reload on a fatal error

`pm2 start --name OVL2 npm -- run serve`
