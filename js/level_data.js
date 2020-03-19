//DATA
let world = [
  {level:0,
   name:"camp",
   width:1200,
   height:600,
   floor_data_source:"./resources/maps/desert_floor.csv",
   floor_data:[], //gets populated through import -> see below
   object_data_source:"./resources/maps/desert_object.csv",
   object_data:[], //gets populated through import -> see below
   obstacle_data_source:"./resources/maps/desert_obstacle.csv",
   obstacle_data:[], //gets populated through import -> see below
   visibility_data_source:"./resources/maps/desert_visibility.csv",
   visibility_data:[], //gets populated through import -> see below
   spawn_data_source:"./resources/maps/desert_spawn.csv",
   spawn_data:[], //gets populated through import -> see below
   enemy_count:0
  },
  {level:1,
    name:"desert",
    width:9600,
    height:4800,
    floor_data_source:"./resources/maps/desert_floor.csv",
    floor_data:[], //gets populated through import -> see below
    object_data_source:"./resources/maps/desert_object.csv",
    object_data:[], //gets populated through import -> see below
    obstacle_data_source:"./resources/maps/desert_obstacle.csv",
    obstacle_data:[], //gets populated through import -> see below
    visibility_data_source:"./resources/maps/desert_visibility.csv",
    visibility_data:[], //gets populated through import -> see below
    spawn_data_source:"./resources/maps/desert_spawn.csv",
    spawn_data:[], //gets populated through import -> see below
    enemy_count:2
  },
  {level:2,
    name:"mines",
    width:3200,
    height:512,
    floor_data_source:"./resources/maps/mines_floor.csv",
    floor_data:[], //gets populated through import -> see below
    object_data_source:"./resources/maps/mines_object.csv",
    object_data:[], //gets populated through import -> see below
    obstacle_data_source:"./resources/maps/mines_obstacle.csv",
    obstacle_data:[], //gets populated through import -> see below
    visibility_data_source:"./resources/maps/desert_obstacle.csv",
    visibility_data:[], //gets populated through import -> see below
    spawn_data_source:"./resources/maps/desert_spawn.csv",
    spawn_data:[], //gets populated through import -> see below
    enemy_count:0
  }
    ]

//IMPORT DATA FROM MAPS

//function loadMaps() {
  //for(i_maps_loaded=0;i_maps_loaded < world.length;i_maps_loaded++) {
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

    var xhttp_obstacle_data = new XMLHttpRequest();
    xhttp_obstacle_data.addEventListener("load", function() {
      var arr  = xhttp_obstacle_data.responseText.replace(/\n/g,",").split(",");
      world[1].obstacle_data = arr.map(Number);
    });
    xhttp_obstacle_data.open("GET", world[1].obstacle_data_source, true);
    xhttp_obstacle_data.send();

    var xhttp_visibility_data = new XMLHttpRequest();
    xhttp_visibility_data.addEventListener("load", function() {
      var arr  = xhttp_visibility_data.responseText.replace(/\n/g,",").split(",");
      world[1].visibility_data = arr.map(Number);
    });
    xhttp_visibility_data.open("GET", world[1].visibility_data_source, true);
    xhttp_visibility_data.send();

    var xhttp_spawn_data = new XMLHttpRequest();
    xhttp_spawn_data.addEventListener("load", function() {
      var arr  = xhttp_spawn_data.responseText.replace(/\n/g,",").split(",");
      world[1].spawn_data = arr.map(Number);
    });
    xhttp_spawn_data.open("GET", world[1].spawn_data_source, true);
    xhttp_spawn_data.send();
//  }
//}

//loadMaps();
