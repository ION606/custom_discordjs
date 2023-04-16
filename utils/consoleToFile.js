import fs from 'fs';
import util from 'util'
import path from 'path';
import {fileURLToPath} from 'url';

export default function writeInit() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    var log_file = fs.createWriteStream(path.join(__dirname, '../debug.log'), {flags : 'w'});
    var log_stdout = process.stdout;

    console.log = function(d) {
        log_file.write(util.format(d) + '\n');
        log_stdout.write(util.format(d) + '\n');
    };
}