//------------------------------------------------------------------------------
//CONSTANTS---------------------------------------------------------------------
//------------------------------------------------------------------------------

const max_vitality = 10; //higher vitality = more hp
const max_grit = 10;     //higher grit = less damage
const max_quickness = 10;//higher speed = more movement speed
const max_accuracy = 10; //higher accuracy = more likely to hit where aimed
const max_skill = 5;    //higher skill = higher skill up of gear
const spawn_nr_obstacles = 100;
const spawn_nr_enemies = 3;
const damage_cooldown = 0.5;

//------------------------------------------------------------------------------
//VARIABLES---------------------------------------------------------------------
//------------------------------------------------------------------------------

let level = 1;
let map = {
  width:null,
  height:null,
  data:null
};
let game_state = 0; // 0 = preload / 1 = start_menu / 2 = play / 3 = gameover
let preload_started = false;
let assets_loaded = false;
let preload_completed = false;
let char = {
  name:"Rial",
  level:1,
  xp:0,
  stats_unspent:0,
  weapon_upgrade_unspent:0,
  vitality:3,
  grit:0,
  quickness:5,
  accuracy:5,
  skill:0,
  hp_max:function() {
    return this.vitality
  },
  hp:3,
  speed:3,
  width:48,
  height:48,
  d_face:"down",
  d_left:false,
  d_right:false,
  d_up:false,
  d_down:false,
  stop:false,
  pos_x:600,
  pos_y:600,
  footprint: [],
  target_x:0,
  target_y:0,
  sprite_x:0,
  sprite_y_down:0,
  sprite_y_left:1,
  sprite_y_right:2,
  sprite_y_up:3,
  hit:false,
  hit_time_last:0,
  weapon: {
    name:"RIFLE",
    sound: function() {
      audio.shot_rifle.play();
    },
    dmg:2,
    speed:15,
    cooldown:1,
    magazine_size:2,
    magazine:2,
    ammo:10,
    reload: function() {
      if (reload_state) {
        if (char.weapon.ammo > 0) {
          audio.reload.play();
          char.weapon.ammo-=(char.weapon.magazine_size-char.weapon.magazine);
          char.weapon.magazine=char.weapon.magazine_size;
        }
        else if (char.weapon.ammo <= 0 ){
        }
      }
    },
    mod_bolt_status:false,
    mod_grip_status:false,
    mod_frame_status:false,
    mod_barrel_status:false,
    mod_second_status:false
  },
  shot: {
    width:5,
    height:2,
    pos_x:null,
    pos_y:null,
    target_x:null,
    target_y:null,
    direction_x:null,
    direction_y:null,
    velocity_x:null,
    velocity_y:null,
    time_last:0,
  }
};
let enemy = [];
let camera_view = {
  width:600,
  height:450,
  pos_x:0,
  pos_y:0
};
let footprints = {
  render_number:8,
  offset:20,
  footprints_y_up_down:0,
  footprints_y_left_right:1,
}
let wildlife = [];
let sprite = {
  chars_width:48,
  chars_height:48,
  map_width:40,
  map_height:40,
  blood_width:512,
  blood_height:512,
  obstacle_cactus_width:26,
  obstacle_cactus_height:40,
  obstacle_stone_width:30,
  obstacle_stone_height:16,
  grave_width:22,
  grave_height:32,
  scorpion_width:6,
  scorpion_height:5,
  footprint_width:8,
  footprint_height:8
};
let cursor_type = {
  talk: "help",
  select: "pointer",
  shoot:"crosshair",
  reload: "none"
}
let obstacle = [];
let grave = [];
let blood = {
  pos_x:[],
  pos_y:[],
  sprite_x:[],
  sprite_y:[]
}
let hp_bar = {
  pos_x: null, //hp bar position x depends on actor position x
  pos_y: 10,
  height: 5,
  width: null, //hp bar width depends on actor width
  color_life:"green",
  color_dmg:"red",
  color_dead:"grey",
  dmg_offset_y:10
};
let xp = {
  level:[0,10,50,300,1000,2000,5000,7500,10000,15000,20000],
  next_level: function() {
    var next_level = char.level+1;
    return this.level[next_level-1];
  }
}
let sprite_step = 0;
let sprite_per_tick = 8;
let ticks = 0;
let reload_state = false;
let menu_state = false;
let levelup_state = false;
let weapon_upgrade_state = false;

