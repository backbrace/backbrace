# @backbrace/devkit

> Development tools specialized for backbrace.

## Install

Using npm:

```sh
npm install --save-dev @backbrace/devkit
```

## Build Typings

From the project root:

```sh
grunt typings
```

This will output the typings to `packages/backbrace-devkit/typings/types.d.ts`

## Generate Tern Definition JSON

From the project root:

```sh
./node_modules/rollup/bin/rollup -c rollup.config.js
```

Then run:

```sh
./node_modules/tern/bin/condense packages/backbrace-devkit/tern/temp/backbrace.js --def packages/backbrace-devkit/tern/defs/backbrace-types.json --no-spans
```

This will output the Tern definition JSON.