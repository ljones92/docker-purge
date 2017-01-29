#!/usr/bin/env node
var program = require('commander');
require('shelljs/global');

var commands = require('./commands.json');

program
    .version('0.4.0')
    .option('-e, --everything', 'Purge all Docker containers, images and volumes; used or unused')
    .option('-i, --images', 'Purge all docker images with no associated containers')
    .option('-c, --containers', 'Purge all stopped Docker containers')
    .option('-x, --volumes', 'Purge all unused Docker volumes')
    .option('-p, --prune', 'Use Docker\'s in-built system prune to remove all stopped containers, all volumes not used by at least one container, all networks not used by at least one container and all images without at least one container associated to them')
    .option('-a, --all', 'Append to other options to delete used images, containers or volumes as well. When deleting images or volumes this will result in all containers being deleted')
    .option('-s, --silent', 'Hide docker output from console')
    .parse(process.argv);

checkDockerVersion();
checkValidInput();
handleOptions();

function handleOptions() {
    if (program.containers) {
        handleAllFlag(commands.containers);
    }
    if (program.images) {
        handleAllFlag(commands.images);
    }
    if (program.volumes) {
        handleAllFlag(commands.volumes);
    }
    if (program.prune) {
        runCommand(commands.prune);
        console.log(commands.prune.success);
    }
    if (program.everything) {
        runCommand(commands.containers, true);
        runCommand(commands.images);
        runCommand(commands.volumes);
        console.log('Everything purged');
    }
}

function handleAllFlag(command) {
    if (program.a || program.all) {
        runCommand(commands.containers, true);
        if (command !== commands.containers) {
            runCommand(command);
        }
        console.log(command.successAll);
    }
    else {
        runCommand(command);
        console.log(command.success);
    }
}

function runCommand(type, all = false) {
    var silent = program.silent;
    if (all) {
        exec(type.commandAll, {silent: silent});
    }
    else {
        exec(type.command, {silent: silent});
    }
}

function checkDockerVersion() {
    if(!which('docker')) {
        console.log('In order to use this tool, you must have Docker installed. See https://docs.docker.com/engine/installation/.');
        exit(1);
    }
    var dockerVersion = exec('docker --version', {silent:true}).stdout.split(',')[0];
    var version = dockerVersion.split(' ').slice(-1).pop()
    var versionSplit = version.split('.');
    var versionShort = versionSplit[0] + '.' + versionSplit[1];
    if (parseFloat(versionShort) < 1.13) {
        console.log('You need Docker version 1.13.0 or above to use this tool.');
        exit(1);
    }
}

function checkValidInput() {
    if (!(program.containers || program.images || program.volumes || program.prune || program.everything)) {
        console.log('Please enter a valid option. Use --help for more information');
        exit(1);
    }
}
