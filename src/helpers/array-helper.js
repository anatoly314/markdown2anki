export const splitArrayToChunks = function(array, chunkSize) {
    let chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        let tempArray = array.slice(i, i + chunkSize);
        chunks.push(tempArray);
    }
    return chunks;
}
