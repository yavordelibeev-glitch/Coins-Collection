"use strict";

const game = new Phaser.Game(1800, 800, Phaser.AUTO, "game-canvas", {
  preload: preload,
  create: create,
  update: update
});

let dude;
let bg;
let backgroundMusic;
let score = 0;
let plat;
let coins;
let w, a, d;
let cursors;
let fKey, mKey, spaceBar;
let buttonStates = { left: false, right: false, jump: false };
let isGameOver = false;
let isStarted = false;
let musicOn = true;

let startButton;
let titleText;
let musicToggle;
let fullScreenButton;
let alertText;

let currentLevel = 1;

let addNew = true;
let addNew1 = true;
let addNew2 = true;
let addNew3 = true;
let addNew4 = true;
let addNew6 = true;
let addNew7 = true;
let addNew8 = true;
let addNew9 = true;
let addNew10 = true;
let addNew11 = true;
let addNew12 = true;
let addNew13 = true;

const levelConfigs = {
  1: {
    platforms: [
      { x: 100, y: 250 }, { x: 500, y: 470 }, { x: 1000, y: 350 }, { x: 1600, y: 480 },
      { x: 1600, y: 200 }, { x: 2000, y: 350 }, { x: 2600, y: 150 }, { x: 3200, y: 300 },
      { x: 2900, y: 480 }, { x: 3900, y: 300 }, { x: 4500, y: 100 }, { x: 4700, y: 400 }, { x: 5400, y: 400 }
    ]
  },
  2: {
    platforms: [
      { x: 100, y: 250 },
      { x: 600, y: 450, isMoving: true, minX: 400, maxX: 900, speed: 4 },
      { x: 1100, y: 300, isMoving: true, minX: 900, maxX: 1400, speed: -4 },
      { x: 1600, y: 500 },
      { x: 2100, y: 250, isMoving: true, minX: 1800, maxX: 2400, speed: 5 },
      { x: 2700, y: 400 },
      { x: 3300, y: 300, isMoving: true, minX: 3000, maxX: 3600, speed: -4 },
      { x: 3900, y: 200 },
      { x: 4400, y: 450, isMoving: true, minX: 4100, maxX: 4800, speed: 6 },
      { x: 5000, y: 300 },
      { x: 5400, y: 400 }
    ]
  },
  3: {
    platforms: [
      { x: 100, y: 300 }, { x: 450, y: 200 }, { x: 850, y: 450 }, { x: 1250, y: 250 },
      { x: 1650, y: 400 }, { x: 2100, y: 150 }, { x: 2500, y: 350 }, { x: 2950, y: 500 },
      { x: 3400, y: 250 }, { x: 3900, y: 400 }, { x: 4400, y: 150 }, { x: 4900, y: 350 }, { x: 5400, y: 300 }
    ]
  }
};

function preload() {
  game.load.image("bg", "desert.png");
  game.load.spritesheet("dude", "dude-org.288x48.9x1.png", 32, 48);
  game.load.image("plat", "platform.png");
  game.load.spritesheet("coin", "coin.png", 1198 / 5, 704 / 2);
  game.load.audio("backgroundSound", "background sound.mp3");
}

