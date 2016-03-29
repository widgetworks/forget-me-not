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
$ npm install forget-me-not --save-dev
```


## Options

These are the default options - all properties are optional.

```javascript
  options: {
    npm: true,    // Scan the npm node_modules directory.
    bower: true,  // Scan the Bower components directory.
    dirs: ['path_to_scan'], // [optional] Extra paths to scan.
    onError: 'warn'   // How to handle errors (i.e. linked dependencies): 'warn', 'log'.
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
        onError: 'warn'
      }
    }
  }
  ...
  
  grunt.loadNpmTasks('forget-me-not');
}
```

```bash
$ grunt forget-me-not

# Shorter alias
$ grunt fmn

# Check just the 'release' sub-task
$ grunt forget-me-not:release
$ grunt fmn:release

# Just log out instead of erroring
$ grunt fmn:release --fmn-log


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

