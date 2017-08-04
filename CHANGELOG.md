# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.5.0] - 2017-08-04
### Changed
- All running containers are now stopped when remove all containers command is ran
- Converted to ES6
- Console output is now coloured
- Now checks if there are containers or images before running commands

## [0.4.0] - 2017-01-29
### Changed
- Docker output now displayed by default, silent option added to hide this information
- Added prune option

## [0.3.0] - 2017-01-28
### Changed
- Added check for Docker version

## [0.2.0] - 2017-01-28
### Changed
- Added check for when no valid option is entered

## [0.1.0] - 2017-01-28
### Added
- Script for deleting Docker containers, images and volumes
