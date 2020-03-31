# fileprotector
A simple file encryption / decryption utility

## Description
Script written for node.js execution.

Uses node's `crypto` library and using `aes-192-cbc` algorithm.

#### Usage
```
node fileprotector.js --action=encrypt --input=file.txt --output=file.txt.enc --password=12ab3cd456
```
```
arguments:
--action=['encrypt' or 'decrypt']
--input=[input filename]
--output=[output filename]
--password=[password]
```
