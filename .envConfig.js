'use strict';

// https://www.npmjs.com/package/dotenv
// https://github.com/motdotla/dotenv/issues/133#issuecomment-255298822
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { fileURLToPath } from 'url';


// https://nodejs.org/api/esm.html#esm_no_require_exports_module_exports_filename_dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const getPath = (p = '.') => path.resolve(__dirname, p);


const baseEnv = {
  appRoot: getPath(),
  appSrc: getPath('src'),
  appTools: getPath('tools'),
  appDist: getPath('dist'),
};


// override config and env vars and process.env defaults from the cmd line
// e.g. yarn start -- --s=yellow --somepther=thing
// s = set the service(s) to run (all, client, api)
Object.entries(minimist(process.argv.slice(2)))
  .forEach(([k, v]) => k in process.env
    ? (baseEnv[k] = v)
    : (baseEnv[`npm_package_config_${k}`] = v)
  );

// only apply environment variables for the matching env
// sorry 12-factor!
const newEnv = Object.entries(dotenv.parse(fs.readFileSync('./.env')))
  .filter(([k, v]) => k.includes(process.env.NODE_ENV))
  .reduce((env, [k, v]) => ({
      ...env,
      [k.split(`_${process.env.NODE_ENV}_`).join('_')]: v
    }),
    baseEnv
  );

console.log('\n\n env is', newEnv)
// apply all to process env
// webpack define plugin is
// responsible for picking which ones to provide in compiled code
for (const key in newEnv) process.env[key] = newEnv[key];