function create() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  game.world.setBounds(0, 0, 6000, 800);
  game.physics.startSystem(Phaser.Physics.ARCADE);

  bg = game.add.tileSprite(0, 0, 6000, 800, "bg");

  dude = game.add.sprite(100, 50, "dude");
  game.physics.arcade.enable(dude);
  dude.body.gravity.y = 0;
  dude.visible = false;

  dude.animations.add("left", [0, 1, 2, 3], 10, true);
  dude.animations.add("right", [5, 6, 7, 8], 10, true);

  platforma();
  moneta();

  backgroundMusic = game.add.audio("backgroundSound");
  backgroundMusic.loop = true;

  alertText = game.add.text(900, 400, "", {
    font: "bold 80px Arial",
    fill: "#f39c12"
  });
  alertText.anchor.setTo(0.5);
  alertText.fixedToCamera = true;
  alertText.visible = false;

  titleText = game.add.text(900, 250, "DESERT CLIMBER", {
    font: "bold 100px Arial",
    fill: "#ffffff"
  });
  titleText.anchor.setTo(0.5);
  titleText.fixedToCamera = true;

  startButton = game.add.text(900, 450, "START GAME", {
    font: "60px Arial",
    fill: "#00ff00",
    backgroundColor: "rgba(0,0,0,0.5)"
  });
  startButton.anchor.setTo(0.5);
  startButton.inputEnabled = true;
  startButton.fixedToCamera = true;
  startButton.events.onInputDown.add(startGame);

  fullScreenButton = game.add.text(900, 580, "GO FULLSCREEN (F)", {
    font: "40px Arial",
    fill: "#ffff00",
    backgroundColor: "rgba(0,0,0,0.5)"
  });
  fullScreenButton.anchor.setTo(0.5);
  fullScreenButton.inputEnabled = true;
  fullScreenButton.fixedToCamera = true;
  fullScreenButton.events.onInputDown.add(goFull);

  musicToggle = game.add.text(1750, 50, "MUSIC: ON (M)", {
    font: "30px Arial",
    fill: "#ffffff"
  });
  musicToggle.anchor.setTo(1, 0);
  musicToggle.inputEnabled = true;
  musicToggle.fixedToCamera = true;
  musicToggle.events.onInputDown.add(toggleMusic);

  w = game.input.keyboard.addKey(Phaser.Keyboard.W);
  a = game.input.keyboard.addKey(Phaser.Keyboard.A);
  d = game.input.keyboard.addKey(Phaser.Keyboard.D);
  cursors = game.input.keyboard.createCursorKeys();
  fKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
  mKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
  spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  fKey.onDown.add(goFull);
  mKey.onDown.add(toggleMusic);
  spaceBar.onDown.add(startGame);
}

function showAlert(message) {
  alertText.text = message;
  alertText.visible = true;
  game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
    alertText.visible = false;
  });
}

function goFull() {
  if (game.scale.isFullScreen) {
    game.scale.stopFullScreen();
  } else {
    game.scale.startFullScreen(false);
  }
}

function startGame() {
  if (isStarted) return;

  isStarted = true;
  dude.visible = true;
  dude.body.gravity.y = 1000;
  titleText.visible = false;
  startButton.visible = false;
  fullScreenButton.visible = false;
  if (musicOn) backgroundMusic.play();
  setupMobileButtons();
  game.camera.follow(dude);
}

function toggleMusic() {
  musicOn = !musicOn;
  musicToggle.text = musicOn ? "MUSIC: ON (M)" : "MUSIC: OFF (M)";
  if (isStarted) {
    if (musicOn) backgroundMusic.play();
    else backgroundMusic.stop();
  }
}

function update() {
  if (!isStarted || isGameOver) return;
  game.physics.arcade.collide(dude, plat);
  game.physics.arcade.overlap(dude, coins, collectCoin, null, this);
  
  if (dude.y > 800) {
    game.canvas.style.transform = "none";
    showGameOver();
  }
  handleLevels();
  handleMovement();
  updateMovingPlatforms();
}

function updateMovingPlatforms() {
  plat.forEach(function(p) {
    if (p.isMovingObj) {
      p.x += p.moveSpeed;

      if (p.x >= p.maxX) {
        p.x = p.maxX;
        p.moveSpeed *= -1;
      } else if (p.x <= p.minX) {
        p.x = p.minX;
        p.moveSpeed *= -1;
      }

      if (game.physics.arcade.collide(dude, p) && dude.body.touching.down) {
        dude.x += p.moveSpeed;
      }
    }
  });
}

