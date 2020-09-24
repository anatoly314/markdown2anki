import { config } from 'dotenv';
config();

import { getParsedMarkdown } from "./markdown2anki/parser";
import {
    checkIfDeckExists,
    checkIfModelNameExists,
    getNoteIdIfExists
} from "./anki/anki-connect-api-helpers";

import { addNote, updateNote } from "./anki/anki-connect-api";

async function main() {

    try {
        const override = process.env.OVERRIDE_NOTE === 'true';
        const parsedMarkdown: any = await getParsedMarkdown(process.env.MARKDOWN_PATH_TO);

        await checkIfDeckExists(parsedMarkdown.deckName);
        await checkIfModelNameExists(parsedMarkdown.modelName);


        for(const ankiNote of parsedMarkdown.notes){
            const noteId = await getNoteIdIfExists(parsedMarkdown.deckName, parsedMarkdown.modelName, ankiNote);

            if (!noteId) {
                await addNote(ankiNote, parsedMarkdown.deckName, parsedMarkdown.modelName);
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
