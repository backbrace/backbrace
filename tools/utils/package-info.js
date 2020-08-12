'use strict';

var fs = require('fs'),
  path = require('path'),
  shell = require('shelljs'),
  semver = require('semver'),
  _ = require('lodash');

var currentPackage, previousVersions;

function getPackage() {
  //Find package.json.
  var packageFolder = path.resolve('.'),
    parent = '';
  while (!fs.existsSync(path.join(packageFolder, 'package.json'))) {
    parent = path.dirname(packageFolder);
    if (parent === packageFolder) {
      break;
    }
    packageFolder = parent;
  }
  return JSON.parse(fs.readFileSync(path.join(packageFolder, 'package.json'), 'UTF-8'));
}

function checkBranchPattern(version, branchPattern) {
  // check that the version starts with the branch pattern minus its asterisk
  // e.g. branchPattern = '1.6.*'; version = '1.6.0-rc.0' => '1.6.' === '1.6.'
  return version.slice(0, branchPattern.length - 1) === branchPattern.replace('*', '');
}

function getTaggedVersion() {
  var gitTagResult = shell.exec('git describe --exact-match', { silent: true }),
    tag = '',
    version = '';
  if (gitTagResult.code === 0) {
    tag = gitTagResult.stdout.trim();
    version = semver.parse(tag);
    if (version && checkBranchPattern(version.version, currentPackage.branchPattern)) {
      version.full = version.version;
      version.branch = 'v' + currentPackage.branchPattern.replace('*', 'x');
      return version;
    }
  }

  return null;
}

function getPreviousVersions() {
  var query = 'git tag',
    tagResults = shell.exec(query, { silent: true });
  if (tagResults.code === 0) {
    return _(tagResults.stdout.match(/[0-9].*[0-9]$/mg))
      .map(function(tag) {
        var version = semver.parse(tag);
        return version;
      })
      .filter()
      .sort(semver.compare)
      .value();
  } else {
    return [];
  }
}

function getBuild() {
  var hash = shell.exec('git rev-parse --short HEAD', { silent: true }).stdout.replace('\n', '');
  return 'sha.' + hash;
}

function getSnapshotVersion() {
  var version = _(previousVersions)
    .filter(function(tag) {
      return semver.satisfies(tag, currentPackage.branchVersion);
    })
    .last();

  if (!version) {
    // a snapshot version before the first tag on the branch
    version = semver(currentPackage.branchPattern.replace('*', '0-beta.1'));
  }

  // We need to clone to ensure that we are not modifying another version
  version = semver(version.raw);

  if (!version.prerelease || !version.prerelease.length) {
    // last release was a non beta release. Increment the patch level to
    // indicate the next release that we will be doing.
    // E.g. last release was 1.3.0, then the snapshot will be
    // 1.3.1-build.1, which is lesser than 1.3.1 according to the semver!

    // If the last release was a beta release we don't update the
    // beta number by purpose, as otherwise the semver comparison
    // does not work any more when the next beta is released.
    // E.g. don't generate 1.3.0-beta.2.build.1
    // as this is bigger than 1.3.0-beta.2 according to semver
    version.patch++;
  }
  version.prerelease = ['local'];
  version.build = getBuild();
  version.codeName = 'snapshot';
  version.isSnapshot = true;
  version.format();
  version.full = version.version + '+' + version.build;
  version.branch = 'master';

  return version;
}

exports.currentPackage = currentPackage = getPackage();
exports.previousVersions = previousVersions = getPreviousVersions();
exports.currentVersion = getTaggedVersion() || getSnapshotVersion();
