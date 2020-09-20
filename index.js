import dotenv from 'dotenv';
dotenv.config();

import { getNotesFromMarkdownFile } from "./src/markdown2anki/parser";
import { splitArrayToChunks } from "./src/helpers/array-helper";
import {addMultipleNotesData, checkIfDeckExists, checkIfModelNameExists} from "./src/anki/anki-connect-api-helpers";

async function main() {
    try {
        const ankiNotes = await getNotesFromMarkdownFile(process.env.MARKDOWN_PATH_TO_FILE);
        const ankiNotesChunked = splitArrayToChunks(ankiNotes, process.env.MAX_NOTES_PER_REQUEST);

        await checkIfDeckExists(process.env.ANKI_DECK_NAME);
        await checkIfModelNameExists(process.env.ANKI_MODEL_NAME);

        for(const ankiNotesChunk of ankiNotesChunked){
            await addMultipleNotesData(ankiNotesChunk, process.env.ANKI_DECK_NAME, process.env.ANKI_MODEL_NAME);
        }
    } catch (e) {
        console.error(e);
    }
}

main();
