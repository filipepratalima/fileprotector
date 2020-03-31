#!/usr/bin/env node

/**
 * Simple file encrypt/decrypt utility
 * 
 * @author Filipe Prata de Lima <filipe@filipelima.com>
 * 
 * @copyright GPL-3.0
 * 
 */

const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-192-cbc';
const args = getArgs();

// --help
if (args.help) {
  console.log(`usage: fileprotector.js --action=encrypt --input=file.txt --output=file.enc --password=123abc\n
  arguments:
  --action=['encrypt' or 'decrypt']
  --input=[input filename]
  --output=[output filename]
  --password=[password]
  `)
  return;
}

// check arguments
const required = ['action', 'input', 'output', 'password'];
const missing = [];
required.forEach(req => {
  if(!args[req]) missing.push(req);
});
if (missing.length) {
  console.log(`Error: missing arguments: ${missing}\nDeclare as: --argument=value`);
  return;
}

const key = crypto.scryptSync(args.password, 'salt', 24);
const iv = Buffer.alloc(16, 0);

// Encrypt
if (args.action === 'encrypt') {
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const input = fs.createReadStream(args.input);
  const output = fs.createWriteStream(args.output);

  input.pipe(cipher).pipe(output);

  output.on('finish', function() {
    console.log(`Finished encrypting ${args.input} into ${args.output}`);
  });
} 

// Decrypt
if (args.action === 'decrypt') {
  const cipher = crypto.createDecipheriv(algorithm, key, iv);

  const input = fs.createReadStream(args.input);
  const output = fs.createWriteStream(args.output);

  input.pipe(cipher).pipe(output);

  output.on('finish', function() {
    console.log(`Finished decrypting ${args.input} into ${args.output}`);
  });
}

// Process arguments
function getArgs() {
  const args = {};
  process.argv.slice(2, process.argv.length)
    .forEach(arg => {
      if (arg.slice(0,2) === '--') {
        const longArg = arg.split('=');
        const longArgFlag = longArg[0].slice(2,longArg[0].length);
        const longArgValue = longArg.length > 1 ? longArg[1] : true;
        args[longArgFlag] = longArgValue;
      }
    });
    return args;
}