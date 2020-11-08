# React Issue #20177

## Usage

* `time npx node reference.js`: bundle the application with only the production sources of React and React DOM (see `reference.js` for how it's done)
* `time npx browserify src/index.js > bundle.js`: bundle the application with Browserify
* `time npx browserify src/index.js  -t [envify purge --NODE_ENV production --global] > bundle.js`: bundle the application with Browserify + envify
* `time npx browserify src/index.js  -t [envify purge --NODE_ENV production --global] -t [uglifyify --global] > bundle.js`: bundle the application with Browserify + envify + ulgifyify

## Expected result

All above scripts should execute in the same order of magnitude as the `reference` script. On the computer I'm using to write this document, it means:

```bash
real    0m0,853s
user    0m1,043s
sys     0m0,069s
```

## Actual result

Scripts execution time are longer than the `reference` script:

* Browserify:

```bash
real    0m2,439s
user    0m2,936s
sys     0m0,243s
```

* Browserify + envify:

```bash
real    0m2,876s
user    0m3,586s
sys     0m0,349s
```

* Browserify + envify + ulgifyify:

```bash
real    0m5,429s
user    0m8,099s
sys     0m0,331s
```

## Consolidated results

| script  | difference to reference (user) |
|---|---|
| Browserify | 197% slower  |
| Browserify + envify | 244% slower  |
| Browserify + envify + ulgifyify | 676% slower  |

## Why it is happening

It is happening because both `node_modules/react/index.js` and `node_modules/react-dom/index.js` exports their respective development and production modules.

## Why it is an issue

This is an issue because it hinders the performance of the bundle process:

* If nothing is done at the bundler level to remove dead code paths, then both the development and production sources of React and React DOM are bundled. React DOM development source being around 900KB, bundling it comes with a huge cost of I/O and parsing.
* If plugins are used to remove dead code paths (like envify + uglifyify), then a parsing is done by the plugins to detect dead code paths which will hinder performances event more. Notice for example that the bundling time of the Browserify + Envify script is longer than the one with only Browserify. Which means that trying to solve the issue by removing dead code paths actually leads to an even longer bundling duration. This is expected since not only do envify doesn't prevent the unwanted sources from being included in the bundle, but it adds a parsing step to the mix.

In any case, bundling performances will be lower than having only the proper React and React DOM sources exported.