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