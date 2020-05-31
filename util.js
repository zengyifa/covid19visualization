function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

/**
 * distributes value into array of length length
 * @param value to distribute
 * @return array of length length with randomly distributed value
 */
function distribute(length, value) {
    if (length <= 1)
        return [value];
    var half = Math.floor(length / 2),
        dist = Math.floor(Math.random() * value);
    return distribute(half, dist).concat(distribute(length-half, value-dist));
}

/**
 * distributes value to array
 */
function distribute_add(array, value) {
    var to_be_added = distribute(array.length, value);
    return array.map(function (num, idx) {
        return num + to_be_added[idx];
    });
}

/**
 * distributes value to values in dictionary
 */
function distribute_add_dict(dict, value) {
    var to_be_added = distribute(Object.keys(dict).length, value);
    var arrayIndex = 0;
    for (var dictKey in dict) {
        dict[dictKey] += to_be_added[arrayIndex];
        arrayIndex += 1;
    }
    return dict;
}

/**
 * Gets the row in a 2d matrix from the 1d array index
 * @param index
 * @param gridSize
 * @returns row number, starting at 0
 */
function getRow(index, gridSize) {
    return index % gridSize;
}

/**
 * Gets the col in a 2d matrix from the 1d array index
 * @param index
 * @param gridSize
 * @returns col number, starting at 0
 */
function getCol(index, gridSize) {
    return Math.floor(index / gridSize);
}

/**
 * Gets one-dimensional index based on row and column number of a point in a grid
 * @param row
 * @param col
 * @param gridSize the length and width of the square grid
 * @returns the one dimensional index
 */
function getIndex(row, col, gridSize) {
    return row * gridSize + col;
}

/**
 * Returns an arrays of one-dimensional indices for points adjacent to the point at [row, col]
 * @param row the row of the point to get adjacent points for
 * @param col the col of the point to get adjacent points for
 * @param gridSize the length/width of the square grid.
 */
function getAdjacentsIndices(row, col, gridSize) {
    var result = []
    //check 4 corners first
    let adjRows = [row, row - 1, row + 1];
    let adjCols = [col, col - 1, col + 1];
    for (const adjRow of adjRows){
        for (const adjCol of adjCols) {
            if ((adjRow !== row || adjCol !== col) && !isOutOfBounds(adjRow, adjCol, gridSize)) {
                result.push(getIndex(adjRow, adjCol, gridSize));
            }
        }
    }
    return result;
}

/**
 * Returns true if row and col are out of bounds given a gridSize for a square grid, false otherwise.
 */
function isOutOfBounds(row, col, gridSize) {
    return (row < 0 || col < 0 || row > (gridSize - 1) || col > (gridSize - 1));
}