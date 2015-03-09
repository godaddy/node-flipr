'use strict';

var _ = require('lodash');
var glob = require('glob');
var fs = require('fs');
var util = require('util');
var path = require('path');
var yaml = require('js-yaml');
var async = require('async');
var endWaterfall = require('./util/end-waterfall');

module.exports = YamlReader;

var YAML_FOUND = true;

//TODO: This file should probably be put in its own folder and split
//up into separate files like the other modules.

function YamlReader(options) {
  var self = this;

  this.options = _.extend({
    folderPath: 'lib/config',
    envLocalFileName: 'local.yaml',
    envFileNameFormat: '%s.yaml',
    envFileNameMap: {
      dev: 'dev',
      development: 'development',
      test: 'test',
      staging: 'staging',
      master: 'prod',
      prod: 'prod',
      prodution: 'production'
    },
    envVariable: 'NODE_ENV'
  }, options);

  this.getConfig = function(cb) {
    if(_.isString(self.options.fileName))
      return void self.getConfigByFileName(cb);
    if(_.isFunction(self.options.fileName))
      return void self.getConfigByFileNameFunc(cb);
    return void self.getConfigByEnv(cb);
  };

  this.getConfigByFileNameFunc = function(cb) {
    async.waterfall([
      self.options.fileName,
      self.getFileAbsolutePath,
      self.readFiles,
      self.parseYamlToJsObject
    ], cb);
  };

  this.getConfigByFileName = function(cb) {
    async.waterfall([
      _.partial(self.getFileAbsolutePath, self.options.fileName),
      self.readFiles,
      self.parseYamlToJsObject
    ], cb);
  };

  this.getConfigByEnv = function(cb) {
    async.waterfall([
      _.partial(self.getFileAbsolutePath, self.options.envLocalFileName),
      self.readFileSafe,
      self.parseYamlToJsObjectAndEndIfFound, //early end possible
      self.getSearchPathForCurrentEnvironment,
      self.findFileAbsolutePaths,
      self.readFiles,
      self.parseYamlToJsObject
    ], endWaterfall(cb));
  };

  this.getSearchPathForCurrentEnvironment = function(cb) {
    var envVariable = (process.env[self.options.envVariable] || '').toLowerCase();
    var environmentFileName = self.options.envFileNameMap[envVariable];
    if(!environmentFileName)
      return void cb(
        new Error(
          util.format('Value in process.env.%s not found in options.envFileNameMap. Current value is %s=%s',
            self.options.envVariable,
            self.options.envVariable,
            process.env[self.options.envVariable])));

    cb(null, util.format(self.options.envFileNameFormat, environmentFileName));
  };

  this.getFileAbsolutePath = function(fileName, cb) {
    var folderPath = self.options.folderPath;
    cb(null, path.resolve(folderPath, fileName));
  };

  this.findFileAbsolutePaths = function(globSearch, cb) {
    var folderPath = self.options.folderPath;
    glob(path.resolve(folderPath, globSearch), cb);
  };

  this.readFiles = function(filePaths, cb) {
    if (!Array.isArray(filePaths)) { filePaths = [filePaths]; }
    async.parallel(filePaths.map(function (filePath) {
      return function readYamlFile(fileCallback) {
        fs.readFile(filePath, {encoding: 'utf-8'}, fileCallback);
      };
    }), cb);
  };

  this.readFileSafe = function(filePath, cb) {
    self.readFiles(filePath, function(err, data){
      if(err)
        return void cb(null, null);
      cb(null, data);
    });
  };

  this.parseYamlToJsObject = function(yamlStrings, cb) {
    if (!Array.isArray(yamlStrings)) { yamlStrings = [yamlStrings]; }
    var merged = {};
    for(var i =0; i < yamlStrings.length; i++) {
      try {
        var parsed = yaml.safeLoad(yamlStrings[i]);
        merged = _.assign(merged, parsed);
      } catch (e) {
        return void cb(e);
      }
    }
    cb(null, merged);
  };

  this.parseYamlToJsObjectAndEndIfFound = function(yamlString, cb) {
    if(!_.isString(yamlString) || yamlString.trim() === '')
      return void cb();
    try {
      cb(YAML_FOUND, yaml.safeLoad(yamlString));
    } catch (e) {
      if(_.isString(e.message))
        e.message += ' -- Failure parsing local file.';
      cb(e);
    }
  };
}