//------------------------------------------------------------------------------
//PRELOAD-----------------------------------------------------------------------
//------------------------------------------------------------------------------

let images = ["blood","chars1","desert","footprints","grave","hp_empty","hp_full","obstacle1","obstacle2","rifle_inv","scorpion"];
let audio = ["ammo_pickup","hit","hit_obstacle","levelup","no_ammo","reload","reload_revolver","shot_revolver","shot_rifle"];
let assets_to_load = images.length + audio.length;

function loadResources(images,audio) {
  var currently_loading;
  //LOAD IMAGES
  for(i_images_loaded = 0; i_images_loaded < images.length; i_images_loaded++) {
    currently_loading = images[i_images_loaded];
    images[currently_loading] = new Image();
    images[currently_loading].src = "resources/gfx/"+images[i_images_loaded]+".png";
    images[currently_loading].addEventListener("load", function() {
      assets_to_load--;
      loaded();
    });
  }
  //LOAD AUDIO
  for(i_audio_loaded = 0; i_audio_loaded < audio.length; i_audio_loaded++) {
    currently_loading = audio[i_audio_loaded];
    audio[currently_loading] = new Audio();
    audio[currently_loading].src = "resources/audio/"+audio[i_audio_loaded]+".wav";
    audio[currently_loading].addEventListener("canplay", function() {
      assets_to_load--;
      loaded();
    });
  }
  //CHECKSUM AND CALLBACK
  function loaded() {
    if (assets_to_load == 0) {
      setAudio();
      assets_loaded = true;
    }
  }
}

function setAudio() {
  audio.shot_rifle.volume=0.3;
  audio.shot_revolver.volume=0.3;
  audio.hit.volume=0.3;
  audio.hit_obstacle.volume=0.5;
  audio.no_ammo.volume=1;
  audio.reload.volume=0.3;
  audio.ammo_pickup.volume=0.7;
  audio.levelup.volume=0.3;
}

function preLoad() {
  if (!preload_started) {
    preload_started = true;
    loadResources(images,audio);
  }
  if (!preload_completed && assets_loaded) {
    preload_completed = true;
    setTimeout(function() {
      init();
      game_state = 1;
      document.getElementById("game_menu").style.display = "none";
      document.getElementById("game_frame").style.display = "block";
    },2000);
  }
}

//------------------------------------------------------------------------------
//HELPER------------------------------------------------------------------------
//------------------------------------------------------------------------------

function roll(a) { //roll a random number between 1 and a
  return Math.floor((Math.random() * a) + 1);
}

function range(min, max) { //generate a number within range of min and max
    return Math.floor((min + (Math.random() * (max - min))),2);
  }

function now() { //create timestamp of time now
    return new Date().getTime()/1000;
  }

function collCheck(a,b) { //collission check between 2 objects
  if (a.pos_x + a.width > b.pos_x && a.pos_x < b.pos_x + b.width && a.pos_y+a.height > b.pos_y && a.pos_y < b.pos_y+b.width) {
    return true;
  }
}

function clamp(a,min,max) { //limit value a to min and max
  if (a < min) {
    return min;
  }
  else if (a > max) {
    return max;
  }
  else {
    return a;
  }
}

function toggle(a,b) {
  if (document.getElementById(a).style.display == "block") {
    document.getElementById(a).style.display = "none";
    if (b) {
    menu_state = false;
    }
  }
  else {
    document.getElementById(a).style.display = "block";
    if (b) {
    menu_state = true;
    }
  }
}

//------------------------------------------------------------------------------
//INITIALIZE--------------------------------------------------------------------
//------------------------------------------------------------------------------

