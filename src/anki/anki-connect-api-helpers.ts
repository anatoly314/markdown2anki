import { getDeckNames, getModelNames, getNotes } from './anki-connect-api';

export const checkIfDeckExists = async function (deckName) {
    const existingDeckNames = await getDeckNames();

    if (!deckName) {
        throw new Error(`You must provide existing DECK name`);
    }

    if (Object.keys(existingDeckNames.result).indexOf(deckName) < 0) {
        throw new Error(`Deck with name ${deckName} doesn't exists in ANKI`);
    }

    return true;
}

export const getNoteIdIfExists = async function(deckName,modelName, ankiNote) {
    const response = await getNotes(deckName, modelName, ankiNote.front);
    if (response.result.length > 1) {
        throw new Error("Possible multiple notes with same front fields, check for duplicates");
    } else {
        return response.result[0];
    }
}

export const checkIfModelNameExists = async function (modelName) {
    const existingModelNames = await getModelNames();

    if (!modelName) {
        throw new Error(`You must provide existing MODEL name`);
    }

    if (existingModelNames.result.indexOf(modelName) < 0) {
        throw new Error(`MODEL with name ${modelName} doesn't exists in ANKI`);
    }

    return true;
}
