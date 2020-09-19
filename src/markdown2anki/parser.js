import fs from 'fs';
import readline from 'readline';

import { AnkiNote } from '../anki/anki-note';

export function getNotesFromMarkdownFile(filename) {

    function _checkIfQuestionStarts(line) {
        let questionStarts = false;
        process.env.MARKDOWN_QUESTION_SELECTORS.split(",").forEach(selector => {
            if(line.trim() === selector){
                questionStarts = true;
            }
        });
        return questionStarts;
    }

    function _checkIfAnswerStarts(line) {
        let answerStarts = false;
        process.env.MARKDOWN_ANSWER_SELECTORS.split(",").forEach(selector => {
            if(line.trim() === selector){
                answerStarts = true;
            }
        });
        return answerStarts;
    }

    return new Promise((resolve, reject) => {
        try {
            let frontRaw = '';
            let backRaw = '';
            let notes = [];
            let firstQuestion = true;

            const fileStream = fs.createReadStream(filename);

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

