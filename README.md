# Komatsu Ope Backnd App

App for the Komatsu Ope project: https://sites.google.com/d/1zgwuCiW6mvVOJxWbaNjp_7CPBI9jWtiW/p/1IvCEpuosL_Dgqa1KqRAdNqfRU8DQKUt1/edit?pli=1

## Architecture

- [Project Structure](./docs/project-structure.md)

## Features

Here are some of the features that we have added in the starter kit.

| Feature                  | Info               | Progress |
| ------------------------ | ------------------ | -------- |
| Authentication           | JWT                | Done     |
| Authorization            | RBAC (Role based)  | Done     |
| ORM Integration          | TypeORM            | Done     |
| DB Migrations            | TypeORM            | Done     |
| Logging                  | winston            | Done     |
| Request Validation       | class-validator    | Done     |
| Pagination               | SQL offset & limit | Done     |
| Docker Ready             | Dockerfile         | Done     |
| Auto-generated OpenAPI   | -                  | Done     |
| Auto-generated ChangeLog | -                  | WIP      |

Apart from these features above, our start-kit comes loaded with a bunch of minor awesomeness like prettier integration, commit-linting husky hooks, package import sorting, docker-compose for database dependencies.

## Installation

Note: when using docker, all the `npm` commands can also be performed using `./scripts/npm` (for example `./scripts/npm install`).
This script allows you to run the same commands inside the same environment and versions than the service, without relying on what is installed on the host.

```bash
$ npm install
```

## Running the app

We can run the project with or without docker.

### Local

To run the server without Docker we need this pre-requisite:

- Postgres server running

Commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

```bash
# build image
$ docker build -t my-app .

# run container from image
$ docker run -p 3000:3000 --volume 'pwd':/usr/src/app --network --env-file .env my-app

# run using docker compose
$ docker compose up
```

Learn more about Docker conventions [here](https://github.com/monstar-lab-group/nodejs-backend/blob/master/architecture/docker-ready.md). (WIP - Currently this is an internal org link.)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## How to do authentication checks

See: https://kmt-mlb.atlassian.net/wiki/spaces/SD/pages/4161571/FE+BE

### Add annotation @UseGuards(MsExtraExternalIdGuard)

For endpoints which we want to protect, we add annotation @UseGuards, e.g.,

```javascript
import { MsExtraExternalIdGuard } from './auth/guards/ms-extra-external-id.guard';

@UseGuards(MsExtraExternalIdGuard)
@Get()
getHello(@ReqContext() ctx: RequestContext): string {
  this.logger.log(ctx, 'Hello world from App controller');
  return this.appService.getHello(ctx);
}
```

### How it works

We use azure-ad-jwt-v2 to validate access token.

```javascript
var aad = require('azure-ad-jwt-v2');

var jwtToken = accessToken;
aad.verify(
  jwtToken,
  (options) => {
    // Use variables defined in the environment
    options.Authority = process.env.JWT_AUTHORITY;
    options.Audience = process.env.JWT_AUDIENCE;
    options.issuer = process.env.JWT_ISSUER;
  },
  function (err, decodedToken) {
    if (decodedToken) {
      console.log('JWT is valid');
      // keep decodedToken in request.user for later use
      request.user = decodedToken;
      resolve(true);
    } else {
      console.log('JWT is invalid: ' + err);
      reject(new UnauthorizedException('Invalid access token'));
    }
  },
);
```

## How to do authorization checks

TBD

## External Links

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo.svg" width="150" alt="Nest Logo" /></a>
