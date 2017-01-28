#!/usr/bin/env node
var program = require('commander');
require('shelljs/global');

var commands = require('./commands.json');

program
    .option('-e, --everything', 'Purge all Docker containers, images and volumes; used or unused')
    .option('-i, --images', 'Purge all docker images with no associated containers')
    .option('-c, --containers', 'Purge all stopped Docker containers')
    .option('-v, --volumes', 'Purge all unused Docker volumes')
    .option('-a, --all', 'Append to other options to delete used images, containers or volumes as well. When deleting images or volumes this will result in all containers being deleted')
    .parse(process.argv);

if(!which('docker')) {
    console.log('In order to use this script, you must have Docker installed. See https://docs.docker.com/engine/installation/.');
    exit(1);
}

if (program.containers || program.c) {
    processInput(commands.containers);
}
if (program.images || program.i) {
    processInput(commands.images);
}
if (program.volumes || program.v) {
    processInput(commands.volumes);
}
if (program.everything || program.e) {
    runCommand(commands.containers, true);
    runCommand(commands.images);
    runCommand(commands.volumes);
    console.log("Everything purged");
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
