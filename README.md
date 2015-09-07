# grunt-semantic-ui
> A grunt task to help integrate Semantic UI to your project

[![Build Status](https://travis-ci.org/ThanosSiopoudis/grunt-semantic-ui.svg?branch=master)](https://travis-ci.org/ThanosSiopoudis/grunt-semantic-ui) [![devDependency Status](https://david-dm.org/ThanosSiopoudis/grunt-semantic-ui/dev-status.svg)](https://david-dm.org/ThanosSiopoudis/grunt-semantic-ui#info=devDependencies) [![peerDependency Status](https://david-dm.org/ThanosSiopoudis/grunt-semantic-ui/peer-status.svg)](https://david-dm.org/ThanosSiopoudis/grunt-semantic-ui#info=peerDependencies)


## Getting Started
If you haven't used grunt before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a gruntfile as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:
```shell
npm install grunt-semantic-ui --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of Javascript:  
```js
grunt.loadNpmTasks('grunt-semantic-ui');
```

## Usage
The grunt-semantic-ui task works by parsing a json encoded configuration file, where you declare which parts of semantic-ui you want to use. This configuration is read, and the generated css, js and asset files are copied to the provided destination. As a minimum, you must provide a configuration file, and a destination:  
```js
'semantic-ui': {
    all: {
        options: {
            config: 'semantic-config.json',
            dest: 'mycoolapp/public/'
        }
    }
}
```

## The Config JSON file
The semantic config json file, is a simple json representation of the semantic source directory structure of the components you want to use.  
For example, if you need to use Semantic's Global reset and site components, your `semantic-config.json` would look like that:  
```js
{
    "globals": [
        "reset",
        "site"
    ],
}
```

## Themeing
`grunt-semantic-ui` uses Semantic's `default` theme by default. You can use a different theme by adding a theme.config file in your project, and adding a `theme` property in the task's options, that points to the theme file.  
```js
'semantic-ui': {
    all: {
        options: {
            config: 'semantic-config.json',
            dest: 'mycoolapp/public/',
            theme: 'mycoolapp/my-semantic-theme.config'
        }
    }
}
```

## Options

### Required

#### config
Type: `String`

The path to the semantic configuration file, that is used to define what components are going to be compiled. Alternatively, you can provide the configuration object inline.

#### dest
Type `String`

The path to the destination folder where the compiled files will be written. `NOTE` the following three folders will be created, if they don't already exist: `css`, `scripts`, `themes`

### Optional

### theme
Type `String`

The path to a semantic-ui theme configuration file.

## Release History
 * 2015-09-04   v0.1.0  First release
