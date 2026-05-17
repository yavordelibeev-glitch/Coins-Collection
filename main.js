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
let w, a, s, d, shiftKey, escKey;
let cursors;
let fKey, mKey, spaceBar;
let buttonStates = { left: false, right: false, jump: false };
let isGameOver = false;
let isStarted = false;
let musicOn = true;
let isPaused = false;

let startButton;
let titleText;
let musicToggle;
let fullScreenButton;
let alertText;
let cooldownText;

let gameTimerText;
let startTime = 0;
let elapsedTime = 0;
let pausedTimeBuffer = 0;
let pauseMenuGroup;
let mobileControlsGroup;

let currentLevel = 1;
let lastFacingDirection = "right";

let canDash = true;
let dashCooldownTimer = 0;
let dashLockTimer = 0; 
const DASH_COOLDOWN_TIME = 10; 
const DASH_SPEED = 1300; 

let addNew = true;
let addNew1 = true; let addNew2 = true; let addNew3 = true; let addNew4 = true;
let addNew6 = true; let addNew7 = true; let addNew8 = true; let addNew9 = true;
let addNew10 = true; let addNew11 = true; let addNew12 = true; let addNew13 = true;

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

  try {
    backgroundMusic = game.add.audio("backgroundSound");
    backgroundMusic.loop = true;
  } catch(e) {}

  alertText = game.add.text(900, 400, "", { font: "bold 80px Arial", fill: "#f39c12" });
  alertText.anchor.setTo(0.5);
  alertText.fixedToCamera = true;
  alertText.visible = false;

  cooldownText = game.add.text(50, 50, "PROPULSION GUN: READY [SHIFT]", { font: "bold 24px Arial", fill: "#00ff00" });
  cooldownText.fixedToCamera = true;
  cooldownText.visible = false;

  gameTimerText = game.add.text(50, 95, "TIME: 0.00s", { font: "bold 24px Arial", fill: "#ffffff" });
  gameTimerText.fixedToCamera = true;
  gameTimerText.visible = false;

  titleText = game.add.text(900, 250, "DESERT CLIMBER", { font: "bold 100px Arial", fill: "#ffffff" });
  titleText.anchor.setTo(0.5);
  titleText.fixedToCamera = true;

  startButton = game.add.text(900, 450, "START GAME", { font: "60px Arial", fill: "#00ff00", backgroundColor: "rgba(0,0,0,0.5)" });
  startButton.anchor.setTo(0.5);
  startButton.inputEnabled = true;
  startButton.fixedToCamera = true;
  startButton.events.onInputDown.add(startGame);

  fullScreenButton = game.add.text(900, 580, "GO FULLSCREEN (F)", { font: "40px Arial", fill: "#ffff00", backgroundColor: "rgba(0,0,0,0.5)" });
  fullScreenButton.anchor.setTo(0.5);
  fullScreenButton.inputEnabled = true;
  fullScreenButton.fixedToCamera = true;
  fullScreenButton.events.onInputDown.add(goFull);

  musicToggle = game.add.text(1750, 50, "MUSIC: ON (M)", { font: "30px Arial", fill: "#ffffff" });
  musicToggle.anchor.setTo(1, 0);
  musicToggle.inputEnabled = true;
  musicToggle.fixedToCamera = true;
  musicToggle.events.onInputDown.add(toggleMusic);

  w = game.input.keyboard.addKey(Phaser.Keyboard.W);
  a = game.input.keyboard.addKey(Phaser.Keyboard.A);
  s = game.input.keyboard.addKey(Phaser.Keyboard.S);
  d = game.input.keyboard.addKey(Phaser.Keyboard.D);
  shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

  cursors = game.input.keyboard.createCursorKeys();
  fKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
  mKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
  spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  fKey.onDown.add(goFull);
  mKey.onDown.add(toggleMusic);
  spaceBar.onDown.add(startGame);
  shiftKey.onDown.add(firePropulsionGun);
  escKey.onDown.add(togglePauseMenu);
  
  mobileControlsGroup = game.add.group();
  mobileControlsGroup.fixedToCamera = true;
  mobileControlsGroup.visible = false;
  setupMobileButtons();

  pauseMenuGroup = game.add.group();
  pauseMenuGroup.fixedToCamera = true;
  pauseMenuGroup.visible = false;
  createPauseMenuUI();
}

function showAlert(message) {
  alertText.text = message;
  alertText.visible = true;
  game.world.bringToTop(alertText);
  game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
    alertText.visible = false;
  });
}

