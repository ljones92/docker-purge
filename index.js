#!/usr/bin/env node
const program = require('commander');
const colors = require('colors');
require('shelljs/global');

const commands = require('./commands.json');

const containerCount = grepInfo('Containers');
const imageCount = grepInfo('Images');
const runningCount = grepInfo('Running');

program
    .version('0.5.0')
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

function checkDockerVersion() {
    if(!which('docker')) {
        console.error('In order to use this tool, you must have Docker installed. See https://docs.docker.com/engine/installation/.'.red.bold);
        exit(1);
    }
    const dockerVersion = exec('docker --version', {silent:true}).stdout.split(',')[0];
    const version = dockerVersion.split(' ').slice(-1).pop()
    const versionSplit = version.split('.');
    const versionShort = versionSplit[0] + '.' + versionSplit[1];
    if (parseFloat(versionShort) < 1.13) {
        console.error('You need Docker version 1.13.0 or above to use this tool.'.red.bold);
        exit(1);
    }
}

function checkValidInput() {
    if (!(program.containers || program.images || program.volumes || program.prune || program.everything)) {
        console.info('Please enter a valid option. Use --help for more information'.bold);
        exit(1);
    }
}

function handleOptions() {
    if (program.containers) {
        if (containerCount === 0) {
            console.error(commands.containers.noneFoundMsg.bold);
            exit(1);
        } else if (containerCount === runningCount && !(program.all || program.a)) {
            console.error('All containers are running, append --all to force them to stop'.bold);
            exit(1);
        }
        handleAllFlag(commands.containers);
    }
    if (program.images) {    
        if (imageCount === 0) {
            console.error(commands.images.noneFoundMsg.bold);
            exit(1);
        } else if (containerCount > 0 && containerCount === runningCount && !(program.all || program.a)) {
            console.error('All images are in use, append --all to force all containers to stop first'.bold);
            exit(1);
        }
        handleAllFlag(commands.images);
    }
    if (program.volumes) {
        handleAllFlag(commands.volumes);
    }
    if (program.prune) {
        runCommand(commands.prune);
        console.info(commands.prune.success.green);
    }
    if (program.everything) {
        if (containerCount > 0) {
            runCommand(commands.containers, true);
        }
        if (imageCount > 0) {
            runCommand(commands.images);
        }
        runCommand(commands.volumes);
        console.info('Everything purged'.green);
    }
}

function grepInfo(string) {
    const grepOutput = exec(`docker info | grep ${string}`, {silent:true}).stdout.split(`${string}: `)[1];
    const count = parseInt(grepOutput);
    
    return count;
}

function handleAllFlag(command) {
    if (program.a || program.all) {
        if (containerCount > 0) {
            runCommand(commands.containers, true);
        }
        if (command !== commands.containers) {
            runCommand(command);
        }
        console.info(command.successAll.green);
    }
    else {
        runCommand(command);
        console.info(command.success.green);
    }
}

function runCommand(type, all = false) {
    const silent = program.silent;
    if (all) {
        exec(type.commandAll, {silent});
    }
    else {
        exec(type.command, {silent});
    }
}
