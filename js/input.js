
document.addEventListener("keydown",function(e) {
  e.preventDefault(); //prevent default for keyCode
  if (e.keyCode == 65) { //65 = keyCode for [a]
    char.stop = false;
    char.d_left = true;
  }
  if (e.keyCode == 68) { //68 = keyCode for [d]
    char.stop = false;
    char.d_right = true;
  }
  if (e.keyCode == 87) { //87 = keyCode for [w]
    char.stop = false;
    char.d_up = true;
  }
  if (e.keyCode == 83) { //83 = keyCode for [s]
    char.stop = false;
    char.d_down = true;
  }
  if (e.keyCode == 82) { //83 = keyCode for [r]
    if (!reload_state) {
    reload_state = true;
    char.weapon.reload();
    }
  }
  if (e.keyCode == 67) { //67 = keyCode for [c]
    toggle("hud_char_menu",true);
  }
});
document.addEventListener("keyup",function(e) {
  if (e.keyCode == 65) { //65 = keyCode for [a]
    char.d_left = false;
  }
  if (e.keyCode == 68) { //68 = keyCode for [d]
    char.d_right = false;
  }
  if (e.keyCode == 87) { //87 = keyCode for [w]
    char.d_up = false;
  }
  if (e.keyCode == 83) { //83 = keyCode for [s]
    char.d_down = false;
  }
  if (e.keyCode == 82) { //83 = keyCode for [r]
    reload_state = false;
  }
});
document.addEventListener("mousemove",function(e) {
  e.preventDefault(); //prevent default for mouseover
  char.target_x = -camera_view.pos_x+e.clientX;
  char.target_y = -camera_view.pos_y+e.clientY;
});
document.addEventListener("click",function(e) {
  e.preventDefault(); //prevent default for click
  if (now() - char.shot.time_last > char.weapon.cooldown && !menu_state) {
    if (char.weapon.magazine > 0) {
      char.shot.time_last = now();
      char.weapon.sound();
      shoot(char,-camera_view.pos_x+e.clientX,-camera_view.pos_y+e.clientY);
    }
    else {
      empty_magazine_sfx.play();
    }
  }
});
