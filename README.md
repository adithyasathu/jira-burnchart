# Jira Burndown chart

A Jira Burndown Chart with Vue.js Chrome Web Extension


![Burndown Summary](https://user-images.githubusercontent.com/22003086/99616043-aa7db180-2a70-11eb-9d6b-76e7461f3825.png)

![Burn Down Chart](https://user-images.githubusercontent.com/22003086/99615931-6a1e3380-2a70-11eb-9eac-31ce681a3fc8.png)
![Settings](https://user-images.githubusercontent.com/22003086/99615933-6ab6ca00-2a70-11eb-8236-f1b4a3d788f3.png)


## Building the extension
Bowered from the [vue-web-extension](https://github.com/Kocal/vue-web-extension/edit/master/README.md) that this project is based on

### `npm run build`

Build the extension into `dist` folder for **production**.

### `npm run build:dev`

Build the extension into `dist` folder for **development**.

### `npm run watch`

Watch for modifications then run `npm run build`.

### `npm run watch:dev`

Watch for modifications then run `npm run build:dev`.

It also enable [Hot Module Reloading](https://webpack.js.org/concepts/hot-module-replacement), thanks to [webpack-chrome-extension-reloader](https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader) plugin.

:warning: Keep in mind that HMR only works for your **background** entry.

### `npm run build-zip`

Build a zip file following this format `<name>-v<version>.zip`, by reading `name` and `version` from `manifest.json` file.
Zip file is located in `dist-zip` folder.
