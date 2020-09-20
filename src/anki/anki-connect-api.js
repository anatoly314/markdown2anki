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

export const canAddNotes = async function (deckName, modelName, frontFields = []) {
    const body = {
        action: "canAddNotes",
        version: process.env.ANKI_API_VERSION,
        params: {
            notes: []
        }
    };

    const noteTemplate = {
        deckName: deckName,
        modelName: modelName,
        fields: {
            Front: ""
        },
        tags:[]
    };

    const notes = frontFields.map(frontField => {
        const note = Object.assign({}, noteTemplate, {
            fields: {
                Front: frontField
            }
        });
        return note;
    });
    body.params.notes = notes;
    const data = await _axiosPostRequest(body);
    return data;
}

export const addNotes = async function (notesData, deckName, modelName) {
    const body = {
        action: "addNotes",
        version: process.env.ANKI_API_VERSION,
        params: {
            notes: []
        }
    };

    const noteTemplate = {
        deckName: deckName,
        modelName: modelName,
        fields: {
            Front: "",
            Back: ""
        },
        tags:[]
    };

    const notes = notesData.filter(noteData => {
        return noteData.canBeAdded;
    }).map(noteData => {
        const note = Object.assign({}, noteTemplate, {
            fields: {
                Front: noteData.front,
                Back: noteData.back
            }
        });
        return note;
    });

    body.params.notes = notes;
    const data = await _axiosPostRequest(body);
    return data;
}
