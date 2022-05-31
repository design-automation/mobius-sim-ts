# Install 

- `npm install --save-dev jest`
- `npm install --save-dev ts-jest`
- `npm install --save-dev @types/jest`

# Config

In `jest.config.json`:

```
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true
};
```

In `tsconfig.json`:

```
  "exclude": [
    "**/*.test.ts"
  ],
```

In `package.json`:
```
    "scripts": {
        "test": "jest"
    },
```