function init() {
  document.getElementById("game_frame").style.display = "none";
  document.getElementById("game_menu").style.display = "block";
  createMap();
  createObstacles();
  createEnemies();
  createWildlife();
}

function createMap() {
  map.width = world[level].width;
  map.height = world[level].height;
  map.data = world[level].data;
}

function createObstacles() {
  for(i_create_obstacles=0;i_create_obstacles<spawn_nr_obstacles;i_create_obstacles++) {
    var obstacle_type;
    var obstacle_image;
    var obstacle_width;
    var obstacle_height;
    var obstacle_type_roll = roll(2);
    if (obstacle_type_roll == 1) {
      obstacle_type = "cactus";
      obstacle_image = images.obstacle1;
      obstacle_width = sprite.obstacle_cactus_width;
      obstacle_height = sprite.obstacle_cactus_height;
      obstacle_bulletproof = true;
    }
    if (obstacle_type_roll == 2) {
      obstacle_type = "stone";
      obstacle_image = images.obstacle2;
      obstacle_width = sprite.obstacle_stone_width;
      obstacle_height = sprite.obstacle_stone_height;
      obstacle_bulletproof = false;
    }
    obstacle.push({
      type:obstacle_type,
      image:obstacle_image,
      pos_x:roll(map.width),
      pos_y:roll(map.height),
      width:obstacle_width,
      height:obstacle_height,
      bulletproof:obstacle_bulletproof
    });
  }
}

function createEnemies() {
  for(i_create_enemies=0;i_create_enemies<spawn_nr_enemies;i_create_enemies++) {
    enemy.push({
      hp_max:5,
      hp:5,
      xp:20,
      aggro_range:300,
      width:48,
      height:48,
      d_face:"down",
      d_left:false,
      d_right:false,
      d_up:false,
      d_down:false,
      stop:false,
      pos_x:roll(map.width),
      pos_y:roll(map.height),
      footprint:[],
      speed:1,
      accuracy:1,
      quickness:1,
      sprite_x:6,
      sprite_y_down:4,
      sprite_y_left:5,
      sprite_y_right:6,
      sprite_y_up:7,
      hit:false,
      hit_time_last:0,
      weapon: {
        name:"REVOLVER",
        sound: function() {
          audio.shot_revolver.play();
        },
        dmg:1,
        speed:10,
        cooldown:2.5
      },
      shot: {
        width:5,
        height:2,
        pos_x:null,
        pos_y:null,
        target_x:null,
        target_y:null,
        direction_x:null,
        direction_y:null,
        velocity_x:null,
        velocity_y:null,
        time_last:0
      }
    });
  }
}

function createWildlife() {
  for(i_create_wildlife=0;i_create_wildlife<roll(3);i_create_wildlife++) {
    wildlife.push({
      type:"scorpion",
      pos_x:roll(map.width),
      pos_y:roll(map.height),
      speed:roll(2),
      width:sprite.scorpion_width,
      height:sprite.scorpion_height
    });
  }
}

//------------------------------------------------------------------------------
//INPUT-------------------------------------------------------------------------
//------------------------------------------------------------------------------

function input() {
  //CHAR INPUT------------------------------------------------------------------
  /* see file input.js */
  //ENEMY "INPUT"---------------------------------------------------------------
  for (i_enemies_input=0;i_enemies_input<enemy.length;i_enemies_input++) {
    actorDirection(i_enemies_input);
    if (Math.abs(char.pos_x-enemy[i_enemies_input].pos_x) < enemy[i_enemies_input].aggro_range && Math.abs(char.pos_y-enemy[i_enemies_input].pos_y) < enemy[i_enemies_input].aggro_range) {
      actorShoot(i_enemies_input);
    }
  }
}

