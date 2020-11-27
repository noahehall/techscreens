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
