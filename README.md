[![Actions Status](https://github.com/Codibre/anypm/workflows/build/badge.svg)](https://github.com/Codibre/anypm/actions)
[![Actions Status](https://github.com/Codibre/anypm/workflows/test/badge.svg)](https://github.com/Codibre/anypm/actions)
[![Actions Status](https://github.com/Codibre/anypm/workflows/lint/badge.svg)](https://github.com/Codibre/anypm/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/65e41e3018643f28168e/test_coverage)](https://codeclimate.com/github/Codibre/anypm/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/65e41e3018643f28168e/maintainability)](https://codeclimate.com/github/Codibre/anypm/maintainability)
[![Packages](https://david-dm.org/Codibre/anypm.svg)](https://david-dm.org/Codibre/anypm)
[![npm version](https://badge.fury.io/js/anypm.svg)](https://badge.fury.io/js/anypm)

This project aims to use a package manager of your preference locally without the need to change the CI configuration of your project to use this same manager.

At first, the compatibility is made between pnpm and npm, where npm will be the cloud package and pnpm used local. This itself already offer much less space and internet consumed for you, my fellow developer! And if your fellow developer doesn't want to use pnpm, that's okay! He can stick with npm and everyone will be happy!

# How to install

```
npm -g anypm pnpm
```

As you see, you need to install pnpm along with it, otherwise anypm will just use npm locally too!

# How to use it

To execute "npm install" equivalent, with no packages:

```
anypm install
anypm i
```

To install one or more packages (if the package have a valid @types, it is installed too)
```
anypm install express moment
anypm i express moment
```

To install dev dependencies
```
anypm install --save-dev jest
anypm i -D jest
```

To uninstall (correspondent @types are uninstalled too):

```
anypm uninstall express
anypm un express
```

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
