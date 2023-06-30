parallaxObject = function(game, x, y, speed, spriteName, isSpriteSheet, isPhysics) 
{
    this.game = game;
    this.speed = speed;
    this.sprite = this.game.add.sprite(x, y, spriteName);
    this.physicsEnabled = false;
    if(isSpriteSheet)
    {
        this.sprite.animations.add('anim');
        this.sprite.animations.play('anim', 8, true);
    }

    if(isPhysics)
    {
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.allowRotation = false;
        this.sprite.body.drag.x = 0;
        this.sprite.body.friction.x = 0;
        this.sprite.body.allowGravity = false;
        this.sprite.body.maxVelocity.setTo(0, 0);
        this.sprite.body.immovable = true;

        this.physicsEnabled = true;

    }
}

parallaxObject.prototype = 
{
    init: function()
    {
        
    },

    update: function(dt)
    {
        var movablePiece = this.sprite;
        if(this.physicsEnabled)
        {
            movablePiece = this.sprite.body;
        }   

        movablePiece.x -= this.speed * dt;
        if(movablePiece.x + movablePiece.width <= 0)
            movablePiece.x = this.game.width;
    },

    enablePhysics: function()
    {
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.allowRotation = false;
        this.sprite.body.drag.x = 0;
        this.sprite.body.friction.x = 0;
        this.sprite.body.allowGravity = false;
        this.sprite.body.maxVelocity.setTo(0, 0);
        this.sprite.body.immovable = true;
        this.sprite.body.setSize(20, 20, 0, 0);

        this.physicsEnabled = true;
    }
}