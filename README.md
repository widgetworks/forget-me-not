forget-me-not
=============

> npm/grunt project pre-flight dependency check

Avoid accidentally releasing your project with development libraries symlinked in (e.g. through `npm link` and `bower link`).

forget-me-not will scan the specified paths for development dependencies and return a list of symlinked directories.
By default it assumes you are using npm and Bower and it will automatically add their paths to the list to be scanned.


## Installation

```bash
$ npm install git@github.com:widgetworks/forget-me-not.git --save-dev
```

NOTE: We haven't released to npm yet, once we have then you can use the command below:

~~$ npm install forget-me-not --save-dev~~


## Usage

__Node:__

```javascript
var fmn = require('forget-me-not');

var result = fmn(['path_to_scan'], {
  npm: true,
  bower: true,
  warnOnly: false
});
```

The `result` has the following structure:

```javascript
  {
    isValid: boolean;
    messageList: [
      {
        dir: string,       // Parent directory
        isValid: boolean,  // true if the directory is clean
        message: string,   // Result message
        linkedDirs: [string] // List of symlinked directories to be fixed.
      }
    ]
  }
```


__Grunt:__

```javascript
// gruntfile
{
  ...
  'forget-me-not': {
    check: {
      options: {
        npm: true,
        bower: true,
        dirs: ['path_to_scan'],
        warnOnly: false
      }
    }
  }
  ...
  
  grunt.loadNpmTasks('forget-me-not');
  grunt.registerTask('fmn', ['forget-me-not']);
}
```

```bash
$ grunt fmn
$ grunt fmn --warn
```


## TODO

 1. Add tests.
 2. Update to support Node use case.
 3. Release to npm.
 4. Allow directories to be ignored.
 5. Add interactive mode; allow directories to be ignored temporarily.