function showGameOver() {
  isGameOver = true;
  dude.kill();
  backgroundMusic.stop();
  
  let goText = game.add.text(game.camera.x + 900, 300, "GAME OVER", {
    font: "80px Arial",
    fill: "#ff0000"
  });
  goText.anchor.setTo(0.5);
  
  let restText = game.add.text(game.camera.x + 900, 450, "CLICK TO RESTART", {
    font: "50px Arial",
    fill: "#ffffff"
  });
  restText.anchor.setTo(0.5);
  restText.inputEnabled = true;
  restText.events.onInputDown.add(function() {
    location.reload();
  });
}

function handleMovement() {
  let isLeft = a.isDown || cursors.left.isDown || buttonStates.left;
  let isRight = d.isDown || cursors.right.isDown || buttonStates.right;
  let isJump = w.isDown || cursors.up.isDown || buttonStates.jump;

  if (score === 0) showAlert("SPEED UP!");
  if (score === 10) showAlert("LOW GRAVITY!");
  if (score === 16) showAlert("TINY MODE!");
  if (score === 23) showAlert("CONTROLS SWITCHED!");

  if (currentLevel === 1 && score >= 23 && score < 25) {
    let temp = isLeft;
    isLeft = isRight;
    isRight = temp;
  }

  let speed = score < 4 ? 500 : 250;

  dude.body.gravity.y = (score >= 10 && score < 14) ? 200 : 1000;

  if (score >= 16 && score < 20) {
    dude.scale.setTo(0.5, 0.5);
  } else {
    dude.scale.setTo(1, 1);
  }

  if (isLeft) {
    dude.body.velocity.x = -speed;
    dude.animations.play("left");
    bg.tilePosition.x += 2;
  } else if (isRight) {
    dude.body.velocity.x = speed;
    dude.animations.play("right");
    bg.tilePosition.x -= 2;
  } else {
    dude.body.velocity.x = 0;
    dude.animations.stop();
    dude.frame = 4;
  }

  if (isJump && dude.body.touching.down) {
    dude.body.velocity.y = -700;
  }
}

function platforma() {
  if (plat) plat.destroy();
  
  plat = game.add.group();
  plat.enableBody = true;
  
  const points = levelConfigs[currentLevel].platforms;
  points.forEach(function(p) {
    let obj = plat.create(p.x, p.y, "plat");
    obj.scale.setTo(0.5);
    obj.body.immovable = true;
    
    if (p.isMoving) {
      obj.isMovingObj = true;
      obj.minX = p.minX;
      obj.maxX = p.maxX;
      obj.moveSpeed = p.speed;
    }
  });
}

function moneta() {
  if (coins) coins.destroy();
  coins = game.add.group();
  coins.enableBody = true;

  if (currentLevel === 1) {
    createCoin(200, 180);
    createCoin(400, 180);
  } else {
    const currentPlatforms = levelConfigs[currentLevel].platforms;
    if (currentPlatforms[0]) createCoin(currentPlatforms[0].x + 50, currentPlatforms[0].y - 70);
    if (currentPlatforms[0]) createCoin(currentPlatforms[0].x + 350, currentPlatforms[0].y - 70);
  }
}

function createCoin(x, y) {
  let c = coins.create(x, y, "coin");
  c.animations.add("spin", [], 10, true);
  c.animations.play("spin");
  c.scale.setTo(0.2);
  return c;
}

function applyScreenEffects() {
  // FIXED: Confusing vertical inversion completely removed for Level 3
  if (currentLevel === 3) {
    game.canvas.style.transform = "none"; 
    showAlert("LEVEL 3: MOVING MAZE!");
  } else {
    game.canvas.style.transform = "none";
  }
}