function actorDirection(i) {
  var x = roll(75);
  if (x == 1) {
    enemy[i].d_left = true;
    enemy[i].d_right = false;
    enemy[i].d_up = false;
    enemy[i].d_down = false;
    enemy[i].d_face = "left";
  }
  if (x == 2) {
    enemy[i].d_left = false;
    enemy[i].d_right = true;
    enemy[i].d_up = false;
    enemy[i].d_down = false;
    enemy[i].d_face = "right";
  }
  if (x == 3) {
    enemy[i].d_left = false;
    enemy[i].d_right = false;
    enemy[i].d_up = true;
    enemy[i].d_down = false;
    enemy[i].d_face = "up";
  }
  if (x == 4) {
    enemy[i].d_left = false;
    enemy[i].d_right = false;
    enemy[i].d_up = false;
    enemy[i].d_down = true;
    enemy[i].d_face = "down";
  }
  enemy[i].stop = false;
}

function actorShoot(i) {
  if (now() - enemy[i].shot.time_last > enemy[i].weapon.cooldown) {
      enemy[i].shot.time_last = now();
      enemy[i].weapon.sound();
      shoot(enemy[i],char.pos_x,char.pos_y);
    }
}

function shoot(actor,mouse_x,mouse_y) {
  if (actor == char) {
  char.weapon.magazine--;
  }
  //define start position of shot based on model (thats why +actor.width/2 and +actor.height/2 is added to start the shot in the middle of char sprite)
  actor.shot.pos_x = actor.pos_x+actor.width/2;
  actor.shot.pos_y = actor.pos_y+actor.height/2;
  //define target and adjust shot targeting based on accuracy stat
  var shot_adjust_x = range((-max_accuracy+actor.accuracy)*3,(max_accuracy-actor.accuracy)*3);
  var shot_adjust_y = range((-max_accuracy+actor.accuracy)*3,(max_accuracy-actor.accuracy)*3);
  actor.shot.target_x = mouse_x+shot_adjust_x-actor.width/2;
  actor.shot.target_y = mouse_y+shot_adjust_y-actor.height/2;
  //do math (normalize vector) to get the x/y velocity that needs to be added per update
  actor.shot.direction_x = actor.shot.target_x - actor.pos_x;
  actor.shot.direction_y = actor.shot.target_y - actor.pos_y;
  var length = Math.sqrt(actor.shot.direction_x * actor.shot.direction_x + actor.shot.direction_y * actor.shot.direction_y);
  actor.shot.velocity_x = (actor.shot.direction_x / length) * actor.weapon.speed;
  actor.shot.velocity_y = (actor.shot.direction_y / length) * actor.weapon.speed;
}

//------------------------------------------------------------------------------
//UPDATE------------------------------------------------------------------------
//------------------------------------------------------------------------------

function update() {
  stepActor(char);
  stepBullet(char);
  for(i_enemies_update=0;i_enemies_update<enemy.length;i_enemies_update++) {
    stepActor(enemy[i_enemies_update]);
    stepBullet(enemy[i_enemies_update]);
  }
  stepWildlife();
  stepCamera();
  CollissionChecks();
}

