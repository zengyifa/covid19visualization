let population = parseInt(document.getElementById("population").value);
let parkland_percent = document.getElementById("parkland").value / 100;
let parklands = generateParklandsArray();
let num_parklands = parklands.filter(Boolean).length;


//assuming num_neighborhoods is a perfect square
let neighborhood_min = parseInt(document.getElementById("min").value);
let neighborhood_max = parseInt(document.getElementById("max").value);
let neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);

let cur_cell_rate = 1 + (document.getElementById("curCellRate").value / 100);
let adj_cell_rate = 1 + (document.getElementById("adjCellRate").value / 100);

var cur_infections = 0;
var cur_days = 0;


//represents the number of infections in each neighborhood
let neighborhood_infections = Array(num_neighborhoods).fill(0);
//represents a map from neighborhood number to number of infections, where each neighborhood has room for more infections.
let cur_infectionable = Object.assign({},neighborhood_infections);
distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);

// total number of current deaths
var cur_deaths = 0;

let neighborhood_deaths = Array(num_neighborhoods).fill(0);

let mortality_rate = document.getElementById("mortRate").value / 100;

function distributeInitialInfections(infection_rate) {
    neighborhood_infections = Array(num_neighborhoods).fill(0);
    cur_infectionable = Object.assign({},neighborhood_infections);
    for (const i in cur_infectionable) {
        if (parklands[i] === true) {
            delete cur_infectionable[i];
        }
    }
    cur_infections = Math.floor(infection_rate * population);
    document.getElementById("numInfected").innerHTML = cur_infections;
    distribute_infections(cur_infections);
}

/**
 * distributes num_infections into neighborhood_infections array, based on each neighborhood's max population.
 * updates cur_infectionable to have only non-fully infected neighborhoods
 * @param num_infections
 */

function distribute_infections(num_infections){
    cur_infectionable = distribute_add_dict(cur_infectionable, num_infections);
    var leftover = 0;
    for (const i in cur_infectionable) {
        neighborhood_infections[i] = cur_infectionable[i];
        if (cur_infectionable[i] >= neighborhood_populations[i]) {
            leftover += (cur_infectionable[i] - neighborhood_populations[i]);
            neighborhood_infections[i] = neighborhood_populations[i];
            delete cur_infectionable[i];
        }
    }
    while (leftover > 0) {
        cur_infectionable = distribute_add_dict(cur_infectionable, leftover);
        leftover = 0;
        for (const i in cur_infectionable) {
            neighborhood_infections[i] = Number(cur_infectionable[i]);
            if (cur_infectionable[i] >= neighborhood_populations[i]) {
                leftover += (cur_infectionable[i] - neighborhood_populations[i]);
                neighborhood_infections[i] = neighborhood_populations[i];
                delete cur_infectionable[i];
            }
        }
    }
}

/**
 * Distributes population to neighborhoods
 */
function distribute_population(min, max) {
    let numNonParkNeighborhoods = num_neighborhoods - num_parklands;
    if (min * numNonParkNeighborhoods > population) {
        throw new Error("minimum neighborhood population too high");
    } else if (max * numNonParkNeighborhoods  < population) {
        throw new Error("maximum neighborhood population too low");
    } else if (min > max) {
        throw new Error("min neighborhood population can't be greater than max");
    }
    //neighborhoods includes parkland neighborhoods
    var neighborhoods = Array(num_neighborhoods).fill(min);
    var pop_to_be_filled = population - num_neighborhoods * min;

    neighborhoods = distribute_add(neighborhoods, pop_to_be_filled);
    //represents non-full neighborhoods
    var cur_populable = Object.assign({}, neighborhoods);
    // enforce max, check for leftovers.
    var leftover = 0;
    for (const i in cur_populable) {
        //account for parklands first
        if (parklands[i] === true) {
            leftover += cur_populable[i];
            neighborhoods[i] = 0;
            delete cur_populable[i];
        } else if (cur_populable[i] >= max) {
            leftover += (cur_populable[i] - max);
            neighborhoods[i] = max;
            delete cur_populable[i];
        }
    }
    //keep distributing leftover until it's 0 and everything is below max
    while (leftover > 0) {
        cur_populable = distribute_add_dict(cur_populable, leftover);
        leftover = 0;
        for (var i in cur_populable) {
            neighborhoods[i] = cur_populable[i];
            if (cur_populable[i] >= max) {
                leftover += (cur_populable[i] - max);
                neighborhoods[i] = max;
                delete cur_populable[i];
            }
        }
        console.log("leftover is " + leftover);
    }

    console.log("total population check:" +
        neighborhoods.reduce((a, b) => a + b, 0)
    );
    return neighborhoods;
}
/**
 * returns a boolean array where true represents a parkland neighborhood.
 **/
function generateParklandsArray() {
    var result = Array(num_neighborhoods).fill(false);
    for (let i = 0; i < Math.ceil(parkland_percent * num_neighborhoods); i++) {
        var index = Math.floor(Math.random() * (num_neighborhoods - 1));
        while (result[index] === true) {
            index = Math.floor(Math.random() * (num_neighborhoods - 1));
        }
        result[index] = true;
    }
    return result;
}