//DATA
let world = [
  {level:0,
   name:"town",
   width:1200,
   height:600,
   data:[]
 },
   {level:1,
    name:"desert",
    width:8000,
    height:4000,
    data:[]
    }
    ]
let maps_count = world.length;
let maps_loaded = 0;


//IMPORT FROM MAPS

var xhttp = new XMLHttpRequest();
xhttp.addEventListener("load", function() {
  var arr  = xhttp.responseText.replace(/\n/g,",").split(",");
  world[1].data = arr.map(Number);
  maps_loaded = 2;//maps_loaded++;
});
xhttp.open("GET", "./resources/maps/desert.csv", true);
xhttp.send();
