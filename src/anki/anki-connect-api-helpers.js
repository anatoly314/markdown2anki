import { canAddNotes, addNotes } from './anki-connect-api';

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
