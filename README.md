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
  - `-x, --volumes`: Delete all Docker volumes with no associated containers
  - `-p, --prune`: Use Docker's in-built system prune to remove all stopped containers, all volumes not used by at least one container, all networks not used by at least one container and all images without at least one container associated to them.
  - `-a, --all`: Append to other options to delete images, containers or volumes that are in use as well. When deleting images or volumes with this method, it will also result in all containers being deleted. This may result in a docker error message if there are no images, containers or volumes to delete.
  - `-s, --silent`: Hide docker output from console.

## Examples
- `docker-purge -c`: This will delete all stopped containers.
- `docker-purge -i`: This will delete all images with no associated containers.
- `docker-purge -ia`: This will delete all images, including all images with associated containers. As a consequence, this will also delete all containers.
- `docker-purge -iva`: This will delete all containers, images and volumes. This is equivalent to `docker-purge -e`.
