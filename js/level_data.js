//DATA
let world = [
  {level:0,
   name:"town",
   width:1200,
   height:600,
   floor_data_source:"./resources/maps/desert_floor.csv",
   floor_data:[], //gets populated through import -> see below
   object_data_source:"./resources/maps/desert_object.csv",
   object_data:[],
   enemy_count:0
  },
  {level:1,
    name:"desert",
    width:1152,
    height:1152,
    floor_data_source:"./resources/maps/desert_floor.csv",
    floor_data:[], //gets populated through import -> see below
    object_data_source:"./resources/maps/desert_object.csv",
    object_data:[],
    enemy_count:2
  }
    ]

//IMPORT DATA FROM MAPS

var xhttp_floor_data = new XMLHttpRequest();
xhttp_floor_data.addEventListener("load", function() {
  var arr  = xhttp_floor_data.responseText.replace(/\n/g,",").split(",");
  world[1].floor_data = arr.map(Number);
});
xhttp_floor_data.open("GET", world[1].floor_data_source, true);
xhttp_floor_data.send();


var xhttp_object_data = new XMLHttpRequest();
xhttp_object_data.addEventListener("load", function() {
  var arr  = xhttp_object_data.responseText.replace(/\n/g,",").split(",");
  world[1].object_data = arr.map(Number);
});
xhttp_object_data.open("GET", world[1].object_data_source, true);
xhttp_object_data.send();
