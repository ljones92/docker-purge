#!/usr/bin/env node
var program = require('commander');
require('shelljs/global');

var commands = require('./commands.json');

program
    .version('0.3.0')
    .option('-e, --everything', 'Purge all Docker containers, images and volumes; used or unused')
    .option('-i, --images', 'Purge all docker images with no associated containers')
    .option('-c, --containers', 'Purge all stopped Docker containers')
    .option('-x, --volumes', 'Purge all unused Docker volumes')
    .option('-a, --all', 'Append to other options to delete used images, containers or volumes as well. When deleting images or volumes this will result in all containers being deleted')
    .parse(process.argv);

if(!which('docker')) {
    console.log('In order to use this tool, you must have Docker installed. See https://docs.docker.com/engine/installation/.');
    exit(1);
}

checkVersion();

if (!(program.containers || program.images || program.volumes || program.everything)) {
    console.log('Please enter a valid option. Use --help for more information');
    exit(1);
}

if (program.containers) {
    processInput(commands.containers);
}
if (program.images) {
    processInput(commands.images);
}
if (program.volumes) {
    processInput(commands.volumes);
}
if (program.everything) {
    runCommand(commands.containers, true);
    runCommand(commands.images);
    runCommand(commands.volumes);
    console.log('Everything purged');
}

function processInput(command) {
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
    if (all) {
        exec(type.commandAll, {silent: true});
    }
    else {
        exec(type.command, {silent: true});
    }
}

function checkVersion() {
    var dockerVersion = exec('docker --version', {silent:true}).stdout.split(',')[0];
    var version = dockerVersion.split(' ').slice(-1).pop()
    var versionSplit = version.split('.');
    var versionShort = versionSplit[0] + '.' + versionSplit[1];
    if (parseFloat(versionShort) < 1.13) {
        console.log('You need Docker version 1.13.0 or above to use this tool.');
        exit(1);
    }
}
