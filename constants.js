let population = 100000;

let num_neighborhoods = 400;

let population_to_grayscale_color =
    [{"min":0, "max":100, "color":"transparent"},
     {"min":101, "max":200, "color":"#DCDCDC"},
     {"min":201, "max":400, "color":"#D3D3D3"},
     {"min":401, "max":800, "color":"#C0C0C0"},
     {"min":801, "max":1600, "color":"#A9A9A9"},
     {"min":1601, "max":3200, "color":"#808080"},
     {"min":3201, "max":Infinity, "color":"#696969"}]