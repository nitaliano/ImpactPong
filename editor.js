/**
 * Created by unbound on 11/23/13.
 */
var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    globFunc = require('glob'),
    Q = require('q'),
    _ = require('lodash');

var unixPath = {
  join: function() {
    return path.join.apply(this, arguments).replace(/\\/g, '/');
  },
  relative: function() {
    return path.relative.apply(this, arguments).replace(/\\/g, '/');
  }
};

var imageTypes = ['.png', '.jpg', '.jpeg', '.gif'];

var saveErrorCodes = {
  OK: 0,
  NO_PATH_OR_DATA: 1,
  COULD_NOT_WRITE_FILE: 2,
  WRONG_SUFFIX: 3
};

// Set when the editor handler is exported.
var fileRoot;

var genericError = function(response, err) {
  response.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  response.end(err + '\n');
};

var globFiles = function(glob) {
  var deferred = Q.defer();
  globFunc(glob, function(err, files) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      deferred.resolve(files);
    }
  });
  return deferred.promise;
};

var findDirs = function(dir) {
  return function(file) {
    var deferred = Q.defer();
    fs.stat(unixPath.join(dir, file), function(err, stats) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve({
          file: file,
          isDirectory: stats.isDirectory()
        });
      }
    });
    return deferred.promise;
  };
};

var typeHandlers = {
  scripts: function(file) {
    return path.extname(file) === '.js';
  },
  images: function(file) {
    return imageTypes.indexOf(path.extname(file)) !== -1;
  }
};

var findFilesOfType = function(type) {
  return function(file) {
    var deferred = Q.defer();
    var isOfType = typeHandlers[type](file);
    deferred.resolve(isOfType ? file : null);
    return deferred.promise;
  }
};

var sendJSON = function(response, result) {
  var data = JSON.stringify(result);
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  });
  response.end(data);
};

var glob = function() {
  if (!this.req.query.glob) {
    genericError(this.res, 'Badly formed glob request');
    return;
  }

  var self = this,
      globs = this.req.query.glob.map(function(glob) { return unixPath.join(fileRoot, glob); });

  Q.all(globs.map(globFiles))
    .then(function(files) {
      files = _.flatten(files);
      files = files.map(function(file) {
        return unixPath.relative(fileRoot, file);
      });
      sendJSON(self.res, files);
    });
};

var browse = function() {
  var self = this,
      req = this.req,
      res = this.res,
      pDir = this.req.query.dir.indexOf(fileRoot) === -1 ? fileRoot + '/' + this.req.query.dir : this.req.query.dir;

  fs.readdir(pDir, function(err, files) {
    var parent = path.dirname(req.query.dir);
    if (!req.query.dir) {
      parent = '';
    }

    var result = {
      parent: parent
    };

    var gotDirs = Q.all(files.map(findDirs(pDir)))
      .then(function (dirs) {
        result.dirs = _.compact(dirs.map(function(dir) {
          if (dir.isDirectory) {
            return unixPath.join(pDir, dir.file);
          }
        }));
      });
    var gotFiles = Q.all(files.map(findFilesOfType(self.req.query.type)))
      .then(function (files) {
        result.files = _.map(_.compact(files), function (file) {
          return unixPath.join(pDir.replace(fileRoot, ''), file);
        });
      });

    Q.all([gotDirs, gotFiles])
      .then(function () {
        console.log(result);
        sendJSON(res, result);
      });
  });
};

var save = function() {
  var result = {
    error: saveErrorCodes.OK
  };

  if (!this.req.body.path || !this.req.body.data) {
    result.error = saveErrorCodes.NO_PATH_OR_DATA;
    result.msg = 'No Data or Path specified';
    sendJSON(this.res, result);
    return;
  }

  if (this.req.body.path.substr(-2) !== 'js') {
    result.error = saveErrorCodes.WRONG_SUFFIX;
    result.msg = 'File must have a .js suffix';
    sendJSON(this.res, result);
    return;
  }

  var self = this,
      fullPath = unixPath.join(fileRoot, this.req.body.path),
      data = this.req.body.data.replace(/ig.module\( \'.game.levels/g, "ig.module( 'game.levels");

  fs.writeFile(fullPath, data, function () {
    sendJSON(self.res, result);
  });
};

var handlers = {
  '/lib/weltmeister/api/glob.php': {
    method: 'GET',
    handler: glob
  },
  '/lib/weltmeister/api/browse.php': {
    method: 'GET',
    handler: browse
  },
  '/lib/weltmeister/api/save.php': {
    method: 'POST',
    handler: save
  }
};

module.exports = function () {
  fileRoot = process.cwd();
  return function(req, res, next) {
    var pathname = url.parse(req.url).pathname,
        found = handlers.hasOwnProperty(pathname) && handlers[pathname].method === req.method;

    if (!found) {
      return next();
    }
    handlers[pathname].handler.bind({ req: req, res: res })();
  };
};