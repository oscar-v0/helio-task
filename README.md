### Setup

1. Clone this repo

```
git clone https://github.com/oscar-v0/helio-task.git
```

2. Install dependencies

```
yarn install
```

3. Run mongodb in docker

```
docker-compose up
```

4. Setup prisma and seed data

```
yarn db:generate
yarn db:reset
```

5. Launch application

```
yarn start
```

6. Testing the application:\
   Import `postman.json` into Postman and send requests.\
   Note: All /project/\* routes are protected via an `Authorization` header and run within user context. The header simply needs to be set to `Bearer <userId>` to simulate authentication.
