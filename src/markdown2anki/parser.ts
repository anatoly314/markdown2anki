import { readFileSync, readdirSync, createReadStream } from 'fs';
import * as readline from 'readline';

import { AnkiNote } from '../anki/classes/anki-note';

export function getParsedMarkdown(path) {

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

    function _getDeckName(line){
        if (line.startsWith("DECK=")) {
            const deckName = line.split("=")[1];
            return deckName;
        }
    }

    function _getModelName(line){
        if (line.startsWith("MODEL=")) {
            const modelName = line.split("=")[1];
            return modelName;
        }
    }

    return new Promise((resolve, reject) => {
        try {
            let frontRaw = '';
            let backRaw = '';
            let notes = [];
            let firstQuestion = true;   //true while we parsing first question
            let parsingQuestion = false;    //true while we parsing question
            let deckName;
            let modelName;

            const pathToMarkdownFile = _getPathToMarkdownFile(path);
            const fileStream = createReadStream(pathToMarkdownFile);

            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                // console.log(line);
                if (!deckName) {
                    deckName = _getDeckName(line) ? _getDeckName(line) : deckName;
                    return;
                }
                if (!modelName) {
                    modelName = _getModelName(line) ? _getModelName(line) : modelName;
                    return;
                }
                if (!deckName || !modelName) {  //we won't continue till we parsed deck and model name
                    return;
                }
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
                if (frontRaw && backRaw) {
                    notes.push(new AnkiNote(frontRaw, backRaw));
                }
                return resolve({
                    deckName: deckName,
                    modelName: modelName,
                    notes: notes
                });
            });
        } catch (e) {
            console.error(e);
            return reject(e);
        }
    })
}

