"use strict";

const game = new Phaser.Game(1800, 800, Phaser.AUTO, "game-canvas", {
  preload,
  create,
  update,
});

let dude, bg, backgroundMusic, score = 0, text;
let plat, platmain1, platmain2, platmain3, platmain4, platmain5, platmain6;
let coins, enemies;
let w, a, d;
let buttonStates = { left: false, right: false, jump: false };

let addNew = true, addNew1 = true, addNew2 = true, addNew3 = true, addNew4 = true,
  addNew6 = true, addNew7 = true, addNew8 = true, addNew9 = true,
  addNew10 = true, addNew11 = true, addNew12 = true, addNew13 = true;

function preload() {
  game.load.image("bg", "desert.png");
  game.load.spritesheet("dude", "dude-org.288x48.9x1.png", 32, 48);
  game.load.image("plat", "platform.png");
  game.load.spritesheet("coin", "coin.png", 1198 / 5, 704 / 2);
  game.load.spritesheet("enemy", "scorpion.png", 48, 48);
  game.load.audio("backgroundSound", "background sound.mp3");
}

function create() {
game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.world.setBounds(0, 0, 6000, 800);
  game.physics.startSystem(Phaser.Physics.ARCADE);

  bg = game.add.tileSprite(0, 0, 6000, 800, "bg");

  dude = game.add.sprite(100, 500, "dude");
  game.physics.arcade.enable(dude);
  dude.body.gravity.y = 1000;
  dude.body.collideWorldBounds = true;

  dude.animations.add("left", [0, 1, 2, 3], 10, true);
  dude.animations.add("right", [5, 6, 7, 8], 10, true);

  enemies = game.add.group();
  enemies.enableBody = true;

  coins = game.add.group();
  coins.enableBody = true;

  platforma(); 
  moneta();
  setupMobileButtons();

  game.camera.follow(dude);

  backgroundMusic = game.add.audio("backgroundSound");
  backgroundMusic.loop = true;
  backgroundMusic.play();

  w = game.input.keyboard.addKey(Phaser.Keyboard.W);
  a = game.input.keyboard.addKey(Phaser.Keyboard.A);
  d = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function update() {
  const solids = [plat, platmain1, platmain2, platmain3, platmain4, platmain5, platmain6];
  
  game.physics.arcade.collide(dude, solids);
  game.physics.arcade.collide(enemies, solids);
  
  game.physics.arcade.overlap(dude, coins, collectCoin, null, this);
  game.physics.arcade.overlap(dude, enemies, hitEnemy, null, this);

  enemies.forEachAlive((scorpion) => {
    scorpion.scale.x = (scorpion.body.velocity.x > 0) ? -1 : 1;
  });

  handleLevels();
  handleMovement();
}

function handleMovement() {
  if (!dude.alive) return;
  
  let isLeft = a.isDown || buttonStates.left;
  let isRight = d.isDown || buttonStates.right;
  let isJump = w.isDown || buttonStates.jump;

  // --- POWER UP: INVERTED CONTROLS (Score 23-24) ---
  if (score >= 23 && score < 25) {
    let temp = isLeft;
    isLeft = isRight;
    isRight = temp;
  }

  // --- POWER UP: SPEED CHANGE (Score 4+) ---
  let speed = (score < 4) ? 500 : 250;

  // --- POWER UP: LOW GRAVITY (Score 10-13) ---
  dude.body.gravity.y = (score >= 10 && score < 14) ? 200 : 1000;

  // --- POWER UP: SIZE CHANGE (Score 16-19) ---
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
  plat = game.add.group();
  plat.enableBody = true;
  const points = [[100, 250], [500, 470], [1000, 350], [1600, 480], [1600, 200], [2000, 350], [2600, 150], [3200, 300], [2900, 480], [3900, 300], [4500, 100], [4700, 400], [5400, 400]];
  points.forEach((p) => {
    let obj = plat.create(p[0], p[1], "plat");
    obj.scale.setTo(0.5);
    obj.body.immovable = true;
  });

  const createMain = (x, y) => {
    let p = game.add.sprite(x, y, "plat");
    p.width = 1000; p.height = 100;
    game.physics.arcade.enable(p);
    p.body.immovable = true;
    return p;
  };
  platmain1 = createMain(0, 700);
  platmain2 = createMain(1000, 700);
  platmain3 = createMain(2000, 700);
  platmain4 = createMain(3000, 700);
  platmain5 = createMain(4000, 700);
  platmain6 = createMain(5000, 700);
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

function spawnEnemy(x, y) {
  let scorpion = enemies.create(x, y, "enemy");
  scorpion.animations.add('walk', [0, 1, 2, 3], 10, true);
  scorpion.animations.play('walk');
  scorpion.anchor.setTo(0.5);
  scorpion.body.gravity.y = 1000;
  scorpion.body.velocity.x = 150;
  scorpion.body.bounce.x = 1;
  scorpion.body.collideWorldBounds = true;
}

function handleLevels() {
  if (score == 2 && addNew) { createCoin(550, 400); createCoin(850, 400); spawnEnemy(800, 600); addNew = false; }
  if (score == 4 && addNew1) { createCoin(1050, 280); createCoin(1350, 280); spawnEnemy(1200, 600); addNew1 = false; }
  if (score == 6 && addNew2) { createCoin(1650, 400); createCoin(1950, 400); addNew2 = false; }
  if (score == 8 && addNew3) { createCoin(1650, 120); createCoin(1950, 120); addNew3 = false; }
  if (score == 10 && addNew4) { createCoin(2050, 255); createCoin(2350, 255); spawnEnemy(2200, 600); addNew4 = false; }
  if (score == 12 && addNew6) { createCoin(2650, 60); createCoin(2950, 60); addNew6 = false; }
  if (score == 14 && addNew7) { createCoin(3250, 200); createCoin(3500, 200); addNew7 = false; }
  if (score == 16 && addNew8) { createCoin(2950, 400); createCoin(3250, 400); addNew8 = false; }
  if (score == 18 && addNew9) { createCoin(3950, 240); createCoin(4250, 240); addNew9 = false; }
  if (score == 20 && addNew10) { createCoin(4550, 55); createCoin(4850, 55); addNew10 = false; }
  if (score == 22 && addNew11) { createCoin(4750, 300); createCoin(5050, 300); addNew11 = false; }
  if (score == 24 && addNew12) { let c = createCoin(5550, 290); c.scale.setTo(0.5); addNew12 = false; }
  
  if (score == 25 && addNew13) {
    backgroundMusic.stop();
    text = game.add.text(game.camera.x + 900, 400, "YOU WIN!", { font: "64px Arial", fill: "#ffffff" });
    text.anchor.setTo(0.5); 
    dude.kill(); 
    addNew13 = false;
  }
}

function collectCoin(player, coin) { coin.kill(); score++; }
function hitEnemy() { location.reload(); }

function setupMobileButtons() {
  const createBtn = (x, y, w, h, type) => {
    let g = game.add.graphics(0, 0);
    g.beginFill(0xffffff, 0.3);
    g.drawRect(0, 0, w, h);
    let btn = game.add.sprite(x, y, g.generateTexture());
    btn.inputEnabled = true;
    btn.fixedToCamera = true;
    btn.events.onInputDown.add(() => { buttonStates[type] = true; });
    btn.events.onInputUp.add(() => { buttonStates[type] = false; });
    g.destroy();
  };
  createBtn(50, 580, 200, 200, 'left');
  createBtn(280, 580, 200, 200, 'right');
  createBtn(1520, 550, 240, 240, 'jump');
}
