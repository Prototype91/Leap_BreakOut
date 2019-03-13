//Phaser v2.6.2

// Création de l'univers de jeu avec phaser :

const game = new Phaser.Game(
    window.innerWidth,
    window.innerHeight,
    Phaser.AUTO,
    'game-root', // canvas généré
    {
        preload: preload,
        create: create,
        update: update,
    }
);

//Initialisation des variables :

let ball;
let pad;
let bricksGroup;
let timerText, timer = 0;

//Fonction pour charger tous les éléments du jeu :
function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // game.scale.pageAlignHorizontally = true;
    // game.scale.pageAlignVertically = true;
    // game.stage.backgroundColor = '#eee';

    game.load.image('ball', '../images/ball.png');
    game.load.image('pad', '../images/pad.png');
    game.load.image('brick_1', '../images/01.png', 100, 33);
    game.load.image('brick_2', '../images/02.png', 100, 33);
    game.load.image('brick_3', '../images/03.png', 100, 33);
    game.load.image('brick_4', '../images/04.png', 100, 33);
    game.load.image('brick_5', '../images/05.png', 100, 33);
    game.load.image('brick_6', '../images/06.png', 100, 33);
    game.load.image('brick_7', '../images/07.png', 100, 33);
    game.load.image('brick_8', '../images/08.png', 100, 33);
    game.load.image('brick_9', '../images/09.png', 100, 33);
    game.load.image('brick_10', '../images/10.png', 100, 33);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Création du groupe de briques
    bricksGroup = game.add.physicsGroup();
    // Génération des briques
    for (let y = 0; y < 5; y++) { // 10 colonnes et 5 briques par colonnes
        for (let x = 0; x < 10; x++) {
            let sprite = new Phaser.Sprite(game, x * 100 + (game.world.width - 1000) / 2, y * 33, 'brick_' + (x % 10 + 1));
            // sprite.scale.setTo(0.2604, 0.2604); 
            bricksGroup.add(sprite);
        }
    }
    bricksGroup.forEach(item => {
        item.body.immovable = true;
    });

    // Création de la balle
    ball = game.add.sprite(game.world.width / 2, game.world.height - 100, 'ball');
    ball.anchor.set(0.5);
    game.physics.arcade.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.velocity.set(300, -300); //départ de la balle
    ball.body.bounce.set(1.05); //force de rebond lors des collisions (1 = on retransmet la même force)
    
    // Création du pad
    pad = game.add.sprite(game.world.width / 2, game.world.height - 5, 'pad');
    pad.anchor.set(0.5, 1);
    game.physics.arcade.enable(pad);
    pad.body.immovable = true;

    // La balle peut sortir en bas de l'écran
    game.physics.arcade.checkCollision.down = false; //on ne vérifie pas les collisions en bas 
    ball.checkWorldBounds = true; // on check si la balle sort du world
    ball.events.onOutOfBounds.add(function(){
        window.alert('Game over!');
        window.location.reload();
    }, this);

    // Timing
    timerText = game.add.text(5, 5, 'Temps: 0.0s', { font: '18px Arial', fill: '#ffff00' });
    setInterval(() => timer += 100, 100);
}

function update() {
    game.physics.arcade.collide(ball, bricksGroup, ballHitBrick);
    game.physics.arcade.collide(ball, pad, ballHitPad);

    pad.x = game.input.x || game.world.width*0.5; //position du pad en fonction de la position de la souris

    timerText.setText('Temps: ' + (timer / 1000).toFixed(1) + 's');
}

function ballHitBrick(ball, brick) {
    brick.kill();

    const remainingBalls = bricksGroup.children.reduce((total, brick) => brick.alive ? total + 1 : total, 0);
    if (remainingBalls === 0) {
        window.alert('Bravo!\nVous avez complété le jeu en '+ (timer / 1000).toFixed(1) +' secondes !');
        window.location.reload();
    }
}

function ballHitPad(ball, pad) {
    ball.body.velocity.x = -1 * 5 * (pad.x - ball.x);
}
