'use strict';

// import './.envConfig.js';
import { spawn } from 'child_process';
import readline from 'readline';


const defaultOptions = {
  shell: true,
  env: process.env
};

// each service should run the basic set of npm scripts
const getDefaultCmd = () => {
  switch (process.env.NODE_ENV) {
    case 'production': return 'prod';
    case 'test': return 'test';
    default: return 'dev';
  }
}
const defaultCmd = getDefaultCmd();

const createInitConfig = ({ name, cwd, cmd = defaultCmd, ...rest }) => {
  switch (name) {
    default: return {
      ...rest,
      name,
      p: spawn(
        'yarn',
        [cmd],
        Object.assign(
          {},
          defaultOptions,
          { cwd },
        )
      )
    }
  };
}

// service configuration
const serviceConfigs = {
  api: {
    cwd: process.env.appSrc + '/api',
    name: 'api',
  },

  client: {
    cwd: process.env.appSrc + '/client',
    name: 'client',
  },
}

// run a single service, or all
const s = serviceConfigs[process.env.npm_package_config_s];
const services =  s ? [s] : Object.values(serviceConfigs);

// run
services.map(service => createInitConfig(service)).forEach(child => {
    readline.createInterface({
        input: child.p.stdout
    }).on('line', (...a) => console.log(`${child.name}: ${a}`));

    readline.createInterface({
        input: child.p.stderr,
    }).on('line', (...a) => console.error(`${child.name}: ${a}`));
});
