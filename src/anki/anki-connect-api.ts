import axios from 'axios';

async function _axiosPostRequest(body){
    const response = await axios({
        method: 'post',
        url: process.env.ANKI_URI,
        data: body
    })
    return response.data;
}

/**
 * Gets the version of the API exposed by this plugin. Currently versions 1 through 6 are defined.
 * @returns {Promise<*>}
 */
export const getVersion = async function () {
    const body = {
        action: "version",
        version: process.env.ANKI_API_VERSION
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getDeckNames = async function () {
    const body = {
        action: "deckNamesAndIds",
        version: process.env.ANKI_API_VERSION
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getModelNames = async function () {
    const body = {
        action: "modelNames",
        version: process.env.ANKI_API_VERSION
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getDecks = async function (cardIds = []) {
    const body = {
        action: "getDecks",
        version: process.env.ANKI_API_VERSION,
        params: {
            cards: cardIds
        }
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getNotes = async function (deckName, modelName, frontField) {
    const body = {
        action: "findNotes",
        version: process.env.ANKI_API_VERSION,
        params: {
            query: `"deck:${deckName}" "note:${modelName}" "front:${frontField}"`,
        }
    };
    const data = await _axiosPostRequest(body);
    return data;
}


export const addNote = async function (ankiNote, deckName, modelName) {
    const body = {
        action: "multi",
        version: process.env.ANKI_API_VERSION,
        params: {
            actions: []
        }
    };

    const addNoteAction = {
        action: "addNote",
        params: {
            note: {
                deckName: deckName,
                modelName: modelName,
                fields: {
                    Front: ankiNote.front,
                    Back: ankiNote.back
                },
                tags: []
            }
        }
    }
    body.params.actions.push(addNoteAction);

    ankiNote.files.forEach(file => {
        const addFileAction = {
            action: "storeMediaFile",
            params: {
                filename: file.filename,
                data: file.fileData
            }
        }
        body.params.actions.push(addFileAction);
    })

    const data = await _axiosPostRequest(body);
    return data;
}

export const updateNote = async function (id, ankiNote) {

    const body = {
        action: "multi",
        version: process.env.ANKI_API_VERSION,
        params: {
            actions: []
        }
    };

    const updateNoteAction = {
        action: "updateNoteFields",
        params: {
            note: {
                id: id,
                fields: {
                    Front: ankiNote.front,
                    Back: ankiNote.back
                },
                tags: []
            }
        }
    }
    body.params.actions.push(updateNoteAction);

    ankiNote.files.forEach(file => {
        const addFileAction = {
            action: "storeMediaFile",
            params: {
                filename: file.filename,
                data: file.fileData
            }
        }
        body.params.actions.push(addFileAction);
    })

    const data = await _axiosPostRequest(body);
    return data;
}
