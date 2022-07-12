### Quick start

Prerequisites: Make sure you have Node.js ≥ 16 and Yarn installed (https://nodejs.org),
then use it to install

```
yarn install
```

### Testing

To test run:

```
yarn run test:integration

```

to test without AVA - main-test.ts

```
yarn run ts-node-dev integration-tests/ts-testnet/main-test.ts
```

to test scratches with TS
```
yarn run ts-node-dev integration-tests/scratch_1.ts
```