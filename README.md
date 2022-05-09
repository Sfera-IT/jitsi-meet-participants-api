# Jitsi Meet Participants API

[Nest](https://github.com/nestjs/nest) framework based application to fetch participants in an open Jitsi Meet room.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Running in Docker

```bash
# build
$ docker build -t sferait/jitsi-meet-participants-api .

# run
$ docker run --rm -p 3000:3000 sferait/jitsi-meet-participants-api
```

### Running with Lambda

```bash
# build
$ sam build

# deploy
$ sam deploy --guided

# fetch Lambda function URL and ??????
```

## Request payload

Launch an HTTP request to `POST /jitsi/participants` with the following payload:

```json
{
  "room": "<lowercase room name>",
  "domain": "<server domain>",
  "transports": {
    "bosh": "https://<server domain>/http-bind"
  }
}
```
