# exact-deps

Update package.json to use exact versions for dependencies

**NOTE:** this does not replace the best practice of adding a `.npmrc` file with `save-exact=true` attribute to a project

<!-- AUTO-GENERATED-CONTENT:START (INSTALL:flags=["-D"]) -->
```sh
yarn add -D exact-deps
```
<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (TOC:collapse=true) -->
<details>
<summary>Table of Contents</summary>

- [Getting started](#getting-started)
  * [Requirements](#requirements)
  * [Command Line](#command-line)
  * [Module](#module)
- [Integrating](#integrating)

</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

For a variety of reasons, I have often wanted to convert all the versions of dependencies in a `package.json` file to the exact versions that have been installed.

`exact-deps` solves this problem by 
* looping through each dependency in the main `package.json` file
* for each dependency:
  * finding the locally installed dependency's `package.json` file
  * updating the entry in the main `package.json` with the version attribute from the dependency's `package.json` file

### Requirements
<!-- AUTO-GENERATED-CONTENT:START (ENGINES) -->
* **node**: >=8
<!-- AUTO-GENERATED-CONTENT:END -->

### Command Line

This module provides a simple CLI:

```sh
./node_modules/.bin/exact-deps
```

If combined with [Yarn](https://yarnpkg.com/), it can be run as:

```sh
yarn exact-deps
```

It can also be used as part of an [npm script](https://docs.npmjs.com/misc/scripts):

```json
{
  "scripts": {
    "deps:exact": "exact-deps"
  },
  "devDependencies": {
    "exact-deps": "latest"
  }
}
```

```sh
yarn deps:exact
```

### Module

The module exports a function that takes the directory of `package.json`.

It returns a new object with **path** and **contents** properties

```js
const fs = require('fs');
const exactDeps = require('exact-deps');

const { path, contents } = exactDeps(process.cwd());
fs.writeFileSync(path, JSON.stringify(contents, null, 2));
```

## Integrating

An effective integration of this plugin could look like this:

```json
{
  "scripts": {
    "deps:exact": "exact-deps",
    "precommit": "lint-staged",
    "prepublish": "deps:exact"
  },
  "lint-staged": {
    "package.json": [
      "exact-deps",
      "git add"
    ]
  },
  "devDependencies": {
    "lint-staged": "latest",
    "exact-deps": "latest"
  },
  "optionalDependencies": {
    "husky": "latest"
  }
}
```

This configuration combines:
* [`lint-staged`](https://github.com/okonet/lint-staged) for automatically running tasks on staged files
* [`husky`](https://github.com/typicode/husky) for githook integrations
* [`exact-deps`](https://github.com/camacho/exact-deps) to make sure `package.json` is always exact

Together, these modules ensure the `package.json` file is automatically updated if it changes and provides an easy [package.json script](https://docs.npmjs.com/misc/scripts) for manual use:

```sh
yarn deps:exact
```
