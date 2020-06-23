
var rects = [];

var rectGrid = d3.layout.grid()
    .bands()
    .size([gridSize, gridSize])
    .rows([rows_cols])
    .cols([rows_cols]);

var svg = d3.select(".vis").append("svg")
    .attr({
        width: width,
        height: height
    })
    .attr("class", "visualization")
    .attr("transform", "translate(70,70)");


for (let i = 0; i < neighborhood_infections.length; i++) {
    let radius = getRadiusFromInfected(neighborhood_infections[i]);
    addNeighborhood(neighborhood_populations[i],radius, parklands[i]);
}

/**
 * calculates and distributes infections to clean neighborhoods
 **/

/**
 * Gets the corresponding grayscale color for a neighborhood population
 **/
function getColorForPopulation(population) {
    for (const scale of population_to_grayscale_color) {
        if (population >= scale["min"] && population <= scale["max"]) {
            return scale["color"];
        }
    }
}

function getRadiusFromInfected(num_infected) {
    for (const scale of infections_to_radius) {
        if (num_infected >= scale["min"] && num_infected <= scale["max"]) {
            return scale["radius"];
        }
    }
}
function addNeighborhood(population, radius, parkland) {
    rects.push({});
    var rectangles = svg.selectAll("g")
        .data(rectGrid(rects))
        .enter()
        .append("g");

    rectangles.append("rect")
        .attr("width", max_radius * 2)
        .attr("height", max_radius * 2)
        .attr("class", "rect")
        .attr("fill", parkland ? parkland_cell_color : getColorForPopulation(population))
        .attr("stroke", "black")
        .attr("stroke-opacity","0.5")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    rectangles.append("circle")
        .attr("class", "point")
        .attr("cx", function (d) { return d.x+(max_radius) ; })
        .attr("cy", function (d) { return d.y+(max_radius); })
        .attr("r", radius)
        .attr("fill", "red");
}

function updateRects() {
    var rect = svg.selectAll(".rect")
        .data(rectGrid(rects));
    rect.each(function (d, i) {
        var new_color = parklands[i] ? parkland_cell_color : getColorForPopulation(neighborhood_populations[i])
        d3.select(this).transition().attr("fill", new_color);
    })
}


/**
 * updates points according to infection numbers
 **/
function updatePoints() {
    var point = svg.selectAll(".point")
        .data(rectGrid(rects));
    point.each(function (d, i) {
        let new_radius = getRadiusFromInfected(neighborhood_infections[i]);
        d3.select(this).transition().attr("r", new_radius);
    })
}






/**
 * Takes in simulation speed in days per second and converts to milliseconds per day.
 **/
function getSimulationSpeed(secs_per_day) {
    return 1000 * secs_per_day;
}

let simulation_speed = getSimulationSpeed(document.getElementById("speed").value);

var tick = 0;
var running = false;

let initial_state = {"neighborhood_populations": JSON.parse(JSON.stringify(neighborhood_populations)) , "neighborhood_infections": JSON.parse(JSON.stringify(neighborhood_infections)),
    "curCellRate": document.getElementById("curCellRate").value, "adjCellRate": document.getElementById("adjCellRate").value, "parklands": JSON.parse(JSON.stringify(parklands)), "cur_infectionable": JSON.parse(JSON.stringify(cur_infectionable)),
    "cur_infections": cur_infections};


function setInitialStateToCurrentState() {
    initial_state["neighborhood_populations"] = JSON.parse(JSON.stringify(neighborhood_populations));
    initial_state["neighborhood_infections"] = JSON.parse(JSON.stringify(neighborhood_infections));
    initial_state["curCellRate"] = document.getElementById("curCellRate").value;
    initial_state["adjCellRate"] = document.getElementById("adjCellRate").value;
    initial_state["parklands"] = JSON.parse(JSON.stringify(parklands));
    initial_state["cur_infectionable"] = JSON.parse(JSON.stringify(cur_infectionable));
    initial_state["cur_infections"] = cur_infections;
}

/**
 * When next day button is clicked
 **/
function nextDay() {
    if (cur_days === 0) {
        setInitialStateToCurrentState();
    }
    if (cur_deaths < population) {
        if (cur_infections < population) {
            updateInfections();
        }
        updateDeaths();
        updatePoints();
        updateCurInfectionsAndDeaths();
        updateDisplayVariables();
        cur_days += 1;
    }

    if (cur_infections >= population) {
        document.getElementById("nextDay").disabled = true;
        endOfSimulation();
    }
}


//keeps track of whether simulation reached end state.
function runSimulation() {
    if (running === false) {
        //remember initial state to go back to
        if (cur_days === 0) {
            setInitialStateToCurrentState();
        }
        //resuming or starting the simulation
        running = true;
        document.getElementById("startButton").innerHTML = pause_simulation_button_text;
        disableControls();
        tick = setInterval(update, simulation_speed);
    } else {
        //pausing logic
        clearInterval(tick);
        running = false;
        document.getElementById("nextDay").disabled = false;
        document.getElementById("startButton").innerHTML = continue_simulation_button_text;
        document.getElementById("restart").disabled = false;
    }
}

