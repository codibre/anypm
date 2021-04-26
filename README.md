[![Actions Status](https://github.com/Codibre/anypm/workflows/build/badge.svg)](https://github.com/Codibre/anypm/actions)
[![Actions Status](https://github.com/Codibre/anypm/workflows/test/badge.svg)](https://github.com/Codibre/anypm/actions)
[![Actions Status](https://github.com/Codibre/anypm/workflows/lint/badge.svg)](https://github.com/Codibre/anypm/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9cc84f52db78a270d30c/test_coverage)](https://codeclimate.com/github/Codibre/anypm/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/9cc84f52db78a270d30c/maintainability)](https://codeclimate.com/github/Codibre/anypm/maintainability)
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

To install modules resolving from package-lock (npm ci equivalent):

```
anypm ci
```

## Replace npm

This is a experimental feature, but, in linux systems, you can replace the npm command by anypm in any call and it'll work seamlessly.
First, you need to have nvm installed, then, set the default node version for nvm to your preferred version:


```
nvm alias default 10
```

Finally, add it to your initializing script (.zshrc, .bashrc etc...):

```
anypm nvmrc
```

This command will add a hook to the cd command and, at every folder change, it'll change the node version if there is any .nvmrc in the current folder, or to default version, if there is none. At each change, it'll also replace the npm command to anypm. Any command anypm does not support will be passed to npm.

## Oh my god, pnpm is giving me an error in my project for some package

Some packages with errors in the **package.json** does not work well with pnpm. Also, **pnpm** no longer supports **node 10** since version 6. If you used **anypm nvmrc** as described above and you have some project with node 10:

* Do not install pnpm in your node 10, just in node 12 or above;
* Install the version 5 in your node 10;

If you have some project using a node version greater than 10 and you're getting erros during the installation:

* Be like Sherlock Holmes and try to figure out which package is giving your an error (by installing one by one in another folder, for example);
* Create a file called **anypmrc.json** in the root folder with the following content:
```
{
  "command": "npm"
}
```
This way, just in this project, you'll use npm, not pnpm, as your package manager under anypm

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
