'use strict';


import { spawn, fork } from 'child_process';
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
  const opts ={
    ...rest,
    ...defaultOptions,
    cwd,
     };

  switch (name) {
    default: return console.log('\n\n caling fn') || {
      name,
      p: spawn(
        'yarn run',
        [cmd],
        opts
      )
    }
  };
}

// service configuration
const serviceConfigs = {
  api: {
    cwd: process.env.NIRV_APP_SRC + '/api',
    name: 'api',
  },

  client: {
    cwd: process.env.NIRV_APP_SRC + '/client',
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
