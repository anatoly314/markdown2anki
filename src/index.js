import dotenv from 'dotenv';
dotenv.config();

import { getNotesFromMarkdownFile } from "./markdown2anki/parser";
import {
    checkIfDeckExists,
    checkIfModelNameExists,
    getNoteIdIfExists
} from "./anki/anki-connect-api-helpers";
import { addNote, updateNote } from "./anki/anki-connect-api";

async function main() {

    try {
        const override = process.env.OVERRIDE_NOTE === 'true';
        const ankiNotes = await getNotesFromMarkdownFile(process.env.MARKDOWN_PATH_TO_FILE);

        await checkIfDeckExists(process.env.ANKI_DECK_NAME);
        await checkIfModelNameExists(process.env.ANKI_MODEL_NAME);


        for(const ankiNote of ankiNotes){
            const noteId = await getNoteIdIfExists(process.env.ANKI_DECK_NAME, process.env.ANKI_MODEL_NAME, ankiNote);

            if (!noteId) {
                await addNote(ankiNote, process.env.ANKI_DECK_NAME, process.env.ANKI_MODEL_NAME);
            } else if (noteId && override) {
                await updateNote(noteId, ankiNote);
            } else if (noteId && !override) {
                const firstRawLine = ankiNote.frontRaw.split("\n")[0];
                console.log("Can't be added: ", firstRawLine);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

main();
