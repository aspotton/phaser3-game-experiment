var game = null;
var platforms = null;
var coins = null;
var enemies = null;
var player = null;

var keyW = null;
var keyA = null;
var keyS = null;
var keyD = null;

var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function setupCanvas() {
    var height = window.innerHeight;
    var width = window.innerWidth;

    if (game.scene.scale) {
        game.scene.scale.resize(width, height);
        game.scene.scale.setGameSize(width, height);
    }
}

// load game assets here
function preload() {
    this.load.image('background', 'images/background.png');

    this.load.spritesheet('hero',
        'images/phaser.io/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

    this.load.spritesheet('coin',
        'images/coin_animated.png',
        { frameWidth: 22, frameHeight: 22 }
    );

    this.load.spritesheet('squishableEnemy',
        'images/red_enemy.png',
        { frameWidth: 16, frameHeight: 13 }
    );

    this.load.image('ground', 'images/ground.png');
    this.load.image('grass:8x1', 'images/grass_8x1.png');
    this.load.image('grass:6x1', 'images/grass_6x1.png');
    this.load.image('grass:4x1', 'images/grass_4x1.png');
    this.load.image('grass:2x1', 'images/grass_2x1.png');
    this.load.image('grass:1x1', 'images/grass_1x1.png');

    this.load.audio('sfx:jump', 'audio/jump.wav');
    this.load.audio('sfx:coin', 'audio/coin.wav');

    this.load.json('level:1', 'data/level01.json');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'hero', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('hero', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'coinSpin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'squishableEnemyLeft',
        frames: this.anims.generateFrameNumbers('squishableEnemy', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'squishableEnemyRight',
        frames: this.anims.generateFrameNumbers('squishableEnemy', { start: 6, end: 11 }),
        frameRate: 6,
        repeat: -1
    });

    loadLevel(this.cache.json.get('level:1'), this);

    this.canStartJump = true;

    this.sfx = {
        jump: this.sound.add('sfx:jump'),
        coin: this.sound.add('sfx:coin')
    };

    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

function update() {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown || keyA.isDown)
    {
        player.setVelocityX(-140);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown || keyD.isDown)
    {
        player.setVelocityX(140);

        player.anims.play('right', true);
    }
    // Player can fall slightly quicker if they want to
    else if ((cursors.down.isDown || keyS.isDown) && !player.body.touching.down)
    {
        player.setVelocityY(player.body.velocity.y += 5);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    // Player can jump with up arrow / space bar / W
    if ((cursors.up.isDown || cursors.space.isDown || keyW.isDown) && player.body.touching.down && this.canStartJump)
    {
        player.setVelocityY(-330);
        this.canStartJump = false;
        this.sfx.jump.play();
    } else if (!cursors.up.isDown && !cursors.space.isDown && !keyW.isDown) {
        this.canStartJump = true;
    }

    enemies.children.each(function(enemy) {
        if (enemy.body.wait > 0) {
            enemy.body.wait -= 1;
            return;
        }

        overlapped = this.physics.overlapRect(
            enemy.x,
            enemy.y,
            enemy.width - enemy.width/1.5,
            enemy.height + 2
        );

        ground = 0;
        overlapped.forEach(function(body) {
            entity = body.gameObject;

            if (entity.texture.key.includes('grass') || entity.texture.key.includes('ground')) {
                ground++;
            }
        });

        if (ground == 0 && enemy.body.touching.down) {
            enemy.body.velocity.x *= -1;
            enemy.body.wait = 3;

            if (enemy.body.velocity.x > 0)
                enemy.anims.play('squishableEnemyRight');
            else
                enemy.anims.play('squishableEnemyLeft');
        }
    }, this);
}

function loadLevel (data, game) {
    platforms = game.physics.add.group();
    data.platforms.forEach(spawnPlatform, game);

    enemies = game.physics.add.group();
    data.spiders.forEach(spawnSquishableEnemy, game);
    enemies.playAnimation('squishableEnemyRight');

    spawnCharacters({hero: data.hero, squishableEnemies: data.spiders}, game);

    coins = game.physics.add.group();
    data.coins.forEach(spawnCoin, game);
    coins.playAnimation('coinSpin');
    game.physics.add.overlap(player, coins, collectCoin, null, game);
    game.physics.add.collider(coins, platforms);

    game.physics.world.on('worldbounds', function (body, up, down, left, right) {
        entity = body.gameObject;

        if (left) {
            body.velocity.x = 50;
            entity.anims.play('squishableEnemyRight');
        }

        if (right) {
            body.velocity.x = -50;
            entity.anims.play('squishableEnemyLeft');
        }
    });
};

function spawnPlatform (platform, game) {
    platform = platforms.create(platform.x, platform.y, platform.image).setOrigin(0, 0).refreshBody();
    platform.setImmovable(true);
    platform.body.allowGravity = false;
}

function spawnCharacters (data, game) {
    // spawn hero
    player = game.physics.add.sprite(data.hero.x, data.hero.y, 'hero');
    game.physics.add.collider(player, platforms);
    player.setCollideWorldBounds(true);
}

function spawnCoin (coin) {
    coin = coins.create(coin.x, coin.y, 'coin').setOrigin(0.5, 0.5).refreshBody();
    coin.setCollideWorldBounds(true);
    coin.body.allowGravity = false;
}

function spawnSquishableEnemy(enemy) {
    enemy = enemies.create(enemy.x, enemy.y, 'squishableEnemy').setScale(2.25).setOrigin(0.5, 0.5).refreshBody();
    enemy.setCollideWorldBounds(true);
    enemy.body.onWorldBounds = true;
    enemy.body.velocity.x = 50;
    enemy.body.previousY = enemy.body.y;
    enemy.body.wait = 0;
    this.physics.add.collider(enemy, platforms);
}

function collectCoin (player, coin) {
    this.sfx.coin.play();
    coin.disableBody(true, true);
}

window.onload = function () {
    game = new Phaser.Game(config);

    window.addEventListener('resize', setupCanvas);
    setupCanvas();
};

class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x, y) {
        console.log(x, y);
        super(game.scene, x, y, 'hero');
    }
}