function stepActor(actor) {
  //ACTOR POSITION
  if (!actor.stop) {
    if (actor.d_left) {
      actor.pos_x-=actor.speed;
    }
    if (actor.d_right) {
      actor.pos_x+=actor.speed;
    }
    if (actor.d_up) {
      actor.pos_y-=actor.speed;
    }
    if (actor.d_down) {
      actor.pos_y+=actor.speed;
    }
    if (!actor.d_left && !actor.d_right && !actor.d_up && !actor.d_down) {
      actor.stop = true;
    }
    actor.pos_x=clamp(actor.pos_x,0,map.width-sprite.chars_width);
    actor.pos_y=clamp(actor.pos_y,0,map.height-sprite.chars_height);
  }
  //ACTOR FOOTPRINTS
  if(actor.footprint.length == 0 ||
    Math.abs(actor.pos_x+sprite.chars_width/2 - actor.footprint[actor.footprint.length-1].pos_x) > footprints.offset || Math.abs(actor.pos_y+sprite.chars_height/2 - actor.footprint[actor.footprint.length-1].pos_y) > footprints.offset) {
    if (actor.footprint.length == 0 || Math.abs(actor.pos_x+sprite.chars_width/2 - actor.footprint[actor.footprint.length-1].pos_x) >= Math.abs(actor.pos_y+sprite.chars_height/2 - actor.footprint[actor.footprint.length-1].pos_y)) {
      actor.footprint.push({
        pos_x:actor.pos_x+sprite.chars_width/2,
        pos_y:actor.pos_y+sprite.chars_height/2,
        face:"left_right"
      });
    }
    else {
      actor.footprint.push({
        pos_x:actor.pos_x+sprite.chars_width/2,
        pos_y:actor.pos_y+sprite.chars_height/2,
        face:"up_down"
      });
    }
    var  arrLength = actor.footprint.length;
    if(arrLength > footprints.render_number){
      actor.footprint.splice( 0, arrLength - footprints.render_number);
      actor.footprint.splice( 0, arrLength - footprints.render_number);
    }
  }
  //CHAR FACE
  if (actor == char) {
    if (Math.abs(actor.target_x-actor.pos_x) < Math.abs(actor.target_y-actor.pos_y)) {
      if (actor.target_y < actor.pos_y) {
        actor.d_face="up";
      }
      else {
        actor.d_face="down";
      }
    }
    else {
      if (actor.target_x < actor.pos_x) {
        actor.d_face="left";
      }
      else {
        actor.d_face="right";
      }
    }
  }
}

function stepBullet(actor) {
  if (actor.shot.pos_x != null && actor.shot.pos_y != null) {
    actor.shot.pos_x+=actor.shot.velocity_x;
    actor.shot.pos_y+=actor.shot.velocity_y;
    if (actor.shot.pos_x < 0 || actor.shot.pos_x > map.width || actor.shot.pos_y < 0 || actor.shot.pos_y > map.height) {
      actor.shot.pos_x = null;
      actor.shot.pos_y = null;
    }
    for(i_check_col_obstacle=0;i_check_col_obstacle<spawn_nr_obstacles;i_check_col_obstacle++) {
      if(collCheck(actor.shot,obstacle[i_check_col_obstacle]) == true && obstacle[i_check_col_obstacle].bulletproof) {
        audio.hit_obstacle.play();
        actor.shot.pos_x = null;
        actor.shot.pos_y = null;
      }
    }
  }
}

function stepWildlife() {
  for(i_wildlife_update=0;i_wildlife_update<wildlife.length;i_wildlife_update++) {
    var x = roll(100);
    if (x < 5) {
      wildlife[i_wildlife_update].pos_y+=wildlife[i_wildlife_update].speed;
    }
    if (x >= 5 && x < 10) {
      wildlife[i_wildlife_update].pos_y-=wildlife[i_wildlife_update].speed;
    }
    if (x >= 10) {
      wildlife[i_wildlife_update].pos_x+=wildlife[i_wildlife_update].speed;
    }
    if (wildlife[i_wildlife_update].pos_x > map.width) {
      wildlife[i_wildlife_update].pos_x = 0;
      wildlife[i_wildlife_update].pos_y = roll(map.height);
    }
  }
}

function stepCamera() {
  //camera_view.pos_x = -char.pos_x+camera_view.width/2;
  //camera_view.pos_y = -char.pos_y+camera_view.height/2;
  camera_view.pos_x = clamp(-char.pos_x-char.width/2+camera_view.width/2, camera_view.width - map.width, 0);
  camera_view.pos_y = clamp(-char.pos_y-char.height/2+camera_view.height/2, camera_view.height - map.height, 0);
}

