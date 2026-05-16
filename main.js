"use strict";

const game = new Phaser.Game(1800, 800, Phaser.AUTO, "game-canvas", {
  preload,
  create,
  update,
});

let dude,
  bg,
  backgroundMusic,
  score = 0;
let plat, coins;
let w, a, d, cursors, fKey, mKey, spaceBar;
let buttonStates = { left: false, right: false, jump: false };
let isGameOver = false,
  isStarted = false,
  musicOn = true;

// UI Elements
let startButton, titleText, musicToggle, fullScreenButton, alertText;

let addNew = true,
  addNew1 = true,
  addNew2 = true,
  addNew3 = true,
  addNew4 = true,
  addNew6 = true,
  addNew7 = true,
  addNew8 = true,
  addNew9 = true,
  addNew10 = true,
  addNew11 = true,
  addNew12 = true,
  addNew13 = true;

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

  coins = game.add.group();
  coins.enableBody = true;

  platforma();
  moneta();

  backgroundMusic = game.add.audio("backgroundSound");
  backgroundMusic.loop = true;

  // Notification Text (Power Ups)
  alertText = game.add.text(900, 400, "", {
    font: "bold 80px Arial",
    fill: "#f39c12",
  });
  alertText.anchor.setTo(0.5);
  alertText.fixedToCamera = true;
  alertText.visible = false;

  // --- MENU ---
  titleText = game.add.text(900, 250, "DESERT CLIMBER", {
    font: "bold 100px Arial",
    fill: "#ffffff",
  });
  titleText.anchor.setTo(0.5);
  titleText.fixedToCamera = true;

  startButton = game.add.text(900, 450, "START GAME", {
    font: "60px Arial",
    fill: "#00ff00",
    backgroundColor: "rgba(0,0,0,0.5)",
  });
  startButton.anchor.setTo(0.5);
  startButton.inputEnabled = true;
  startButton.fixedToCamera = true;
  startButton.events.onInputDown.add(startGame);

  fullScreenButton = game.add.text(900, 580, "GO FULLSCREEN (F)", {
    font: "40px Arial",
    fill: "#ffff00",
    backgroundColor: "rgba(0,0,0,0.5)",
  });
  fullScreenButton.anchor.setTo(0.5);
  fullScreenButton.inputEnabled = true;
  fullScreenButton.fixedToCamera = true;
  fullScreenButton.events.onInputDown.add(goFull);

  musicToggle = game.add.text(1750, 50, "MUSIC: ON (M)", {
    font: "30px Arial",
    fill: "#ffffff",
  });
  musicToggle.anchor.setTo(1, 0);
  musicToggle.inputEnabled = true;
  musicToggle.fixedToCamera = true;
  musicToggle.events.onInputDown.add(toggleMusic);

  // --- CONTROLS ---
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
  game.time.events.add(Phaser.Timer.SECOND * 1.5, () => {
    alertText.visible = false;
  });
}

function goFull() {
  if (game.scale.isFullScreen) game.scale.stopFullScreen();
  else game.scale.startFullScreen(false);
}

function startGame() {
  // FIXED: Safety check so pressing Spacebar during the game doesn't restart this logic
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
  if (dude.y > 800) showGameOver();
  handleLevels();
  handleMovement();
}

function showGameOver() {
  isGameOver = true;
  dude.kill();
  backgroundMusic.stop();
  let goText = game.add.text(game.camera.x + 900, 300, "GAME OVER", {
    font: "80px Arial",
    fill: "#ff0000",
  });
  goText.anchor.setTo(0.5);
  let restText = game.add.text(game.camera.x + 900, 450, "CLICK TO RESTART", {
    font: "50px Arial",
    fill: "#ffffff",
  });
  restText.anchor.setTo(0.5);
  restText.inputEnabled = true;
  restText.events.onInputDown.add(() => {
    location.reload();
  });
}

