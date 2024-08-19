/**
 * __        ___    ____  _   _ ___ _   _  ____
 * \ \      / / \  |  _ \| \ | |_ _| \ | |/ ___|
 *  \ \ /\ / / _ \ | |_) |  \| || ||  \| | |  _
 *   \ V  V / ___ \|  _ <| |\  || || |\  | |_| |
 *    \_/\_/_/   \_\_| \_\_| \_|___|_| \_|\____|
 *
 *
 * THIS IS EXPERIMEMTAL TEST FOR ESBUILD
 * THIS SCRIPT DOESN'T WORK YET
 */

const fs = require('fs');
const path = require('path');
const builder = require('esbuild');
const glob = require('glob');

const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');

if(fs.existsSync(distDir)) {
  const fd = fs.openSync(distDir);
  if(fs.fstatSync(fd).isDirectory()){
    fs.rmSync(distDir, {recursive: true, force: true});
  }
}

builder.build({
    platform: 'node',
    entryPoints: glob.sync(srcDir + '/!(__tests__)/*.js'),
    bundle: true,
    outdir: distDir,
    external: ['formidable','sharp','any-promise', 'awilix', 'awilix-koa', 'bristol', 'mongoose'],
    loader: {'.js': 'ts'},
    target: ['esnext', 'node10']
  })
  .then(() => console.log('Build succeed!'))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