function CollissionChecks() {
  //CHECK CHAR AMMO PICKUP
  for (i_check_grave=0;i_check_grave<grave.length;i_check_grave++) {
    if(collCheck(char,grave[i_check_grave]) == true) {
      audio.ammo_pickup.play();
      char.weapon.ammo+=6;
      grave.splice(i_check_grave,1);
    }
  }
  //CHECK ENEMY HIT
  for (i_check_col_hit=0;i_check_col_hit<enemy.length;i_check_col_hit++) {
    if (now() - enemy[i_check_col_hit].hit_time_last > damage_cooldown) {
      enemy[i_check_col_hit].hit = false;
    }
    if (collCheck(char.shot,enemy[i_check_col_hit]) == true && !enemy[i_check_col_hit].hit) {
      enemy[i_check_col_hit].hit = true;
      enemy[i_check_col_hit].hit_time_last = now();
      audio.hit.play();
      char.shot.pos_x = null;
      char.shot.pos_y = null;
      enemy[i_check_col_hit].hp-=(char.weapon.dmg+char.grit);
      blood.pos_x.push(enemy[i_check_col_hit].pos_x);
      blood.pos_y.push(enemy[i_check_col_hit].pos_y);
      blood.sprite_x.push(roll(4)-1);
      blood.sprite_y.push(roll(4)-1);
    }
    //CHECK CHAR HIT
    if (now() - char.hit_time_last > damage_cooldown) {
      char.hit = false;
    }
    if (collCheck(enemy[i_check_col_hit].shot,char) == true) {
      char.hit = true;
      char.hit_time_last = now();
      audio.hit.play();
      enemy[i_check_col_hit].shot.pos_x = null;
      enemy[i_check_col_hit].shot.pos_y = null;
      char.hp-=enemy[i_check_col_hit].weapon.dmg;
      blood.pos_x.push(char.pos_x);
      blood.pos_y.push(char.pos_y);
      blood.sprite_x.push(roll(4)-1);
      blood.sprite_y.push(roll(4)-1);
      if (char.hp <= 0) {
        location.reload();
      }
    }
    //CHECK ENEMY HP
    if (enemy[i_check_col_hit].hp <= 0) {
      enemy[i_check_col_hit].stop = true;
      char.xp+=enemy[i_check_col_hit].xp;
      if (char.xp >= xp.next_level()) {
        audio.levelup.play();
        char.xp-= xp.level[char.level];
        char.level++;
        levelup_state = true;
        char.stats_unspent++;
      }
      grave.push({
        pos_x:enemy[i_check_col_hit].pos_x+enemy[i_check_col_hit].width/2,
        pos_y:enemy[i_check_col_hit].pos_y+enemy[i_check_col_hit].height/2,
        width:22,
        height:32
      });
      enemy.splice(i_check_col_hit,1);
    }
  }
}

//------------------------------------------------------------------------------
//RENDER------------------------------------------------------------------------
//------------------------------------------------------------------------------

function render() {
  ticks++;
  clearCamera();
  renderMap();
  renderHud();
  renderObstacles();
  renderGrave();
  renderBlood();
  renderActor("char",char,char.sprite_x,sprite_step);
  renderBullet(char);
  renderWildlife();
  for(i_enemies_render=0;i_enemies_render<enemy.length;i_enemies_render++) {
    renderActor("enemy",enemy[i_enemies_render],enemy[i_enemies_render].sprite_x,sprite_step);
    renderBullet(enemy[i_enemies_render]);
    renderHP(enemy[i_enemies_render]);
  }
  clearTicks();
}

function clearTicks() {
  if (ticks == sprite_per_tick) {
    sprite_step++;
    if (sprite_step == 3) {
      sprite_step = 0;
    }
    ticks = 0;
  }
}

function clearCamera() {
  let canvas = document.getElementById("bullets");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,camera_view.width,camera_view.height);
  canvas = document.getElementById("grave");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,camera_view.width,camera_view.height);
  canvas = document.getElementById("hp");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,camera_view.width,camera_view.height);
  canvas = document.getElementById("enemy");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,camera_view.width,camera_view.height);
  canvas = document.getElementById("char");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,camera_view.width,camera_view.height);
  canvas = document.getElementById("obstacles");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,camera_view.width,camera_view.height);
  canvas = document.getElementById("map");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,camera_view.width,camera_view.height);
}

