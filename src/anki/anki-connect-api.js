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
        "action": "version",
        "version": process.env.ANKI_API_VERSION
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getDeckNames = async function () {
    const body = {
        "action": "deckNamesAndIds",
        "version": process.env.ANKI_API_VERSION
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getModelNames = async function () {
    const body = {
        "action": "modelNames",
        "version": process.env.ANKI_API_VERSION
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getDecks = async function (cardIds = []) {
    const body = {
        "action": "getDecks",
        "version": process.env.ANKI_API_VERSION,
        "params": {
            "cards": cardIds
        }
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const getNotes = async function (deckName, modelName, frontField) {
    const body = {
        "action": "findNotes",
        "version": process.env.ANKI_API_VERSION,
        "params": {
            "query": `"deck:${deckName}" "note:${modelName}" "front:${frontField}"`,
        }
    };
    const data = await _axiosPostRequest(body);
    return data;
}

export const addNote = async function (ankiNote, deckName, modelName) {
    const body = {
        action: "addNote",
        version: process.env.ANKI_API_VERSION,
        params: {
            note: {
                deckName: deckName,
                modelName: modelName,
                fields: {
                    Front: "",
                    Back: ""
                },
                tags:[]
            }
        }
    };

    body.params.note.fields.Front = ankiNote.front;
    body.params.note.fields.Back = ankiNote.back;

    const data = await _axiosPostRequest(body);
    return data;
}

export const updateNote = async function (id, ankiNote) {
    const body = {
        action: "updateNoteFields",
        version: process.env.ANKI_API_VERSION,
        params: {
            note: {
                id: id,
                fields: {
                    Front: "",
                    Back: ""
                }
            }
        }
    };

    body.params.note.fields.Front = ankiNote.front;
    body.params.note.fields.Back = ankiNote.back;

    const data = await _axiosPostRequest(body);
    return data;
}
