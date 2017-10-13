#!/usr/bin/env node

const fs = require('fs');
const findup = require('find-up');
const semver = require('semver');

const types = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

function exactDeps(cwd = process.cwd()) {
  const pkgPath = findup.sync('package.json', { cwd });
  if (!pkgPath) throw new Error('No package.json file found');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const nextPkg = Object.keys(pkg)
    .map(k => [k, pkg[k]])
    .filter(
      ([type, deps]) => types.includes(type) && deps && Object.keys(deps).length
    )
    .map(([type, deps = {}]) => {
      const nextDeps = Object.entries(deps)
        .map(([dep, prevVersion]) => {
          let nextVersion;
          if (semver.validRange(prevVersion)) {
            try {
              const dir = require.resolve(dep);
              const depPkgPath = findup.sync('package.json', { cwd: dir });
              const pkgContent = fs.readFileSync(depPkgPath, 'utf8');
              nextVersion = JSON.parse(pkgContent).version;
            } catch (err) {
              nextVersion = prevVersion;
            }
          } else {
            nextVersion = prevVersion;
          }

          return { [dep]: nextVersion };
        })
        .reduce((prevDeps, entry) => Object.assign(prevDeps, entry), {});

      return [type, nextDeps];
    })
    .reduce(
      (prevPkg, [key, value]) => Object.assign(prevPkg, { [key]: value }),
      pkg
    );

  return { path: pkgPath, package: nextPkg };
}

module.exports = exactDeps;

if (require.main === module) {
  const { path, package: pkg } = exactDeps();
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
  console.log(`✨  Dependency versions updated`);
}