function renderMap() {
  let canvas = document.getElementById("map");
  let ctx = canvas.getContext("2d");
  let start_col = Math.floor(-camera_view.pos_y/sprite.map_height);
  let start_row = Math.floor(-camera_view.pos_x/sprite.map_width);
  let end_col = start_col+Math.ceil(camera_view.height/sprite.map_height);
  let end_row = start_row+Math.ceil(camera_view.width/sprite.map_width);
  for(i_col_nr=start_col;i_col_nr<=end_col;i_col_nr++) {
    for(i_row_nr=start_row;i_row_nr<=end_row;i_row_nr++) {
      switch(map.data[((i_col_nr*map.width/sprite.map_width)+i_row_nr)]) {
        case 0:
        ctx.drawImage(images.desert,0,0,sprite.map_width,sprite.map_height,i_row_nr*sprite.map_width+camera_view.pos_x,i_col_nr*sprite.map_height+camera_view.pos_y,sprite.map_width,sprite.map_height);
        break;
        case 1:
        ctx.drawImage(images.desert,0,40,sprite.map_width,sprite.map_height,i_row_nr*sprite.map_width+camera_view.pos_x,i_col_nr*sprite.map_height+camera_view.pos_y,sprite.map_width,sprite.map_height);
        break;
        case 2:
        ctx.drawImage(images.desert,0,80,sprite.map_width,sprite.map_height,i_row_nr*sprite.map_width+camera_view.pos_x,i_col_nr*sprite.map_height+camera_view.pos_y,sprite.map_width,sprite.map_height);
        break;
        case 3:
        ctx.drawImage(images.desert,0,120,sprite.map_width,sprite.map_height,i_row_nr*sprite.map_width+camera_view.pos_x,i_col_nr*sprite.map_height+camera_view.pos_y,sprite.map_width,sprite.map_height);
        break;
      }
    }
  }

}

function renderObstacles() {
  let canvas = document.getElementById("obstacles");
  let ctx = canvas.getContext("2d");
  for (i_spawn_obstacles=0;i_spawn_obstacles<spawn_nr_obstacles;i_spawn_obstacles++) {
      ctx.drawImage(obstacle[i_spawn_obstacles].image,obstacle[i_spawn_obstacles].pos_x+camera_view.pos_x,obstacle[i_spawn_obstacles].pos_y+camera_view.pos_y, obstacle[i_spawn_obstacles].width, obstacle[i_spawn_obstacles].height);
  }
}

function renderActor(actor_canvas,actor,sprite_x,sprite_step) {
  let canvas = document.getElementById(actor_canvas);
  let ctx = canvas.getContext("2d");
  //ACTOR FOOTPRINTS
  for(i_footprint=0;i_footprint<actor.footprint.length;i_footprint++) {
    var footprint_y;
    var footprint_x = 0;
    if (actor.footprint[i_footprint].face == "left_right") {
      footprint_y = footprints.footprints_y_left_right
    }
    if (actor.footprint[i_footprint].face == "up_down") {
      footprint_y = footprints.footprints_y_up_down
    }
    if (i_footprint<5) {
      footprint_x = 1;
    }
    if (i_footprint<3) {
      footprint_x = 2;
    }
    ctx.drawImage(images.footprints,footprint_x*sprite.footprint_width,footprint_y*sprite.footprint_height,sprite.footprint_width,sprite.footprint_height,actor.footprint[i_footprint].pos_x+camera_view.pos_x,actor.footprint[i_footprint].pos_y+camera_view.pos_y+15,sprite.footprint_width,sprite.footprint_height);
  }
  //ACTOR MODEL
  var sprite_y;
  if (actor.d_face == "left") {
    sprite_y = actor.sprite_y_left
  }
  if (actor.d_face == "right") {
    sprite_y = actor.sprite_y_right
  }
  if (actor.d_face == "up") {
    sprite_y = actor.sprite_y_up
  }
  if (actor.d_face == "down") {
    sprite_y = actor.sprite_y_down
  }
  if (!actor.stop) {
    sprite_x+=sprite_step;
  }
  if (actor.hit) {
    ctx.fillStyle = hp_bar.color_dmg;
    ctx.font = "bold 12px Rye";
    if (actor != char) {
      ctx.fillText(-(char.weapon.dmg+char.grit),actor.pos_x+camera_view.pos_x+actor.width,actor.pos_y+camera_view.pos_y-hp_bar.dmg_offset_y);
    }
    ctx.save();
    var dx = Math.random()*10;
    var dy = Math.random()*10;
    ctx.translate(dx, dy);
  }
  ctx.drawImage(images.chars1,sprite_x*sprite.chars_width,sprite_y*sprite.chars_height,sprite.chars_width,sprite.chars_height,actor.pos_x+camera_view.pos_x,actor.pos_y+camera_view.pos_y,sprite.chars_width,sprite.chars_height);
  if (actor.hit) {
    ctx.restore();
  }
}

