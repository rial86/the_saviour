function showWeaponSkillMsg() {
    document.getElementById("hud_mouseover").style.display = "block";
    document.getElementById("hud_mouseover").innerHTML = "Increase SKILL stat to unlock weapon upgrades";
}

function hideWeaponSkillMsg() {
  document.getElementById("hud_mouseover").style.display = "";
  document.getElementById("hud_mouseover").innerHTML = "";
}

function renderHud() {
  //SETTINGS
  document.getElementById("game").style.cursor = cursor_type.shoot;
  document.getElementById("hud_mouseover").style.left = char.target_x+camera_view.pos_x+10+'px';
  document.getElementById("hud_mouseover").style.top = char.target_y+camera_view.pos_y+'px';
  //HUD TOP
  document.getElementById("hud_alert").innerHTML = "";
  if (char.weapon.magazine == 0) {
    document.getElementById("hud_alert").innerHTML = "RELOAD";
    document.getElementById("game").style.cursor = cursor_type.reload;
  }
  //HUD CHAR MENU
  document.getElementById("hud_char_menu").addEventListener("mouseover",function() {
    document.getElementById("hud_char_menu").style.cursor = cursor_type.select;
  });
  document.getElementById("hud_char_menu").addEventListener("mouseout",function() {
    document.getElementById("game").style.cursor = cursor_type.shoot;
  });
  document.getElementById("hud_char_menu_name").innerHTML = char.name;
  document.getElementById("hud_char_menu_level").innerHTML = "LVL"+char.level;
  document.getElementById("hud_char_menu_level_points").innerHTML = char.stats_unspent;
  document.getElementById("hud_char_menu_level_points").addEventListener("mouseover", function() {
    document.getElementById("hud_mouseover").style.display = "block";
    document.getElementById("hud_mouseover").innerHTML = "Available stat points";
  });
  document.getElementById("hud_char_menu_level_points").addEventListener("mouseout", function() {
    document.getElementById("hud_mouseover").innerHTML = "";
    document.getElementById("hud_mouseover").style.display = "none";
  });
  document.getElementById("hud_char_menu_stats").addEventListener("mouseover", function() {
    document.getElementById("hud_mouseover").style.display = "block";
  });
  document.getElementById("hud_char_menu_stats").addEventListener("mouseout", function() {
    document.getElementById("hud_mouseover").style.display = "none";
  });
  document.getElementById("hud_char_menu_weapon_points").innerHTML = char.weapon_upgrade_unspent;
  document.getElementById("hud_char_menu_weapon_points").addEventListener("mouseover", function() {
    document.getElementById("hud_mouseover").style.display = "block";
  });
  document.getElementById("hud_char_menu_weapon_points").addEventListener("mouseout", function() {
    document.getElementById("hud_mouseover").style.display = "none";
  });
  document.getElementById("hud_char_menu_stat_vit_value").innerHTML = char.vitality;
  document.getElementById("hud_char_menu_stat_vit").addEventListener("mouseover", function () {
      document.getElementById("hud_mouseover").innerHTML = "Increase VITALITY to gain more Hitpoints";
  });
  document.getElementById("hud_char_menu_stat_vit").addEventListener("mouseout", function () {
      document.getElementById("hud_mouseover").innerHTML = "";
  });
  document.getElementById("hud_char_menu_stat_grt_value").innerHTML = char.grit;
  document.getElementById("hud_char_menu_stat_grt").addEventListener("mouseover", function () {
      document.getElementById("hud_mouseover").innerHTML = "GRIT determines the amount of damage you deal";
  });
  document.getElementById("hud_char_menu_stat_grt").addEventListener("mouseout", function () {
      document.getElementById("hud_mouseover").innerHTML = "";
  });
  document.getElementById("hud_char_menu_stat_quk_value").innerHTML = char.quickness;
  document.getElementById("hud_char_menu_stat_quk").addEventListener("mouseover", function () {
      document.getElementById("hud_mouseover").innerHTML = "A higher QUICKNESS results in higher movement speed";
  });
  document.getElementById("hud_char_menu_stat_quk").addEventListener("mouseout", function () {
      document.getElementById("hud_mouseover").innerHTML = "";
  });
  document.getElementById("hud_char_menu_stat_acc_value").innerHTML = char.accuracy;
  document.getElementById("hud_char_menu_stat_acc").addEventListener("mouseover", function () {
      document.getElementById("hud_mouseover").innerHTML = "More ACCURACY means less weapon spread";
  });
  document.getElementById("hud_char_menu_stat_acc").addEventListener("mouseout", function () {
      document.getElementById("hud_mouseover").innerHTML = "";
  });
  document.getElementById("hud_char_menu_stat_skl_value").innerHTML = char.skill;
  document.getElementById("hud_char_menu_stat_skl").addEventListener("mouseover", function () {
      document.getElementById("hud_mouseover").innerHTML = "For each SKILL point you receive one weapon upgrade point";
  });
  document.getElementById("hud_char_menu_stat_skl").addEventListener("mouseout", function () {
      document.getElementById("hud_mouseover").innerHTML = "";
  });
  document.getElementById("hud_char_menu_level_points").style.display = "none";
  for(i_hud_statup=0;i_hud_statup<5;i_hud_statup++) {
    document.getElementsByClassName("levelup_stat")[i_hud_statup].style.display = "none";
  }
  document.getElementById("hud_char_menu_weapon_points").style.display = "none";
  if(char.skill == 0) {
    document.getElementById("hud_char_menu_weapon").addEventListener("mouseover",showWeaponSkillMsg)
    document.getElementById("hud_char_menu_weapon").addEventListener("mouseout",hideWeaponSkillMsg)
  }
  if(char.skill > 0) {
    document.getElementById("hud_char_menu_weapon").removeEventListener("mouseover",showWeaponSkillMsg)
    document.getElementById("hud_char_menu_weapon").removeEventListener("mouseout",hideWeaponSkillMsg)
  }
  //CHAR MENU WHILE STATUP
  if(char.stats_unspent > 0) {
    levelup_state = true;
    document.getElementById("hud_char_menu_level_points").style.display = "initial";
    if (char.vitality < max_vitality) {
      document.getElementsByClassName("levelup_stat")[0].style.display = "initial";
    }
    if (char.grit < max_grit) {
      document.getElementsByClassName("levelup_stat")[1].style.display = "initial";
    }
    if (char.quickness < max_quickness) {
      document.getElementsByClassName("levelup_stat")[2].style.display = "initial";
    }
    if (char.accuracy < max_accuracy) {
      document.getElementsByClassName("levelup_stat")[3].style.display = "initial";
    }
    if (char.skill < max_skill) {
      document.getElementsByClassName("levelup_stat")[4].style.display = "initial";
    }
    document.getElementById("levelup_vit").addEventListener("click", function() {
      if (levelup_state) {
        levelup_state = false;
        char.stats_unspent--;
        char.vitality++;
        char.hp++;
      }
    });
    document.getElementById("levelup_grt").addEventListener("click", function() {
      if (levelup_state) {
        levelup_state = false;
        char.stats_unspent--;
        char.grit++;
      }
    });
    document.getElementById("levelup_quk").addEventListener("click", function() {
      if (levelup_state) {
        levelup_state = false;
        char.stats_unspent--;
        char.quickness++;
        char.speed++;
      }
    });
    document.getElementById("levelup_acc").addEventListener("click", function() {
      if (levelup_state) {
        levelup_state = false;
        char.stats_unspent--;
        char.accuracy++;
      }
    });
    document.getElementById("levelup_skl").addEventListener("click", function() {
      if (levelup_state) {
        levelup_state = false;
        char.stats_unspent--;
        char.skill++;
        char.weapon_upgrade_unspent++;
      }
    });
  }
  //CHAR MENU WHILE WEAPON UPGRADE POSSIBLE
  if(char.weapon_upgrade_unspent > 0) {
    weapon_upgrade_state = true;
    document.getElementById("hud_char_menu_weapon_points").style.display = "initial";
    document.getElementById("hud_char_menu_weapon_points").addEventListener("mouseover", function () {
        document.getElementById("hud_mouseover").innerHTML = "Available weapon points";
    });
    document.getElementById("hud_char_menu_weapon_points").addEventListener("mouseout", function () {
        document.getElementById("hud_mouseover").innerHTML = "";
    });
    for (i_weapon_mods=0;i_weapon_mods<5;i_weapon_mods++) {
    document.getElementsByClassName("weapon_mod")[i_weapon_mods].addEventListener("mouseover", function () {
      document.getElementById("hud_mouseover").style.display = "block";
    });
    }
    for (i_weapon_mods=0;i_weapon_mods<5;i_weapon_mods++) {
    document.getElementsByClassName("weapon_mod")[i_weapon_mods].addEventListener("mouseout", function () {
      document.getElementById("hud_mouseover").style.display = "none";
    });
    }
    document.getElementById("weapon_mod_bolt").addEventListener("mouseover", function () {
        document.getElementById("hud_mouseover").innerHTML = "Doubles your fire rate";
    });
    document.getElementById("weapon_mod_bolt").addEventListener("mouseout", function () {
        document.getElementById("hud_mouseover").innerHTML = "";
    });
    document.getElementById("weapon_mod_grip").addEventListener("mouseover", function () {
        document.getElementById("hud_mouseover").innerHTML = "5% chance for double damage";
    });
    document.getElementById("weapon_mod_grip").addEventListener("mouseout", function () {
        document.getElementById("hud_mouseover").innerHTML = "";
    });
    document.getElementById("weapon_mod_frame").addEventListener("mouseover", function () {
        document.getElementById("hud_mouseover").innerHTML = "Higher damage per shot";
    });
    document.getElementById("weapon_mod_frame").addEventListener("mouseout", function () {
        document.getElementById("hud_mouseover").innerHTML = "";
    });
    document.getElementById("weapon_mod_barrel").addEventListener("mouseover", function () {
        document.getElementById("hud_mouseover").innerHTML = "Spreads your shot with multiple bullets";
    });
    document.getElementById("weapon_mod_barrel").addEventListener("mouseout", function () {
        document.getElementById("hud_mouseover").innerHTML = "";
    });
    document.getElementById("weapon_mod_second").addEventListener("mouseover", function () {
        document.getElementById("hud_mouseover").innerHTML = "Fire 2 bullets instead of 1";
    });
    document.getElementById("weapon_mod_second").addEventListener("mouseout", function () {
        document.getElementById("hud_mouseover").innerHTML = "";
    });
    document.getElementById("weapon_mod_bolt").addEventListener("click", function() {
      if (weapon_upgrade_state && !char.weapon.mod_bolt_status) {
        weapon_upgrade_state = false;
        document.getElementById("weapon_mod_bolt").classList.add("weapon_mod_active");
        char.weapon_upgrade_unspent--;
        char.weapon.mod_bolt_status = true;
      }
    });
    document.getElementById("weapon_mod_grip").addEventListener("click", function() {
      if (weapon_upgrade_state && !char.weapon.mod_grip_status) {
        weapon_upgrade_state = false;
        document.getElementById("weapon_mod_grip").classList.add("weapon_mod_active");
        char.weapon_upgrade_unspent--;
        char.weapon.mod_grip_status = true;
      }
    });
    document.getElementById("weapon_mod_frame").addEventListener("click", function() {
      if (weapon_upgrade_state && !char.weapon.mod_frame_status) {
        weapon_upgrade_state = false;
        document.getElementById("weapon_mod_frame").classList.add("weapon_mod_active");
        char.weapon_upgrade_unspent--;
        char.weapon.mod_frame_status = true;
      }
    });
    document.getElementById("weapon_mod_barrel").addEventListener("click", function() {
      if (weapon_upgrade_state && !char.weapon.mod_barrel_status) {
        weapon_upgrade_state = false;
        document.getElementById("weapon_mod_barrel").classList.add("weapon_mod_active");
        char.weapon_upgrade_unspent--;
        char.weapon.mod_barrel_status = true;
      }
    });
    document.getElementById("weapon_mod_second").addEventListener("click", function() {
      if (weapon_upgrade_state && !char.weapon.mod_second_status) {
        weapon_upgrade_state = false;
        document.getElementById("weapon_mod_second").classList.add("weapon_mod_active");
        char.weapon_upgrade_unspent--;
        char.weapon.mod_second_status = true;
      }
    });
  }
  //HUD BOTTOM
  document.getElementById("hud_hp_icons").innerHTML = "";
  for(i_hud_hp=0;i_hud_hp<char.hp;i_hud_hp++) {
    img = new Image();
    img.src = images.hp_full.src;
    document.getElementById("hud_hp_icons").appendChild(img);
  }
  for(i_hud_hp=0;i_hud_hp<char.hp_max()-char.hp;i_hud_hp++) {
    img = new Image();
    img.src = images.hp_empty.src;
    document.getElementById("hud_hp_icons").appendChild(img);
  }
  document.getElementById("hud_ammo").innerHTML ="AMMO: "+char.weapon.ammo+" | "+"WEAPON: "+char.weapon.magazine+"/"+char.weapon.magazine_size;
  document.getElementById("hud_xp").innerHTML = "<div id='hud_xp_bar_outer'><div id='hud_xp_bar_inner' style='width:"+(char.xp/xp.next_level())*100+"%'>"+"LEVEL"+char.level+"&nbsp("+char.xp+"/"+xp.next_level()+")</div></div>";
  if(char.stats_unspent > 0) {
    document.getElementById("hud_xp").innerHTML = "<div id='hud_xp_bar_outer'><div id='hud_xp_bar_inner' style='width:"+(char.xp/xp.next_level())*100+"%'>"+"LEVEL"+char.level+"&nbsp("+char.xp+"/"+xp.next_level()+")&nbsp[+]</div></div>";
    document.getElementById("hud_xp_bar_outer").style.border = "1px solid #FFC300";
    document.getElementById("hud_xp_bar_inner").style.color = "#FFC300";
  }
}
