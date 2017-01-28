# docker-purge
A simple command line tool for removing Docker containers, images and volumes

## Installation
- To install the command line tool: `npm install -g docker-purge`

## To get the code
- Clone the repository: `git clone https://github.com/ljones92/docker-purge.git`
- Navigate into the directory: `cd docker-purge`
- Install dependencies: `npm install`

## Usage
- The script can be called by using the `docker-purge` command in the terminal.
- Options:
  - `-e, --everything`: Delete all Docker containers, images and volumes
  - `-c, --containers`: Delete all stopped Docker containers
  - `-i, --images`: Delete all Docker images with no associated containers
  - `-v, --volumes`: Delete all Docker volumes with no associated containers
  - `-a, --all`: Append to other options to delete images, containers or volumes that are in use as well. When deleting images or volumes with this method, it will also result in all containers being deleted.