function updateCooldown() {
  if (!canDash) {
    dashCooldownTimer -= game.time.physicsElapsed;
    if (dashCooldownTimer <= 0) {
      canDash = true;
      cooldownText.text = "PROPULSION GUN: READY [SHIFT]";
      cooldownText.fill = "#00ff00";
    } else {
      cooldownText.text = "PROPULSION GUN: COOLDOWN (" + Math.ceil(dashCooldownTimer) + "s)";
      cooldownText.fill = "#ff3333";
    }
  }
  if (dashLockTimer > 0) {
    dashLockTimer -= game.time.physicsElapsed;
  }
}

function firePropulsionGun() {
  if (!isStarted || isGameOver || isPaused || !canDash) return;

  let inputLeft = a.isDown || cursors.left.isDown || buttonStates.left;
  let inputRight = d.isDown || cursors.right.isDown || buttonStates.right;
  let inputUp = w.isDown || cursors.up.isDown || buttonStates.jump;
  let inputDown = s.isDown || cursors.down.isDown;

  if (currentLevel === 1 && score >= 23 && score < 25) {
    let temp = inputLeft; inputLeft = inputRight; inputRight = temp;
  }

  let fired = false;
  dude.body.velocity.x = 0;
  dude.body.velocity.y = 0;

  if (inputLeft) { dude.body.velocity.x = -DASH_SPEED; fired = true; }
  else if (inputRight) { dude.body.velocity.x = DASH_SPEED; fired = true; }

  if (inputUp) { dude.body.velocity.y = -DASH_SPEED; fired = true; }
  else if (inputDown) { dude.body.velocity.y = DASH_SPEED; fired = true; }

  if (!fired) {
    if (lastFacingDirection === "left") { dude.body.velocity.x = -DASH_SPEED; }
    else { dude.body.velocity.x = DASH_SPEED; }
  }

  canDash = false;
  dashCooldownTimer = DASH_COOLDOWN_TIME;
  dashLockTimer = 0.2; 
  showAlert("PROPULSION BLAST!");
}

function goFull() {
  if (game.scale.isFullScreen) { game.scale.stopFullScreen(); }
  else { game.scale.startFullScreen(false); }
}

function startGame() {
  if (isStarted) return;
  isStarted = true;
  dude.visible = true;
  dude.body.gravity.y = 1000;
  titleText.visible = false;
  startButton.visible = false;
  fullScreenButton.visible = false;
  cooldownText.visible = true; 
  gameTimerText.visible = true;
  mobileControlsGroup.visible = true; 
  startTime = game.time.time;
  if (musicOn && backgroundMusic) backgroundMusic.play();
  game.camera.follow(dude);
  game.world.bringToTop(mobileControlsGroup);
  game.world.bringToTop(cooldownText);
  game.world.bringToTop(gameTimerText);
}

function toggleMusic() {
  musicOn = !musicOn;
  musicToggle.text = musicOn ? "MUSIC: ON (M)" : "MUSIC: OFF (M)";
  if (isStarted && !isPaused && backgroundMusic) {
    if (musicOn) backgroundMusic.play(); else backgroundMusic.stop();
  }
}

function createPauseMenuUI() {
  let pauseBg = game.add.graphics(0, 0);
  pauseBg.beginFill(0x000000, 0.85);
  pauseBg.drawRect(0, 0, 1800, 800);
  pauseBg.endFill();
  pauseMenuGroup.add(pauseBg);

  let pTitle = game.add.text(900, 250, "GAME PAUSED", { font: "bold 80px Arial", fill: "#ffffff" });
  pTitle.anchor.setTo(0.5);
  pauseMenuGroup.add(pTitle);

  let resumeBtn = game.add.text(900, 420, "RESUME GAME", { font: "50px Arial", fill: "#00ff00", backgroundColor: "rgba(255,255,255,0.1)" });
  resumeBtn.anchor.setTo(0.5);
  resumeBtn.inputEnabled = true;
  resumeBtn.events.onInputDown.add(togglePauseMenu);
  pauseMenuGroup.add(resumeBtn);

  let restartBtn = game.add.text(900, 550, "RESTART MAP", { font: "50px Arial", fill: "#ff3333", backgroundColor: "rgba(255,255,255,0.1)" });
  restartBtn.anchor.setTo(0.5);
  restartBtn.inputEnabled = true;
  restartBtn.events.onInputDown.add(function() { location.reload(); });
  pauseMenuGroup.add(restartBtn);
}

