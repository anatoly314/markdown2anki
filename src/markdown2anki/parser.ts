import { readFileSync, readdirSync, createReadStream } from 'fs';
import * as readline from 'readline';

import { AnkiNote } from '../anki/classes/anki-note';

export function getMarkdownNotesFromPath(path) {

    function _checkIfQuestionStarts(line): boolean {
        let questionStarts = false;
        process.env.MARKDOWN_QUESTION_SELECTORS.split(",").forEach(selector => {
            if(line.trim() === selector){
                questionStarts = true;
            }
        });
        return questionStarts;
    }

    function _checkIfAnswerStarts(line): boolean {
        let answerStarts = false;
        process.env.MARKDOWN_ANSWER_SELECTORS.split(",").forEach(selector => {
            if(line.trim() === selector){
                answerStarts = true;
            }
        });
        return answerStarts;
    }

    function _getPathToMarkdownFile(path): string {
        const dirEntries = readdirSync(path, {
            withFileTypes: true
        });

        const filenames = dirEntries.reduce((entries, dirEntry) => {
            if (dirEntry.isFile() && dirEntry.name.endsWith(".md")) {
                entries.push(dirEntry.name);
            }
            return entries;
        }, [])

        if (filenames.length === 0) {
            throw new Error(`No markdown file found in ${path}`);
        } else if (filenames.length > 1) {
            throw new Error(`More than 1 markdown file found in ${path}, \n multiple markdown files currently not supported`);
        } else {
            return path.endsWith("/") ? `${path}${filenames[0]}` : `${path}/${filenames[0]}`;
        }
    }

    return new Promise((resolve, reject) => {
        try {
            let frontRaw = '';
            let backRaw = '';
            let notes = [];
            let firstQuestion = true;

            const pathToMarkdownFile = _getPathToMarkdownFile(path);
            const fileStream = createReadStream(pathToMarkdownFile);

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let parsingQuestion = false;
            rl.on('line', (line) => {
                // console.log(line);
                if(_checkIfQuestionStarts(line)){ //add previous card if exists and create a new one
                    if (parsingQuestion) {
                        throw new Error("There's question without answer, fix markdown and try again");
                    }
                    parsingQuestion = true;
                    if(!firstQuestion){
                        notes.push(new AnkiNote(frontRaw, backRaw));
                        frontRaw = '';
                        backRaw = '';
                    }
                    firstQuestion = false;
                }else if(_checkIfAnswerStarts(line)){
                    parsingQuestion = false;
                }else if(!parsingQuestion){
                    backRaw += line;
                    backRaw += "\n";
                }else if(parsingQuestion){
                    frontRaw += line;
                    frontRaw += "\n";
                }
            });



            rl.on('close', () => {
                if (parsingQuestion) {
                    throw new Error("Last question without answer, fix markdown and try again");
                }
                notes.push(new AnkiNote(frontRaw, backRaw));
                return resolve(notes);
            });
        } catch (e) {
            console.error(e);
            return reject(e);
        }
    })
}