function renderBullet(actor) {
  let canvas = document.getElementById("bullets");
  let ctx = canvas.getContext("2d");
  if (actor.shot.pos_x != null && actor.shot.pos_y != null) {
    ctx.fillStyle="black";
    ctx.fillRect(actor.shot.pos_x+camera_view.pos_x,actor.shot.pos_y+camera_view.pos_y,actor.shot.width,actor.shot.height);
  }
}

function renderHP(actor) {
  let canvas = document.getElementById("hp");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle=hp_bar.color_life;
  ctx.fillRect(actor.pos_x+camera_view.pos_x, actor.pos_y-hp_bar.pos_y+camera_view.pos_y,actor.width,hp_bar.height);
  ctx.fillStyle=hp_bar.color_dmg;
  ctx.fillRect(actor.pos_x+actor.width+camera_view.pos_x, actor.pos_y-hp_bar.pos_y+camera_view.pos_y,-actor.width/actor.hp_max*(actor.hp_max-actor.hp),hp_bar.height);
}

function renderBlood() {
  if (blood.pos_x.length > 0) {
    let canvas = document.getElementById("blood");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,camera_view.width,camera_view.height);
    for(i_blood=0;i_blood<blood.pos_x.length;i_blood++) {
      ctx.drawImage(images.blood,blood.sprite_x[i_blood]*sprite.blood_width,blood.sprite_y[i_blood]*sprite.blood_height,sprite.blood_width,sprite.blood_height,blood.pos_x[i_blood]+camera_view.pos_x,blood.pos_y[i_blood]+camera_view.pos_y,128,128)
    }
  }
}

function renderGrave() {
  if (grave.length > 0) {
    let canvas = document.getElementById("grave");
    let ctx = canvas.getContext("2d");
    for(i_grave=0;i_grave<grave.length;i_grave++) {
      ctx.drawImage(images.grave,grave[i_grave].pos_x+camera_view.pos_x,grave[i_grave].pos_y+camera_view.pos_y,sprite.grave_width,sprite.grave_height)
    }
  }
}

function renderWildlife() {
  let canvas = document.getElementById("obstacles");
  let ctx = canvas.getContext("2d");
  for(i_wildlife=0;i_wildlife<wildlife.length;i_wildlife++) {
    ctx.drawImage(images.scorpion,wildlife[i_wildlife].pos_x+camera_view.pos_x,wildlife[i_wildlife].pos_y+camera_view.pos_y,wildlife[i_wildlife].width,wildlife[i_wildlife].height);
  }
}

//------------------------------------------------------------------------------
//GAME LOOP---------------------------------------------------------------------
//------------------------------------------------------------------------------

function game_loop() {
  if (game_state == 0) {
    preLoad();
  }
  else if (game_state == 1) {
    input();
    update();
    render();
  }
  requestAnimationFrame(game_loop);
}

requestAnimationFrame(game_loop);