function update() {
    if (cur_deaths < population) {
        if (cur_infections < population) {
            updateInfections();
        }
        updateDeaths();
        updatePoints();
        cur_days += 1;
        updateCurInfectionsAndDeaths();
        updateDisplayVariables();
    } else {
        endOfSimulation();
    }
}
/**
 * increases a neighborhood's infections based on adjacent infections and current neighborhood infections
 * @param index the index of the neighborhood in a one dimensional array
 * */
function getUpdatedNeighborhoodInfections(index) {
    let row = getRow(index, rows_cols);
    let col = getCol(index, rows_cols);
    let adjIndices = getAdjacentsIndices(row, col, rows_cols);
    var updated_infections = Math.ceil(cur_cell_rate * neighborhood_infections[index]);
    for (const adj of adjIndices) {
        var percentage_adjacent = adj_cell_rate - 1;
        updated_infections = updated_infections +  Math.ceil(percentage_adjacent * neighborhood_infections[adj]);
    }
    return updated_infections;
}

/**
 *  Updates infections for the entire grid. Updates state variables as needed
 **/
function updateInfections() {
    Object.keys(cur_infectionable).forEach((i, infections) => {
        if (cur_infectionable[i] < neighborhood_populations[i]) {
            var max_infections = neighborhood_populations[i] - neighborhood_deaths[i];
            neighborhood_infections[i] = Math.min(max_infections, getUpdatedNeighborhoodInfections(i));
            cur_infectionable[i] = neighborhood_infections[i];
        }
        if ((neighborhood_infections[i] + neighborhood_deaths[i]) >= neighborhood_populations[i]) {
            delete cur_infectionable[i];
        }
    });
}

/**
 * marks mortality_rate % of each neighborhood as dead and subtracts them from the number of infected.
 * */
function updateDeaths() {
    for (let i = 0; i < neighborhood_deaths.length; i++) {
        var num_new_dead = Math.ceil(mortality_rate * neighborhood_infections[i]);
        neighborhood_deaths[i] = neighborhood_deaths[i] + num_new_dead;
        neighborhood_infections[i] = neighborhood_infections[i] -  num_new_dead;
        cur_infectionable[i] = neighborhood_infections[i];
    }
}

function updateCurInfectionsAndDeaths() {
    cur_infections = 0;
    cur_deaths = 0;
    for (let i = 0; i < num_neighborhoods; i++) {
        cur_infections += neighborhood_infections[i];
        cur_deaths += neighborhood_deaths[i];
    }
}
function updateDisplayVariables() {
    document.getElementById("curDay").innerHTML = cur_days;
    document.getElementById("numInfected").innerHTML = cur_infections;
    document.getElementById("numDead").innerHTML = cur_deaths;
}
/**
 * Happens at the end of the simulation
 */
function endOfSimulation() {
    clearInterval(tick);
    running = false;
    document.getElementById("startButton").innerHTML = start_simulation_button_text;
    document.getElementById("startButton").disabled = true;
    document.getElementById("restart").disabled = false;
    if (cur_infections < population) {
        document.getElementById("nextDay").disabled = false;
    }
}


/**
 * Restarts simulation in a new randomly distributed state based on current parameters
 */
function restartNew() {
    endOfSimulation();
    parklands = generateParklandsArray();
    neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
    updateRects();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    neighborhood_deaths = Array(num_neighborhoods).fill(0);
    updatePoints();
    enableControls();
    cur_days = 0;
    updateCurInfectionsAndDeaths();
    updateDisplayVariables();
}

/**
 * Restarts simulation in with starting point at t=0 for the current simulation, with identical distribution of infections, population,
 * parklands.
 */
function restartOriginal() {
    endOfSimulation();
    parklands = initial_state["parklands"];
    neighborhood_populations = initial_state["neighborhood_populations"];
    neighborhood_infections = initial_state["neighborhood_infections"];
    cur_infectionable = initial_state["cur_infectionable"];
    cur_infections = initial_state["cur_infections"];
    neighborhood_deaths = Array(num_neighborhoods).fill(0);
    document.getElementById("curCellRate").value = initial_state["curCellRate"];
    document.getElementById("adjCellRate").value = initial_state["adjCellRate"];
    var event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    document.getElementById("curCellRate").dispatchEvent(event);
    document.getElementById("adjCellRate").dispatchEvent(event);
    updatePoints();
    updateRects();
    enableControls();
    cur_days = 0;
    updateCurInfectionsAndDeaths();
    updateDisplayVariables();
}