function handleMovement() {
  let isLeft = a.isDown || cursors.left.isDown || buttonStates.left;
  let isRight = d.isDown || cursors.right.isDown || buttonStates.right;
  let isJump = w.isDown || cursors.up.isDown || buttonStates.jump;

  // Power Up Messages Trigger
  if (score == 0) {
    showAlert("SPEED UP!");
  }
  if (score == 12) {
    showAlert("LOW GRAVITY!");
  }
  if (score == 18) {
    showAlert("TINY MODE!");
  }
  if (score == 23) {
    showAlert("CONTROLS SWITCHED!");
  }

  if (score >= 23 && score < 25) {
    let temp = isLeft;
    isLeft = isRight;
    isRight = temp;
  }

  let speed = score < 4 ? 500 : 250;

  dude.body.gravity.y = score >= 10 && score < 14 ? 200 : 1000;

  if (score >= 16 && score < 20) dude.scale.setTo(0.5, 0.5);
  else dude.scale.setTo(1, 1);

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
  plat = game.add.group();
  plat.enableBody = true;
  const points = [
    [100, 250],
    [500, 470],
    [1000, 350],
    [1600, 480],
    [1600, 200],
    [2000, 350],
    [2600, 150],
    [3200, 300],
    [2900, 480],
    [3900, 300],
    [4500, 100],
    [4700, 400],
    [5400, 400],
  ];
  points.forEach((p) => {
    let obj = plat.create(p[0], p[1], "plat");
    obj.scale.setTo(0.5);
    obj.body.immovable = true;
  });
}

function moneta() {
  createCoin(200, 180);
  createCoin(400, 180);
}

function createCoin(x, y) {
  let c = coins.create(x, y, "coin");
  c.animations.add("spin", [], 10, true);
  c.animations.play("spin");
  c.scale.setTo(0.2);
  return c;
}

function handleLevels() {
  if (score == 2 && addNew) {
    createCoin(550, 400);
    createCoin(850, 400);
    addNew = false;
  }
  if (score == 4 && addNew1) {
    createCoin(1050, 280);
    createCoin(1350, 280);
    addNew1 = false;
  }
  if (score == 6 && addNew2) {
    createCoin(1650, 400);
    createCoin(1950, 400);
    addNew2 = false;
  }
  if (score == 8 && addNew3) {
    createCoin(1650, 120);
    createCoin(1950, 120);
    addNew3 = false;
  }
  if (score == 10 && addNew4) {
    createCoin(2050, 255);
    createCoin(2350, 255);
    addNew4 = false;
  }
  if (score == 12 && addNew6) {
    createCoin(2650, 60);
    createCoin(2950, 60);
    addNew6 = false;
  }
  if (score == 14 && addNew7) {
    createCoin(3250, 200);
    createCoin(3500, 200);
    addNew7 = false;
  }
  if (score == 16 && addNew8) {
    createCoin(2950, 400);
    createCoin(3250, 400);
    addNew8 = false;
  }
  if (score == 18 && addNew9) {
    createCoin(3950, 240);
    createCoin(4250, 240);
    addNew9 = false;
  }
  if (score == 20 && addNew10) {
    createCoin(4550, 55);
    createCoin(4850, 55);
    addNew10 = false;
  }
  if (score == 22 && addNew11) {
    createCoin(4750, 300);
    createCoin(5050, 300);
    addNew11 = false;
  }
  if (score == 24 && addNew12) {
    let c = createCoin(5550, 290);
    c.scale.setTo(0.5);
    addNew12 = false;
  }

  if (score >= 25 && addNew13) {
    backgroundMusic.stop();
    handleMovement.stop();
    let win = game.add.text(game.camera.x + 900, 300, "YOU WIN!", {
      font: "80px Arial",
      fill: "#ffffff",
    });
    win.anchor.setTo(0.5);
    win.fixedToCamera = true;

    let restText = game.add.text(game.camera.x + 900, 450, "PLAY AGAIN?", {
      font: "50px Arial",
      fill: "#00ff00",
    });
    restText.anchor.setTo(0.5);
    restText.fixedToCamera = true;
    restText.inputEnabled = true;
    restText.events.onInputDown.add(() => {
      location.reload();
    });

    dude.kill();
    addNew13 = false;
  }
}

function collectCoin(player, coin) {
  coin.kill();
  score++;
}

function setupMobileButtons() {
  const createBtn = (x, y, w, h, type) => {
    let g = game.add.graphics(0, 0);
    g.beginFill(0xffffff, 0.3);
    g.drawRect(0, 0, w, h);
    let btn = game.add.sprite(x, y, g.generateTexture());
    btn.inputEnabled = true;
    btn.fixedToCamera = true;
    btn.events.onInputDown.add(() => {
      buttonStates[type] = true;
    });
    btn.events.onInputUp.add(() => {
      buttonStates[type] = false;
    });
    g.destroy();
  };
  createBtn(50, 520, 200, 200, "left");
  createBtn(280, 520, 200, 200, "right");
  createBtn(1520, 480, 240, 240, "jump");
}
