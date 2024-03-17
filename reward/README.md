## Steps

1. npm init -y
2. yarn add typescript ts-node-dev express @types/express
3. tsc --init
4. "start" : "ts-node-dev src/index.ts"

## Other Packages

- cookie-session, @types/cookie-session
- joi, @types/joi
- sequelize, @types/sequelize
- dotenv, mongoose, pg, pg-hstore

## Dev Packages

- jest, @types/jest
- supertest, @types/supertest
- cross-env, ts-jest

## Jest Setup in package.json

"scripts":{
"test": "cross-env NODE_ENV=test jest --no-cache --forceExit --detectOpenHandles --coverage --verbose",
"test:watch": "jest --watchAll --no-cache"
},
"jest": {
"preset": "ts-jest",
"testEnvironment": "node",
"setupFilesAfterEnv": [
"./tests/setup.ts"
],
"moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}

## For npm package upload to npm registry, change this in tsconfig.json
- "declaration": true
- "outDir": "./build"

Package.json:
```
"devDependencies": {
    "del-cli": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  },
  "dependencies": {
    "@types/dotenv": "^8.2.0",
    "@types/express": "^4.17.17",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
  }
```
```
"scripts": {
    "clean": "del-cli ./build/*",
    "build": "npm run clean && tsc",
    "pub": "git add . && git commit -m \"Updates\" && npm version patch && npm run build && npm publish"
  }
```