function togglePauseMenu() {
  if (!isStarted || isGameOver) return;
  isPaused = !isPaused;
  if (isPaused) {
    pauseMenuGroup.visible = true;
    game.world.bringToTop(pauseMenuGroup); 
    dude.body.enable = false; 
    if (musicOn && backgroundMusic) backgroundMusic.pause();
    pausedTimeBuffer = game.time.time;
  } else {
    pauseMenuGroup.visible = false;
    dude.body.enable = true;
    if (musicOn && backgroundMusic) backgroundMusic.resume();
    startTime += (game.time.time - pausedTimeBuffer);
  }
}

function update() {
  if (!isStarted || isGameOver) return;
  if (isPaused) return;
  elapsedTime = (game.time.time - startTime) / 1000;
  gameTimerText.text = "TIME: " + elapsedTime.toFixed(2) + "s";
  updateMovingPlatforms();
  updateCooldown(); 
  game.physics.arcade.collide(dude, plat);
  game.physics.arcade.overlap(dude, coins, collectCoin, null, this);
  if (dude.y > 800) { game.canvas.style.transform = "none"; showGameOver(); }
  handleLevels();
  handleMovement();
}

function updateMovingPlatforms() {
  plat.forEach(function(p) {
    if (p.isMovingObj) {
      let oldX = p.x;
      p.x += p.moveSpeed;
      if (p.x >= p.maxX) { p.x = p.maxX; p.moveSpeed = -Math.abs(p.moveSpeed); }
      else if (p.x <= p.minX) { p.x = p.minX; p.moveSpeed = Math.abs(p.moveSpeed); }
      let deltaX = p.x - oldX;
      if (dude.body.touching.down && (game.physics.arcade.intersects(dude, p) || (dude.x + dude.width >= p.x && dude.x <= p.x + p.width && Math.abs((dude.y + dude.height) - p.y) < 6))) {
        dude.x += deltaX;
        dude.y = p.y - dude.height;
      }
    }
  });
}

function showGameOver() {
  isGameOver = true;
  dude.kill();
  if (backgroundMusic) backgroundMusic.stop();
  mobileControlsGroup.visible = false;
  let goText = game.add.text(game.camera.x + 900, 300, "GAME OVER", { font: "80px Arial", fill: "#ff0000" });
  goText.anchor.setTo(0.5);
  let restText = game.add.text(game.camera.x + 900, 450, "CLICK TO RESTART", { font: "50px Arial", fill: "#ffffff" });
  restText.anchor.setTo(0.5);
  restText.inputEnabled = true;
  restText.events.onInputDown.add(function() { location.reload(); });
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
    let temp = isLeft; isLeft = isRight; isRight = temp;
  }

  let speed = score < 4 ? 500 : 250;
  if (dashLockTimer <= 0) { dude.body.gravity.y = (score >= 10 && score < 14) ? 200 : 1000; }
  else { dude.body.gravity.y = 0; }

  if (score >= 16 && score < 20) { dude.scale.setTo(0.5, 0.5); }
  else { dude.scale.setTo(1, 1); }

  if (dashLockTimer <= 0) {
    if (isLeft) {
      dude.body.velocity.x = -speed; dude.animations.play("left"); bg.tilePosition.x += 2; lastFacingDirection = "left";
    } else if (isRight) {
      dude.body.velocity.x = speed; dude.animations.play("right"); bg.tilePosition.x -= 2; lastFacingDirection = "right";
    } else {
      dude.body.velocity.x = 0; dude.animations.stop(); dude.frame = 4;
    }
    if (isJump && dude.body.touching.down) { dude.body.velocity.y = -700; }
  } else {
    if (dude.body.velocity.x > 0) bg.tilePosition.x -= 4;
    if (dude.body.velocity.x < 0) bg.tilePosition.x += 4;
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
      obj.isMovingObj = true; obj.minX = p.minX; obj.maxX = p.maxX; obj.moveSpeed = p.speed; obj.body.friction.x = 1; obj.body.bounce.set(0);
    }
  });
}

