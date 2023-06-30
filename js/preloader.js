var chromedino = {};

chromedino.preloader = function(game)
{
    this.game = game;
};

chromedino.preloader.prototype = 
{
    preload: function()
    {
        this.load.bitmapFont('pixeled', 'assets/pixeled_0.png', 'assets/pixeled.fnt');

         this.load.spritesheet('player_idle', 'assets/player_idle.png', 44, 49, 1);
         this.load.spritesheet('player_dead', 'assets/player_dead.png', 44, 49, 1);
         this.load.spritesheet('player_walk', 'assets/player_walk.png', 44, 49, 2);
         this.load.spritesheet('player_ducking', 'assets/player_ducking.png', 44, 49, 2);

        this.load.spritesheet('bird', 'assets/bird.png', 45, 42, 2);
        this.load.spritesheet('restart_button', 'assets/restart_button.png', 36, 32, 5);
        
        this.load.image('ground', 'assets/ground.png');
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('moon', 'assets/moon.png');
        this.load.image('star', 'assets/star.png');

        this.load.image('cactus1', 'assets/cactus1.png');
        this.load.image('cactus2', 'assets/cactus2.png');
        this.load.image('cactus3', 'assets/cactus3.png');
        this.load.image('cactus4', 'assets/cactus4.png');
        
    },

    create: function()
    {
        
    },

    loadUpdate: function()
    {
    },

    update: function()
    {
        this.state.start('game');
    },
};