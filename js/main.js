var platforms = null;
var player = null;

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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// load game assets here
function preload() {
    this.load.image('background', 'images/background.png');

    this.load.spritesheet('hero',
        'images/phaser.io/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

    this.load.image('ground', 'images/ground.png');
    this.load.image('grass:8x1', 'images/grass_8x1.png');
    this.load.image('grass:6x1', 'images/grass_6x1.png');
    this.load.image('grass:4x1', 'images/grass_4x1.png');
    this.load.image('grass:2x1', 'images/grass_2x1.png');
    this.load.image('grass:1x1', 'images/grass_1x1.png');

    this.load.audio('sfx:jump', 'audio/jump.wav');

    this.load.json('level:1', 'data/level01.json');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    loadLevel(this.cache.json.get('level:1'), this);

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

    this.canStartJump = true;

    this.sfx = {
        jump: this.sound.add('sfx:jump')
    };
}

function update() {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown)
    {
        player.setVelocityX(-140);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(140);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down && this.canStartJump)
    {
        player.setVelocityY(-330);
        this.canStartJump = false;
        this.sfx.jump.play();
    } else if (!cursors.up.isDown && !cursors.space.isDown) {
        this.canStartJump = true;
    }
}

function loadLevel (data, game) {
    platforms = game.physics.add.staticGroup();

    data.platforms.forEach(spawnPlatform, this);

    spawnCharacters({hero: data.hero}, game);
};

function spawnPlatform (platform, game) {
    //game.add.sprite(platform.x, platform.y, platform.image);
    platforms.create(platform.x, platform.y, platform.image).setOrigin(0, 0).refreshBody();
}

function spawnCharacters (data, game) {
    // spawn hero
    player = game.physics.add.sprite(data.hero.x, data.hero.y, 'hero');
    game.physics.add.collider(player, platforms);

    player.setCollideWorldBounds(true);

    //game.add.existing(player);

    // game.hero = new Hero(game, data.hero.x, data.hero.y);
    // game.add.existing(game.hero);
    // game.physics.add.existing(game.hero);
};

window.onload = function () {
    game = new Phaser.Game(config);
};

class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x, y) {
        console.log(x, y);
        super(game.scene, x, y, 'hero');
    }
}