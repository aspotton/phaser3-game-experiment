var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        //update: update
    }
};

var background = null;

// load game assets here
function preload() {
    this.load.image('background', 'images/background.png');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
}

window.onload = function () {
    game = new Phaser.Game(config);
};

