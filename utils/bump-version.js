const { writeFile } = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const packageJson = require('../package');
const versionType = process.argv[2] || 'patch';

const versionTypes = {
  major: ({ major }) => ({ major: major + 1, minor: 0, patch: 0, fix: 0 }),
  minor: ({ major, minor }) => ({ major, minor: minor + 1, patch: 0, fix: 0 }),
  patch: ({ major, minor, patch }) => ({ major, minor, patch: patch + 1, fix: 0 }),
  fix: ({ major, minor, patch, fix }) => ({ major, minor, patch, fix: fix + 1 }),
};

if (!versionTypes[versionType]) {
  console.error(`Version type "${versionType}" is not correct.`);
  console.error(`Possible values: ${Object.keys(versionTypes).join(', ')}.`);
  console.log('');

  process.exit(1);
}

const parseVersion = async (version) => {
  const re = /^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?$/;
  const matches = version.match(re);

  let major = parseInt(matches[1], 10);
  let minor = parseInt(matches[2], 10);
  let patch = parseInt(matches[3], 10);
  let fix = parseInt(matches[4], 10) || 0;

  return {
    major,
    minor,
    patch,
    fix,
  };
};

const stringifyVersion = async ({ major, minor, patch, fix }) => {
  return `${major}.${minor}.${patch}${fix ? `-${fix}` : ''}`;
};

const bumpVersion = async (version, type) => {
  const { major, minor, patch, fix } = versionTypes[type](version);

  return {
    major,
    minor,
    patch,
    fix,
  };
};

const writeVersion = async (type) => {
  const version = await parseVersion(packageJson.version);
  const newVersion = await bumpVersion(version, type);

  packageJson.version = await stringifyVersion(newVersion);

  const file = path.resolve('./package.json');
  const content = JSON.stringify(packageJson, null, 2) + '\n';

  await new Promise((resolve, reject) => {
    writeFile(file, content, 'utf8', function (err) {
      if (err) {
        console.log(err);

        reject();
      } else {
        resolve();
      }
    });
  });

  return packageJson.version;
};

writeVersion(versionType)
  .then((version) => exec(`git commit -m "Bump version to ${version}" package.json yarn.lock`))
  .then(() => exec('git log -1 --oneline'))
  .then(({ stdout }) => {
    console.log(stdout.trim());
  })
  .catch((error) => {
    console.error(error);
  });
