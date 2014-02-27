forget-me-not
=============

> npm/bower pre-release dependency check

Do you like `npm link` and `bower link` for development but keep forgetting to update your libraries when you make a release?

forget-me-not is a Grunt task that will prevent you from making a release when you've still got development libraries symlinked into your project.

By default forget-me-not will scan your npm (node_modules) and Bower (bower_components) directories for development dependencies. If it finds any symlinks then forget-me-not will fail the task and list out the offending items.

You can add extra directories to scan with the `dirs` config option.

If you've customised your Bower components directory with a `.bowerrc` file then forget-me-not will automatically scan your custom directory - no extra configuration needed :)


## Installation

```bash
$ npm install git+ssh://git@github.com:widgetworks/forget-me-not.git --save-dev
```

NOTE: We haven't released to npm yet, once we have then you can use the command below:

~~$ npm install forget-me-not --save-dev~~


## Options

These are the default options - all properties are optional.

```javascript
  options: {
    npm: true,    // Scan the npm node_modules directory.
    bower: true,  // Scan the Bower components directory.
    dirs: ['path_to_scan'], // [optional] Extra paths to scan.
    warnOnly: false   // When true just show a warning instead of failing the task (can use --force to continue).
  }
```


## Usage

__Grunt:__

```javascript
// gruntfile
{
  ...
  'forget-me-not': {
    release: {},  // Simplest target, just use defaults.
    snapshot: {
      // Override default options if needed:
      options: {
        npm: false,
        bower: false,
        dirs: ['path_to_scan'],
        warnOnly: true
      }
    }
  }
  ...
  
  grunt.loadNpmTasks('forget-me-not');
  
  // make an alias that's easier to type...
  grunt.registerTask('fmn', ['forget-me-not']);
}
```

```bash
$ grunt fmn:release
$ grunt fmn:release --warn
Running "forget-me-not:release" (forget-me-not) task
>> Scanned "node_modules": 33 children (2 symlinked)
>> Invalid dirs: [
>>      my-dev-library,
>>      wiwo-grunt-lib
>> ]
>> Scanned "bower_components": 20 children (1 symlinked)
>> Invalid dirs: [
>>      wiwo-lib
>> ]
Fatal error: Found linked dependencies or error.

$ grunt fmn:release
Running "forget-me-not:release" (forget-me-not) task
>> No development links found.
```