function handleLevels() {
  const currentPlatforms = levelConfigs[currentLevel].platforms;

  if (currentLevel === 2 && score === 4) {
    game.canvas.style.transform = "scaleX(-1)";
    showAlert("LEVEL 2: MIRROR WORLD!");
  }

  if (currentLevel === 1) {
    if (score == 2 && addNew) { createCoin(550, 400); createCoin(850, 400); addNew = false; }
    if (score == 4 && addNew1) { createCoin(1050, 280); createCoin(1350, 280); addNew1 = false; }
    if (score == 6 && addNew2) { createCoin(1650, 400); createCoin(1950, 400); addNew2 = false; }
    if (score == 8 && addNew3) { createCoin(1650, 120); createCoin(1950, 120); addNew3 = false; }
    if (score == 10 && addNew4) { createCoin(2050, 255); createCoin(2350, 255); addNew4 = false; }
    if (score == 12 && addNew6) { createCoin(2650, 60); createCoin(2950, 60); addNew6 = false; }
    if (score == 14 && addNew7) { createCoin(3250, 200); createCoin(3500, 200); addNew7 = false; }
    if (score == 16 && addNew8) { createCoin(2950, 400); createCoin(3250, 400); addNew8 = false; }
    if (score == 18 && addNew9) { createCoin(3950, 240); createCoin(4250, 240); addNew9 = false; }
    if (score == 20 && addNew10) { createCoin(4550, 55); createCoin(4850, 55); addNew10 = false; }
    if (score == 22 && addNew11) { createCoin(4750, 300); createCoin(5050, 300); addNew11 = false; }
  } else {
    if (score == 2 && addNew) {
      if (currentPlatforms[1]) createCoin(currentPlatforms[1].x + 50, currentPlatforms[1].y - 70);
      if (currentPlatforms[1]) createCoin(currentPlatforms[1].x + 350, currentPlatforms[1].y - 70);
      addNew = false;
    }
    if (score == 4 && addNew1) {
      if (currentPlatforms[2]) createCoin(currentPlatforms[2].x + 50, currentPlatforms[2].y - 70);
      if (currentPlatforms[2]) createCoin(currentPlatforms[2].x + 350, currentPlatforms[2].y - 70);
      addNew1 = false;
    }
    if (score == 6 && addNew2) {
      if (currentPlatforms[3]) createCoin(currentPlatforms[3].x + 50, currentPlatforms[3].y - 70);
      if (currentPlatforms[3]) createCoin(currentPlatforms[3].x + 350, currentPlatforms[3].y - 70);
      addNew2 = false;
    }
    if (score == 8 && addNew3) {
      if (currentPlatforms[4]) createCoin(currentPlatforms[4].x + 50, currentPlatforms[4].y - 70);
      if (currentPlatforms[4]) createCoin(currentPlatforms[4].x + 350, currentPlatforms[4].y - 70);
      addNew3 = false;
    }
    if (score == 10 && addNew4) {
      if (currentPlatforms[5]) createCoin(currentPlatforms[5].x + 50, currentPlatforms[5].y - 70);
      if (currentPlatforms[5]) createCoin(currentPlatforms[5].x + 350, currentPlatforms[5].y - 70);
      addNew4 = false;
    }
    if (score == 12 && addNew6) {
      if (currentPlatforms[6]) createCoin(currentPlatforms[6].x + 50, currentPlatforms[6].y - 70);
      if (currentPlatforms[6]) createCoin(currentPlatforms[6].x + 350, currentPlatforms[6].y - 70);
      addNew6 = false;
    }
    if (score == 14 && addNew7) {
      if (currentPlatforms[7]) createCoin(currentPlatforms[7].x + 50, currentPlatforms[7].y - 70);
      if (currentPlatforms[7]) createCoin(currentPlatforms[7].x + 350, currentPlatforms[7].y - 70);
      addNew7 = false;
    }
    if (score == 16 && addNew8) {
      if (currentPlatforms[8]) createCoin(currentPlatforms[8].x + 50, currentPlatforms[8].y - 70);
      if (currentPlatforms[8]) createCoin(currentPlatforms[8].x + 350, currentPlatforms[8].y - 70);
      addNew8 = false;
    }
    if (score == 18 && addNew9) {
      if (currentPlatforms[9]) createCoin(currentPlatforms[9].x + 50, currentPlatforms[9].y - 70);
      if (currentPlatforms[9]) createCoin(currentPlatforms[9].x + 350, currentPlatforms[9].y - 70);
      addNew9 = false;
    }
    if (score == 20 && addNew10) {
      if (currentPlatforms[10]) createCoin(currentPlatforms[10].x + 50, currentPlatforms[10].y - 70);
      if (currentPlatforms[10]) createCoin(currentPlatforms[10].x + 350, currentPlatforms[10].y - 70);
      addNew10 = false;
    }
    if (score == 22 && addNew11) {
      if (currentPlatforms[11]) createCoin(currentPlatforms[11].x + 50, currentPlatforms[11].y - 70);
      if (currentPlatforms[11]) createCoin(currentPlatforms[11].x + 350, currentPlatforms[11].y - 70);
      addNew11 = false;
    }
  }

  if (score == 24 && addNew12) {
    if (currentLevel === 1) {
      let c = createCoin(5550, 290);
      c.scale.setTo(0.5);
    } else {
      let finalPlatformIndex = currentPlatforms.length - 1;
      let c = createCoin(currentPlatforms[finalPlatformIndex].x + 150, currentPlatforms[finalPlatformIndex].y - 110);
      c.scale.setTo(0.5);
    }
    addNew12 = false;
  }

  if (score >= 25 && addNew13) {
    if (levelConfigs[currentLevel + 1]) {
      currentLevel++;
      score = 0;
      
      buttonStates.left = false;
      buttonStates.right = false;
      buttonStates.jump = false;
      
      addNew = true; addNew1 = true; addNew2 = true; addNew3 = true; addNew4 = true;
      addNew6 = true; addNew7 = true; addNew8 = true; addNew9 = true;
      addNew10 = true; addNew11 = true; addNew12 = true; addNew13 = true;

      dude.x = 100;
      dude.y = 50;
      dude.body.velocity.x = 0;
      dude.body.velocity.y = 0;

      game.canvas.style.transform = "none";

      platforma();
      moneta();
      applyScreenEffects();
      showAlert("WELCOME TO LEVEL " + currentLevel);
    } else {
      backgroundMusic.stop();
      game.canvas.style.transform = "none";
      
      let win = game.add.text(game.camera.x + 900, 300, "YOU WIN!", {
        font: "80px Arial",
        fill: "#ffffff"
      });
      win.anchor.setTo(0.5);
      win.fixedToCamera = true;

      let restText = game.add.text(game.camera.x + 900, 450, "PLAY AGAIN?", {
        font: "50px Arial",
        fill: "#00ff00"
      });
      restText.anchor.setTo(0.5);
      restText.fixedToCamera = true;
      restText.inputEnabled = true;
      restText.events.onInputDown.add(function() {
        location.reload();
      });

      dude.kill();
      addNew13 = false;
    }
  }
}

function collectCoin(player, coin) {
  coin.kill();
  score++;
}

function setupMobileButtons() {
  const createBtn = function(x, y, w, h, type) {
    let g = game.add.graphics(0, 0);
    g.beginFill(0xffffff, 0.3);
    g.drawRect(0, 0, w, h);
    let btn = game.add.sprite(x, y, g.generateTexture());
    btn.inputEnabled = true;
    btn.fixedToCamera = true;
    btn.events.onInputDown.add(function() {
      buttonStates[type] = true;
    });
    btn.events.onInputUp.add(function() {
      buttonStates[type] = false;
    });
    g.destroy();
  };
  createBtn(50, 520, 200, 200, "left");
  createBtn(280, 520, 200, 200, "right");
  createBtn(1520, 480, 240, 240, "jump");
}