function moneta() {
  if (coins) coins.destroy();
  coins = game.add.group();
  coins.enableBody = true;
  if (currentLevel === 1) { createCoin(200, 180); createCoin(400, 180); }
  else {
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

function applyScreenEffects() { game.canvas.style.transform = "none"; }

function handleLevels() {
  const currentPlatforms = levelConfigs[currentLevel].platforms;
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
    if (score == 24 && addNew12) { let c = createCoin(5550, 290); c.scale.setTo(0.5); addNew12 = false; }
  } 
  else if (currentLevel === 2) {
    if (score == 27 && addNew) { createCoin(currentPlatforms[1].x + 50, currentPlatforms[1].y - 70); createCoin(currentPlatforms[1].x + 350, currentPlatforms[1].y - 70); addNew = false; }
    if (score == 29 && addNew1) { createCoin(currentPlatforms[2].x + 50, currentPlatforms[2].y - 70); createCoin(currentPlatforms[2].x + 350, currentPlatforms[2].y - 70); addNew1 = false; }
    if (score == 31 && addNew2) { createCoin(currentPlatforms[3].x + 50, currentPlatforms[3].y - 70); createCoin(currentPlatforms[3].x + 350, currentPlatforms[3].y - 70); addNew2 = false; }
    if (score == 33 && addNew3) { createCoin(currentPlatforms[4].x + 50, currentPlatforms[4].y - 70); createCoin(currentPlatforms[4].x + 350, currentPlatforms[4].y - 70); addNew3 = false; }
    if (score == 35 && addNew4) { createCoin(currentPlatforms[5].x + 50, currentPlatforms[5].y - 70); createCoin(currentPlatforms[5].x + 350, currentPlatforms[5].y - 70); addNew4 = false; }
    if (score == 37 && addNew6) { createCoin(currentPlatforms[6].x + 50, currentPlatforms[6].y - 70); createCoin(currentPlatforms[6].x + 350, currentPlatforms[6].y - 70); addNew6 = false; }
    if (score == 39 && addNew7) { createCoin(currentPlatforms[7].x + 50, currentPlatforms[7].y - 70); createCoin(currentPlatforms[7].x + 350, currentPlatforms[7].y - 70); addNew7 = false; }
    if (score == 41 && addNew8) { createCoin(currentPlatforms[8].x + 50, currentPlatforms[8].y - 70); createCoin(currentPlatforms[8].x + 350, currentPlatforms[8].y - 70); addNew8 = false; }
    if (score == 43 && addNew9) { createCoin(currentPlatforms[9].x + 50, currentPlatforms[9].y - 70); createCoin(currentPlatforms[9].x + 350, currentPlatforms[9].y - 70); addNew9 = false; }
    if (score == 45 && addNew10) { createCoin(currentPlatforms[10].x + 50, currentPlatforms[10].y - 70); createCoin(currentPlatforms[10].x + 350, currentPlatforms[10].y - 70); addNew10 = false; }
    if (score == 47 && addNew11) { createCoin(currentPlatforms[11].x + 50, currentPlatforms[11].y - 70); createCoin(currentPlatforms[11].x + 350, currentPlatforms[11].y - 70); addNew11 = false; }
    if (score == 49 && addNew12) { let finalPlatformIndex = currentPlatforms.length - 1; let c = createCoin(currentPlatforms[finalPlatformIndex].x + 150, currentPlatforms[finalPlatformIndex].y - 110); c.scale.setTo(0.5); addNew12 = false; }
  } 
  else if (currentLevel === 3) {
    if (score == 52 && addNew) { createCoin(currentPlatforms[1].x + 50, currentPlatforms[1].y - 70); createCoin(currentPlatforms[1].x + 350, currentPlatforms[1].y - 70); addNew = false; }
    if (score == 54 && addNew1) { createCoin(currentPlatforms[2].x + 50, currentPlatforms[2].y - 70); createCoin(currentPlatforms[2].x + 350, currentPlatforms[2].y - 70); addNew1 = false; }
    if (score == 56 && addNew2) { createCoin(currentPlatforms[3].x + 50, currentPlatforms[3].y - 70); createCoin(currentPlatforms[3].x + 350, currentPlatforms[3].y - 70); addNew2 = false; }
    if (score == 58 && addNew3) { createCoin(currentPlatforms[4].x + 50, currentPlatforms[4].y - 70); createCoin(currentPlatforms[4].x + 350, currentPlatforms[4].y - 70); addNew3 = false; }
    if (score == 60 && addNew4) { createCoin(currentPlatforms[5].x + 50, currentPlatforms[5].y - 70); createCoin(currentPlatforms[5].x + 350, currentPlatforms[5].y - 70); addNew4 = false; }
    if (score == 62 && addNew6) { createCoin(currentPlatforms[6].x + 50, currentPlatforms[6].y - 70); createCoin(currentPlatforms[6].x + 350, currentPlatforms[6].y - 70); addNew6 = false; }
    if (score == 64 && addNew7) { createCoin(currentPlatforms[7].x + 50, currentPlatforms[7].y - 70); createCoin(currentPlatforms[7].x + 350, currentPlatforms[7].y - 70); addNew7 = false; }
    if (score == 66 && addNew8) { createCoin(currentPlatforms[8].x + 50, currentPlatforms[8].y - 70); createCoin(currentPlatforms[8].x + 350, currentPlatforms[8].y - 70); addNew8 = false; }
    if (score == 68 && addNew9) { createCoin(currentPlatforms[9].x + 50, currentPlatforms[9].y - 70); createCoin(currentPlatforms[9].x + 350, currentPlatforms[9].y - 70); addNew9 = false; }
    if (score == 70 && addNew10) { createCoin(currentPlatforms[10].x + 50, currentPlatforms[10].y - 70); createCoin(currentPlatforms[10].x + 350, currentPlatforms[10].y - 70); addNew10 = false; }
    if (score == 72 && addNew11) { createCoin(currentPlatforms[11].x + 50, currentPlatforms[11].y - 70); createCoin(currentPlatforms[11].x + 350, currentPlatforms[11].y - 70); addNew11 = false; }
    if (score == 74 && addNew12) { let finalPlatformIndex = currentPlatforms.length - 1; let c = createCoin(currentPlatforms[finalPlatformIndex].x + 150, currentPlatforms[finalPlatformIndex].y - 110); c.scale.setTo(0.5); addNew12 = false; }
  }

  if (((currentLevel === 1 && score >= 25) || (currentLevel === 2 && score >= 50)) && addNew13) {
    currentLevel++;
    buttonStates.left = false; buttonStates.right = false; buttonStates.jump = false;
    addNew = true; addNew1 = true; addNew2 = true; addNew3 = true; addNew4 = true;
    addNew6 = true; addNew7 = true; addNew8 = true; addNew9 = true;
    addNew10 = true; addNew11 = true; addNew12 = true;
    dude.x = 100; dude.y = 50; dude.body.velocity.x = 0; dude.body.velocity.y = 0;
    game.canvas.style.transform = "none";
    platforma(); moneta(); applyScreenEffects();
    showAlert("WELCOME TO LEVEL " + currentLevel);
  } else if (currentLevel === 3 && score >= 75 && addNew13) {
    if (backgroundMusic) backgroundMusic.stop();
    game.canvas.style.transform = "none"; mobileControlsGroup.visible = false;
    let win = game.add.text(game.camera.x + 900, 300, "YOU WIN!", { font: "80px Arial", fill: "#ffffff" });
    win.anchor.setTo(0.5); win.fixedToCamera = true;
    let restText = game.add.text(game.camera.x + 900, 450, "PLAY AGAIN?", { font: "50px Arial", fill: "#00ff00" });
    restText.anchor.setTo(0.5); restText.fixedToCamera = true; restText.inputEnabled = true;
    restText.events.onInputDown.add(function() { location.reload(); });
    dude.kill(); addNew13 = false;
  }
}

function collectCoin(player, coin) { coin.kill(); score++; }

function setupMobileButtons() {
  const createBtn = function(x, y, w, h, type, symbol, fontSize, fontFamily = "Arial") {
    let label = game.add.text(x + w / 2, y + h / 2, symbol, { 
      font: "bold " + fontSize + "px " + fontFamily, 
      fill: "#ffffff" 
    });
    label.anchor.setTo(0.5);
    label.inputEnabled = true;

    // Apply dark text drop-shadow styling to elevate button readability over game sprites
    label.setShadow(3, 3, "rgba(0, 0, 0, 0.6)", 2);

    if (type === "dash") {
      label.events.onInputDown.add(firePropulsionGun);
    } else if (type === "pause") {
      label.events.onInputDown.add(togglePauseMenu);
    } else {
      label.events.onInputDown.add(function() { buttonStates[type] = true; });
      label.events.onInputUp.add(function() { buttonStates[type] = false; });
    }
    
    mobileControlsGroup.add(label);
  };

  // Mobile Core Action Controls 
  createBtn(50, 520, 180, 180, "left", "◀", 80);
  createBtn(270, 520, 180, 180, "right", "▶", 80);
  
  createBtn(1280, 500, 200, 200, "dash", "▶▶", 85);
  createBtn(1540, 500, 200, 200, "jump", "▲▲", 85);

  // Totally Isolated Game Pause Button: Pushed to the top-left margin space to look authentic
  createBtn(1720, 25, 60, 60, "pause", "❚❚", 50, "Impact");
}
