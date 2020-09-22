# Webpack Frontend Starterkit

[![Dependabot badge](https://flat.badgen.net/dependabot/wbkd/webpack-starter?icon=dependabot)](https://dependabot.com/)

A lightweight foundation for your next webpack based frontend project.


### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### Features:

* ES6 Support via [babel](https://babeljs.io/) (v7)
* SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
* Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.


### Deploying

THIS IS HACKY (VERY VERY HACKY):
* `yarn build`
* Go to the index.html file, copy the unique `app.[HASH].js` and `chunk.[].js` files, and paste it into to the appropriate spots in widget.js
* run `yarn build` again. Make sure the hashes in the above files didn't change. Only widget.js should change.
* go to `build/js` and change `widget.[HASH].js` to `widget.js`. I.e. remove the hash.
* go to `build/js` and change `widget.[HASH].js.map to `widget.js.map`. I.e. remove the hash.
* go to `build/js/widget.js` and change the sourceMap url from `widget.[HASH].js.map` to `widget.js.map`.
* `yarn deploy`
