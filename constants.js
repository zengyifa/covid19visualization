
let num_neighborhoods = 400;

let rows_cols = Math.sqrt(num_neighborhoods);

let max_radius = 25;


//dimensions of the grid, assumed to be a square.
let gridSize = max_radius * rows_cols * 2;

//svg dimensions
let width = gridSize * 1.15,
    height = gridSize * 1.15;

let population_to_grayscale_color =
    [{"min":0, "max":100, "color":"transparent"},
     {"min":101, "max":200, "color":"#DCDCDC"},
     {"min":201, "max":400, "color":"#D3D3D3"},
     {"min":401, "max":800, "color":"#C0C0C0"},
     {"min":801, "max":1600, "color":"#A9A9A9"},
     {"min":1601, "max":3200, "color":"#808080"},
     {"min":3201, "max":Infinity, "color":"#696969"}]



let infections_to_radius = [
     {"min": 0, "max": 0, "radius": 0},
     {"min": 1, "max": 3, "radius": max_radius / 9},
     {"min": 4, "max": 7, "radius": max_radius / 9 * 2},
     {"min": 8, "max": 15, "radius": max_radius / 9 * 3},
     {"min": 16, "max": 31, "radius": max_radius / 9 * 4},
     {"min": 32, "max": 63, "radius": max_radius / 9 * 5},
     {"min": 64, "max": 127, "radius": max_radius / 9 * 6},
     {"min": 128, "max": 255, "radius": max_radius / 9 * 7},
     {"min": 256, "max": 511, "radius": max_radius / 9 * 8},
     {"min": 512, "max": Infinity, "radius": max_radius}
]

let new_simulation_button_text = "Go to new initial state";

let start_simulation_button_text = "Run Simulation";