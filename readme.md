# setup
  - [nvm](https://medium.com/@faith__ngetich/locking-down-a-project-to-a-specific-node-version-using-nvmrc-and-or-engines-e5fd19144245)


# run
  - `yarn dev` start all defined services in development mode
    - `-- --s=api|client|etc` only start a specific service
  - `yarn prod` build all apps for production
    - `-- s=api|client|etc` only build certain apps (TODO)


# testing
  - [stylelint](https://styled-components.com/docs/tooling#usage)

# helpfuls
  - [css vocab](http://apps.workflower.fi/vocabs/css/en)
  - [tc39 proposals](https://github.com/babel/proposals/)
  - [babel plugin for managing proposals](https://github.com/insin/babel-preset-proposals)
  - [ecmascript modules](https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules)


# docker 
  - build: `docker build -f Dockerfile -t techscreens .`
  
  - run: `docker run --name techscreensdev -v `pwd`:/usr/src/app  -p 80:3000 -p 81:3001 -i -t --rm techscreens:latest` 
  //-v nodemodules:/usr/src/app/node_modules
  - run: `docker run --name techscreensdev -v `pwd`:/usr/src/app -v nodemodules:/usr/src/app/node_modules -p 80:3000 -p 81:3001 -i -t --rm techscreens:latest`
  
  - sh: `docker exec -it techscreens sh`
  - - delete danging images: docker image prune
  - delete all containers docker rm $(docker ps -a -f status=exited -q)


# eventually will need
## yarn
  - upgraded to yarn berry locally
    - have to run `yarn set version berry` in the root package
    - [figure this shit out later](https://yarnpkg.com/features/zero-installs)
    - [use colons in script names](https://yarnpkg.com/getting-started/qa#How-to-share-scripts-between-workspaces)
  - yarn bin #get the path to the yarn executable
  - yarn --cwd <command> #set the working directory for running the command, great for not having to cd then cd--
  - yarn cache list <pattern> #find packages not in cache
  - yarn cache dir # print path of global cache
  - yarn global bin # print path of global install dir, this is where global packages will have their executables installed
  - yarn global dir #print path of the global dir
  -- yarn install --modules-folder <path>
  -- yarn install --production true
  -- yarn install --focus
  -- yarn install --silent
  -- yarn install --non-interactive
  -- yarn pack #creates a tarball of package root without unecessary fiels
    - use this to package app dir before moving it into a multi-stage docker build, helps control the cache
    - creates a 
  -- yarn install --focus # install a workspace packages deps and remove all symlinks
      - very useful for automating bundling of a package for deployment while still having symlinks in dev
      - running `yarn install` without the focus will return to their unfocused state



# npm 
  - had to change to my npm global dir to setup typescript https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
  - tyescript config: https://github.com/microsoft/TypeScript-Babel-Starter/blob/master/tsconfig.json