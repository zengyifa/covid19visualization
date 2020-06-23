function resize() {
    this.style.width = ((this.value.length) * 9) + 'px';
}

function updateMinCeilingMaxFloor() {
    let minCeiling = Math.floor(document.getElementById("population").value / (num_neighborhoods - num_parklands));
    let maxFloor = Math.ceil(document.getElementById("population").value / (num_neighborhoods - num_parklands));
    document.getElementById("minCeiling").innerHTML = minCeiling;
    document.getElementById("maxFloor").innerHTML = maxFloor;
    document.getElementById("min").max = minCeiling;
    document.getElementById("max").min = maxFloor;
    document.getElementById("min").value = document.getElementById("min").min;
    document.getElementById("max").value = document.getElementById("max").max;
    var event = new Event('mouseup', {
        bubbles: true,
        cancelable: true,
    });
    document.getElementById("min").dispatchEvent(event);
    document.getElementById("max").dispatchEvent(event);
}



document.getElementById("parkland").oninput = function (){
    document.getElementById("parklandValue").value = this.value;
    resize.call(document.getElementById("parklandValue"))
}
document.getElementById("parklandValue").addEventListener("focusout", function(event) {
    if (this.value< 0 || this.value > 25 ){
        this.value = document.getElementById("parkland").value;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a valid value for Parkland Neighborhoods.")
    }else {
        document.getElementById("parkland").value = this.value;
        parkland_percent = this.value / 100;
        parklands = generateParklandsArray();
        num_parklands = parklands.filter(Boolean).length;
        updateMinCeilingMaxFloor();
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
});

document.getElementById("parklandValue").addEventListener("keyup", resize);

document.getElementById("population").oninput = function () {
    document.getElementById("populationValue").value = this.value;
    resize.call(document.getElementById("populationValue"));
    document.getElementById("populationDisplayed").innerHTML= this.value;
    population = this.value;
}

/**
 * Updates the values when the increment buttons are clicked
 **/
function populationPlus(){
    document.getElementById("populationValue").value = parseInt(document.getElementById("populationValue").value) + 100;
    document.getElementById("population").value = parseInt(document.getElementById("population").value) + 100;
    document.getElementById("populationDisplayed").innerHTML = parseInt(document.getElementById("populationDisplayed").innerHTML) + 100;
    population = parseInt(population) + 100;
    resize.call(document.getElementById("populationValue"));
    updateMinCeilingMaxFloor();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updatePoints();
}

function populationMinus(){
    document.getElementById("populationValue").value = parseInt(document.getElementById("populationValue").value) - 100;
    document.getElementById("population").value = parseInt(document.getElementById("population").value) - 100;
    document.getElementById("populationDisplayed").innerHTML = parseInt(document.getElementById("populationDisplayed").innerHTML) - 100;
    population = parseInt(population) - 100;
    resize.call(document.getElementById("populationValue"));
    updateMinCeilingMaxFloor();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updatePoints();
}

function iPlus(){
    var newI =parseFloat(parseFloat(document.getElementById("initialInfectionRateValue").value).toFixed(1) - (-0.1)).toFixed(1) ;
    if ( newI< 0 || newI > 10){
        alert("Please enter a value between 0 and 10 for initial infection rate.")
    }else {
        document.getElementById("initialInfectionRate").value = newI;
        document.getElementById("initialInfectionRateValue").value = newI;
        resize.call(document.getElementById("initialInfectionRateValue"))
        updateMinCeilingMaxFloor();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }

};

function iMinus(){
    var newI = parseFloat(parseFloat(document.getElementById("initialInfectionRateValue").value).toFixed(1) -0.1).toFixed(1);
    if ( newI< 0 || newI > 10){
        alert("Please enter a value between 0 and 10 for initial infection rate.")
    }else {
        document.getElementById("initialInfectionRate").value = newI;
        document.getElementById("initialInfectionRateValue").value = newI;
        resize.call(document.getElementById("initialInfectionRateValue"))
        updateMinCeilingMaxFloor();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }

};

function cPlus(){
    var newA = parseInt(document.getElementById("curCellRateValue").value) + 1;
    if (newA< 0 || newA > 25){
        alert("Please enter a value between 0 and 25 for Current cell infectoin rate.")
    }else {
        document.getElementById("curCellRate").value = newA;
        document.getElementById("curCellRateValue").value = newA;
        cur_cell_rate =  1 + (document.getElementById("curCellRate").value / 100);
        resize.call(document.getElementById("curCellRateValue"))
    }
};

function cMinus(){
    var newA = parseInt(document.getElementById("curCellRateValue").value) - 1;
    if (newA< 0 || newA > 25){
        alert("Please enter a value between 0 and 25 for Current cell infectoin rate.")
    }else {
        document.getElementById("curCellRate").value = newA;
        document.getElementById("curCellRateValue").value = newA;
        cur_cell_rate =  1 + (document.getElementById("curCellRate").value / 100);
        resize.call(document.getElementById("curCellRateValue"))
    }
};

function aPlus(){
    var newA = parseInt(document.getElementById("adjCellRateValue").value) + 1;
    if (newA< 0 || newA > 25){
        alert("Please enter a value between 0 and 25 for Adjacent cell infectoin rate.")
    }else {
        document.getElementById("adjCellRate").value = newA;
        document.getElementById("adjCellRateValue").value = newA;
        adj_cell_rate =  1 + (document.getElementById("adjCellRate").value / 100);
        resize.call(document.getElementById("adjCellRateValue"))
    }
};

function aMinus(){
    var newA = parseInt(document.getElementById("adjCellRateValue").value) - 1;
    if (newA< 0 || newA > 25){
        alert("Please enter a value between 0 and 25 for Adjacent cell infectoin rate.")
    }else {
        document.getElementById("adjCellRate").value = newA;
        document.getElementById("adjCellRateValue").value = newA;
        adj_cell_rate =  1 + (document.getElementById("adjCellRate").value / 100);
        resize.call(document.getElementById("adjCellRateValue"))
    }
};

function mnPlus(){
    var newN = parseInt(document.getElementById("minValue").value) + 10;
    if (newN< parseInt(document.getElementById("min").min) || newN > parseInt(document.getElementById("min").max) ){
        alert("Please enter a valid value for Max Neighborhood Pop.")
    }else {
        document.getElementById("min").value = newN;
        document.getElementById("minValue").value = newN;
        neighborhood_min = parseInt(newN);
        resize.call(document.getElementById("minValue"))
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
};


function mnMinus(){
    var newN = parseInt(document.getElementById("minValue").value) - 10;
    if (newN< parseInt(document.getElementById("min").min) || newN > parseInt(document.getElementById("min").max) ){
        alert("Please enter a valid value for Max Neighborhood Pop.")
    }else {
        document.getElementById("min").value = newN;
        document.getElementById("minValue").value = newN;
        neighborhood_min = parseInt(newN);
        resize.call(document.getElementById("minValue"))
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
};

function nPlus(){
    var newN = parseInt(document.getElementById("maxValue").value) + 100;
    if (newN< parseInt(document.getElementById("max").min) || newN > parseInt(document.getElementById("max").max) ){
        alert("Please enter a valid value for Max Neighborhood Pop.")
    }else {
        document.getElementById("max").value = newN;
        document.getElementById("maxValue").value = newN;
        resize.call(document.getElementById("maxValue"))
        neighborhood_max = parseInt(newN);
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
};


function nMinus(){
    var newN = parseInt(document.getElementById("maxValue").value) - 100;
    if (newN< parseInt(document.getElementById("max").min) || newN > parseInt(document.getElementById("max").max) ){
        alert("Please enter a valid value for Max Neighborhood Pop.")
    }else {
        document.getElementById("max").value = newN;
        document.getElementById("maxValue").value = newN;
        resize.call(document.getElementById("maxValue"))
        neighborhood_max = parseInt(newN);
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
};


function parkPlus(){
    var newP = parseInt(document.getElementById("parklandValue").value) + 1;
    if (newP< 0 || newP > 25 ){
        alert("Please enter a valid value for Parkland Neighborhoods.")
    }else {
        document.getElementById("parkland").value = newP;
        document.getElementById("parklandValue").value = newP;
        parkland_percent = newP / 100;
        resize.call(document.getElementById("parklandValue"))
        parklands = generateParklandsArray();
        num_parklands = parklands.filter(Boolean).length;
        updateMinCeilingMaxFloor();
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
};

function parkMinus(){
    var newP = parseInt(document.getElementById("parklandValue").value) - 1;
    if (newP< 0 || newP > 25 ){
        alert("Please enter a valid value for Parkland Neighborhoods.")
    }else {
        document.getElementById("parkland").value = newP;
        document.getElementById("parklandValue").value = newP;
        parkland_percent = newP / 100;
        resize.call(document.getElementById("parklandValue"))
        parklands = generateParklandsArray();
        num_parklands = parklands.filter(Boolean).length;
        updateMinCeilingMaxFloor();
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
};

function speedPlus(){
    var newS = parseFloat(parseFloat(document.getElementById("speed").value).toFixed(1) - (-0.1)).toFixed(1);
    if (newS< 0.1 || newS > 1 ){
        alert("Please enter a valid value for Simulation Speed.")
    }else {
        document.getElementById("speed").value = newS;
        document.getElementById("speedValue").value = newS;
        resize.call(document.getElementById("speedValue"))
        simulation_speed = getSimulationSpeed(document.getElementById("speed").value);
        if (running === true) {
            clearInterval(tick);
            tick = setInterval(update, simulation_speed);
        }
    }
};

function speedMinus(){
    var newS = parseFloat(parseFloat(document.getElementById("speed").value).toFixed(1) - 0.1).toFixed(1);
    if (newS< 0.1 || newS > 1 ){
        alert("Please enter a valid value for Simulation Speed.")
    }else {
        document.getElementById("speed").value = newS;
        document.getElementById("speedValue").value = newS;
        resize.call(document.getElementById("speedValue"))
        simulation_speed = getSimulationSpeed(document.getElementById("speed").value);
        if (running === true) {
            clearInterval(tick);
            tick = setInterval(update, simulation_speed);
        }
    }
};


document.getElementById("parkland").onmouseup = function (){
    parkland_percent = this.value / 100;
    parklands = generateParklandsArray();
    num_parklands = parklands.filter(Boolean).length;
    updateMinCeilingMaxFloor();
    neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
    updateRects();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updatePoints();
}


document.getElementById("mortRate").oninput = function() {
    document.getElementById("mortRateValue").value = this.value;
    mortality_rate =  document.getElementById("mortRate").value / 100;
    resize.call(document.getElementById("mortRateValue"));
}

document.getElementById("mortRateValue").addEventListener("focusout", function(event) {
    if (this.value< 1 || this.value > 7){
        this.value = document.getElementById("mortRateValue").value;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a value between 1 and 7 for mortality rate.")
    }else {
        document.getElementById("mortRate").value = this.value;
        mortality_rate =  document.getElementById("mortRate").value / 100;
        this.style.width = ((this.value.length) * 9) + 'px';
    }
});

document.getElementById("restart").disabled = false;

document.getElementById("minValue").value = document.getElementById("min").value ;
document.getElementById("maxValue").value = document.getElementById("max").value ;

updateMinCeilingMaxFloor();

document.getElementById("mortRateValue").addEventListener("keyup", resize);



document.getElementById("population").onmouseup = function() {
    resize.call(document.getElementById("populationValue"));
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updateMinCeilingMaxFloor();
    updatePoints();
}


/**
 * Updates the simulation with the value inside the "populationValue" box when the user leaves the input box
 **/
document.getElementById("populationValue").addEventListener("focusout", function(event) {

    if (this.value< 4000 || this.value > 400000){
        this.value = population;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a value between 4000 and 400000 for population.")
    }else {
        document.getElementById("population").value = this.value;
        document.getElementById("populationDisplayed").innerHTML= this.value;
        population = this.value;
        updateMinCeilingMaxFloor();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }

});

document.getElementById("initialInfectionRateValue").addEventListener("focusout", function(event) {

    if (this.value< 0 || this.value > 10){
        this.value = population;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a value between 0 and 10 for initial infection rate.")
    }else {
        document.getElementById("initialInfectionRate").value = this.value;
        updateMinCeilingMaxFloor();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }

});
document.getElementById("populationValue").addEventListener("keyup", resize)

document.getElementById("initialInfectionRateValue").addEventListener("keyup", resize)

document.getElementById("min").oninput = function() {
    document.getElementById("minValue").value = this.value;
    resize.call(document.getElementById("minValue"));
}


document.getElementById("min").onmouseup = function() {
    document.getElementById("minValue").value = this.value;
    neighborhood_min = parseInt(this.value);
    neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
    updateRects();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updatePoints();
}


document.getElementById("min").ontouchend = function() {
    document.getElementById("minValue").value = this.value;
    neighborhood_min = parseInt(this.value);
    neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
    resize.call(document.getElementById("minValue"));
    updateRects();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updatePoints();
}

document.getElementById("minValue").addEventListener("focusout", function(event) {
    if (this.value< parseInt(document.getElementById("min").min) || this.value > parseInt(document.getElementById("min").max) ){
        this.value = document.getElementById("min").value;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a valid value for Min Neighborhood Pop.")
    }else {
        document.getElementById("min").value = this.value;
        neighborhood_min = parseInt(this.value);
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
});

document.getElementById("minValue").addEventListener("keyup", resize);

document.getElementById("max").oninput = function() {
    document.getElementById("maxValue").value = this.value ;
    resize.call(document.getElementById("maxValue"));
}

document.getElementById("max").onmouseup = function() {
    document.getElementById("maxValue").value = this.value ;
    neighborhood_max = parseInt(this.value);
    neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
    updateRects();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updatePoints();
}

document.getElementById("max").ontouchend = function() {
    document.getElementById("maxValue").value = this.value ;
    neighborhood_max = parseInt(this.value);
    neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
    resize.call(document.getElementById("minValue"));
    updateRects();
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    updatePoints();
}

document.getElementById("maxValue").addEventListener("focusout", function(event) {
    if (this.value< parseInt(document.getElementById("max").min) || this.value > parseInt(document.getElementById("max").max) ){
        this.value = document.getElementById("max").value;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a valid value for Max Neighborhood Pop.")
    }else {
        document.getElementById("max").value = this.value;
        neighborhood_max = parseInt(this.value);
        neighborhood_populations = distribute_population(neighborhood_min, neighborhood_max);
        updateRects();
        distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
        updatePoints();
    }
});

document.getElementById("maxValue").addEventListener("keyup", resize);

document.getElementById("curCellRate").oninput = function() {
    document.getElementById("curCellRateValue").value = this.value;
    cur_cell_rate =  1 + (document.getElementById("curCellRate").value / 100);
    resize.call(document.getElementById("curCellRateValue"));
}

document.getElementById("curCellRateValue").addEventListener("focusout", function(event) {
    if (this.value< 0 || this.value > 25){
        this.value = document.getElementById("curCellRate").value;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a value between 0 and 25 for current cell infectoin rate.")
    }else {
        document.getElementById("curCellRate").value = this.value;
        cur_cell_rate =  1 + (document.getElementById("curCellRate").value / 100);
        this.style.width = ((this.value.length) * 9) + 'px';
    }
});

document.getElementById("curCellRateValue").addEventListener("keyup", resize);

document.getElementById("adjCellRate").oninput = function() {
    document.getElementById("adjCellRateValue").value = this.value;
    adj_cell_rate =  1 + (document.getElementById("adjCellRate").value / 100);
    resize.call(document.getElementById("adjCellRateValue"));
}

document.getElementById("adjCellRateValue").addEventListener("focusout", function(event) {
    if (this.value< 0 || this.value > 25){
        this.value = document.getElementById("adjCellRate").value;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a value between 0 and 25 for Adjacent cell infectoin rate.")
    }else {
        document.getElementById("adjCellRate").value = this.value;
        adj_cell_rate =  1 + (document.getElementById("adjCellRate").value / 100);
        this.style.width = ((this.value.length) * 9) + 'px';
    }
});

document.getElementById("adjCellRateValue").addEventListener("keyup", resize);

document.getElementById("initialInfectionRate").oninput = function() {
    document.getElementById("initialInfectionRateValue").value = this.value;
    resize.call(document.getElementById("initialInfectionRateValue"));
    document.getElementById("numInfected").innerHTML = Math.floor(this.value / 100 * parseInt(document.getElementById("population").innerHTML));

}

document.getElementById("initialInfectionRate").onmouseup = function() {
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    resize.call(document.getElementById("initialInfectionRateValue"));
    updatePoints();
}
document.getElementById("initialInfectionRate").ontouchend = function() {
    distributeInitialInfections((document.getElementById("initialInfectionRate").value) / 100);
    resize.call(document.getElementById("initialInfectionRateValue"));
    updatePoints();
}

document.getElementById("speed").oninput = function() {
    document.getElementById("speedValue").value = this.value;
    resize.call(document.getElementById("speedValue"))
    simulation_speed = getSimulationSpeed(document.getElementById("speed").value);
    if (running === true) {
        clearInterval(tick);
        tick = setInterval(update, simulation_speed);
    }
}

document.getElementById("speedValue").addEventListener("focusout", function(event) {
    if (this.value< 0.1 || this.value > 10 ){
        this.value = document.getElementById("speed").value;
        this.style.width = ((this.value.length) * 9) + 'px';
        alert("Please enter a valid value for Simulation Speed.")
    }else {
        document.getElementById("speed").value = this.value;
        resize.call(document.getElementById("speedValue"))
        simulation_speed = getSimulationSpeed(document.getElementById("speed").value);
        if (running === true) {
            clearInterval(tick);
            tick = setInterval(update, simulation_speed);
        }
    }
});

document.getElementById("speedValue").addEventListener("keyup", resize);


function enableControls() {
    document.getElementById("initialInfectionRate").disabled = false;
    document.getElementById("initialInfectionRateValue").disabled = false;
    document.getElementById("min").disabled = false;
    document.getElementById("max").disabled = false;
    document.getElementById("minValue").disabled = false;
    document.getElementById("maxValue").disabled = false;
    document.getElementById("nextDay").disabled = false;
    document.getElementById("population").disabled = false;
    document.getElementById("parkland").disabled = false;
    document.getElementById("parklandValue").disabled = false;
    document.getElementById("populationValue").disabled = false;
    var buttonList = document.getElementsByClassName("smallButton");
    for (var i =0; i< buttonList.length; i++) {
        buttonList[i].disabled = false;
    }
    document.getElementById("restart").disabled = false;
    document.getElementById("startButton").disabled = false;
}

/**
 * disables controls that shouldn't be changed when simulation is running
 */
function disableControls() {
    document.getElementById("initialInfectionRate").disabled = true;
    document.getElementById("initialInfectionRateValue").disabled = true;
    document.getElementById("min").disabled = true;
    document.getElementById("max").disabled = true;
    document.getElementById("minValue").disabled = true;
    document.getElementById("maxValue").disabled = true;
    document.getElementById("nextDay").disabled = true;
    document.getElementById("population").disabled = true;
    document.getElementById("parkland").disabled = true;
    document.getElementById("parklandValue").disabled = true;
    document.getElementById("populationValue").disabled = true;
    var buttonList = document.getElementsByClassName("smallButton");
    for (var i =0; i< buttonList.length; i++) {
        buttonList[i].disabled = true;
    }
    document.getElementById("restart").disabled = true;
}
