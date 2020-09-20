import {canAddNotes, addNotes, getDeckNames, getModelNames} from './anki-connect-api';

export const checkIfNotesCanBeAdded = async function (notesData, deckName, modelName) {
    const frontFiels = notesData.map((noteData, index) => {
        return noteData.front;
    })

    const response = await canAddNotes(deckName, modelName, frontFiels);
    response.result.forEach((canBeAdded, noteIndex) => {
        if(!canBeAdded){
            notesData[noteIndex].canBeAdded = false;
        }
    })

    return notesData;
};

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

export const printWhichCannotBeAdded = function (notesData) {
    notesData.forEach(noteData => {
        if(!noteData.canBeAdded){
            const firstRawLine = noteData.frontRaw.split("\n")[0];
            console.log("Can't be added: ", firstRawLine);
        }
    })
};

export const printNotesWhichWereNotAdded = function(notesData, notesCreationResponse) {
    notesCreationResponse.result.forEach((result, index) => {
        if(!result){
            console.log("Wasn't added", notesData[index]);
        }
    });
};

export const addMultipleNotesData = async function (notesData, deckName, modelName) {
    notesData = await checkIfNotesCanBeAdded(notesData, deckName, modelName);
    printWhichCannotBeAdded(notesData);
    const notesCreationResponse = await addNotes(notesData, deckName, modelName);
    printNotesWhichWereNotAdded(notesData, notesCreationResponse);
}
