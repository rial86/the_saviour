//DATA
let world = [
  {level:0,
   name:"town",
   width:1200,
   height:600,
   floor_data:[],
   object_data:[],
   enemy_count:0
  },
  {level:1,
    name:"desert",
    width:1152,
    height:1152,
    floor_data:[], //gets populated through import -> see below
    object_data:[],
    enemy_count:2
  }
    ]
let maps_count = world.length;
let maps_loaded = 0;


//IMPORT DATA FROM MAPS

var xhttp = new XMLHttpRequest();
xhttp.addEventListener("load", function() {
  var arr  = xhttp.responseText.replace(/\n/g,",").split(",");
  world[1].floor_data = arr.map(Number);
  maps_loaded = 2;//maps_loaded++;
});
xhttp.open("GET", "./resources/maps/desert_floor.csv", true);
xhttp.send();

/*
var xhttp = new XMLHttpRequest();
xhttp.addEventListener("load", function() {
  var arr  = xhttp.responseText.replace(/\n/g,",").split(",");
  world[1].object_data = arr.map(Number);
  maps_loaded = 2;//maps_loaded++;
});
xhttp.open("GET", "./resources/maps/desert_objects.csv", true);
xhttp.send();
*/
