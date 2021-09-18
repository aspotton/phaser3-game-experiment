var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        //update: update
    }
};

// load game assets here
function preload() {
    this.load.image('background', 'images/background.png');
}

function create() {
    image = this.add.image(0, 0, 'background').setOrigin(0, 0);
    let scaleX = window.innerWidth / image.width;
    let scaleY = window.innerHeight / image.height;
    let scale = Math.max(scaleX, scaleY);
    image.setScale(scale).setScrollFactor(0);
}

function setupCanvas() {
    var height = window.innerHeight;
    var width = window.innerWidth;

    game.width = width;
    game.height = height;
    //game.stage.bounds.width = width;
    //game.stage.bounds.height = height;

    if (game.renderType === 1) {
        game.renderer.resize(width, height);
        Phaser.Canvas.setSmoothingEnabled(game.context, false);
    }
}

window.onload = function () {
    var height = window.innerHeight;
    var width = window.innerWidth;

    config['width'] = width;
    config['height'] = height;

    game = new Phaser.Game(config);

    window.addEventListener('resize', setupCanvas);
    setupCanvas();
};

