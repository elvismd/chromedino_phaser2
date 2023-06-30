chromedino.game = function(game)
{
    this.game = game;
}

chromedino.game.prototype = 
{
    init: function()
    {
        this.game.time.desiredFps = config.desiredFPS;
    },

    create: function()
    {
        this.game.stage.backgroundColor = "#ffffff";
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
        this.startedGame = false;
        this.gameOver = false;
        this.groundSpeed = 370;

        this.parallaxObjects = [];
        this.obstacles = [];

        this.graphicsHeight = -this.game.height * 0.2;

        this.grounds = [];
        for(var i = 0; i < 2; i++)
        {
            var originX = 0;
            if(i == 1)
            {
                originX = this.grounds[0].body.width;
            }

            var ground = this.game.add.sprite(originX, (this.game.height * .9) + this.graphicsHeight, 'ground');
            //this.ground.scale.setTo(0.2);
            
            this.game.physics.enable(ground, Phaser.Physics.ARCADE);
            ground.body.allowRotation = false;
            ground.body.drag.x = 0;
            ground.body.friction.x = 0;
            ground.body.allowGravity = false;
            ground.body.maxVelocity.setTo(0, 0);
            ground.body.immovable = true;
            ground.body.setSize(ground.body.width * 0.97, ground.body.height, 0, 0);
            ground.body.offset.setTo(0, ground.body.height * 1.1);

            this.grounds.push(ground);
        }

        this.baseParallaxSpeed = 130;

        this.newParallaxObj(new parallaxObject(this.game, this.game.width * 1.1, (this.game.height * .6) + this.graphicsHeight,  
                                                    this.baseParallaxSpeed + 30, 'moon', false));

        this.newParallaxObj(new parallaxObject(this.game, this.game.width, (this.game.height * .65) + this.graphicsHeight,  
                                                    this.baseParallaxSpeed + 60, 'cloud', false));
        this.newParallaxObj(new parallaxObject(this.game, this.game.width * 1.6, (this.game.height * .68) + this.graphicsHeight,  
                                                    this.baseParallaxSpeed + 60, 'cloud', false));

        this.newParallaxObj(new parallaxObject(this.game, this.game.width * 1, (this.game.height * .64) + this.graphicsHeight, 
                                                    this.baseParallaxSpeed + 35, 'star', false));
        this.newParallaxObj(new parallaxObject(this.game, this.game.width * 1.5, (this.game.height * .68) + this.graphicsHeight, 
                                                    this.baseParallaxSpeed + 35, 'star', false));

        this.birdShowElapsed = 5;
        this.bird = this.game.add.sprite(this.game.width, (this.game.height * .82) + this.graphicsHeight, 'bird');     
        this.bird.animations.add('idle');
        this.bird.animations.play('idle', 8, true);
        this.bird.flying = false;
        this.game.physics.enable(this.bird, Phaser.Physics.ARCADE);
        this.bird.body.allowRotation = false;
        this.bird.body.drag.x = 0;
        this.bird.body.friction.x = 0;
        this.bird.body.allowGravity = false;
        this.bird.body.maxVelocity.setTo(0, 0);
        this.bird.body.immovable = true;

        this.timerElapsedForObstacle = this.game.rnd.realInRange(4, 6);

        this.cactusNextIndex = 0;
        this.addObstacle(this.game.width, (this.game.height * .822) + this.graphicsHeight, [ 'cactus1' ]);
        this.addObstacle(this.game.width, (this.game.height * .822) + this.graphicsHeight, [ 'cactus2', 'cactus4' ]);
        this.addObstacle(this.game.width, (this.game.height * .822) + this.graphicsHeight, [ 'cactus3', 'cactus4' ]);
        this.addObstacle(this.game.width, (this.game.height * .822) + this.graphicsHeight, [ 'cactus2' ]);
        this.addObstacle(this.game.width, (this.game.height * .822) + this.graphicsHeight, [ 'cactus2', 'cactus4' ]);
        this.addObstacle(this.game.width, (this.game.height * .822) + this.graphicsHeight, [ 'cactus2', 'cactus3' ]);
        //this.addObstacle(this.game.width, this.game.height * .822, [ 'cactus1' ]);
     
        this.player = this.game.add.sprite(18,  ((this.game.height * .9) - 100) + this.graphicsHeight, 'player_idle');     
        this.player.anchor.setTo(0.5);
        this.player.animations.add('idle');
        this.player.animations.play('idle');
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 1400;
        this.player.body.maxVelocity.y = 600;
        this.player.onGround = false;
        this.player.body.onCollide = new Phaser.Signal();
        this.player.body.onCollide.add(function(sprite1, sprite2)
        {
            if(sprite2.y > sprite1.y && sprite1.onGround == false)
            {
                if(this.startedGame) { this.playAnim('player_walk', 'walk', this.player); }
                sprite1.onGround = true;
            }
        }, this);

        this.game.input.onUp.add(this.mouseUp, this);
        this.game.input.onDown.add(this.doJump, this);

        this.elapsedScoreTime = 0;

        this.score = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width - 4, (this.game.height * 0.55) + this.graphicsHeight, 'pixeled','00000', 32);
        this.scoreText.anchor.setTo(1, 0.5);

        this.highScore = null;

        this.highScoreText = this.game.add.bitmapText(this.game.width - 80, (this.game.height * 0.55) + this.graphicsHeight, 'pixeled','HI 00000', 32);
        this.highScoreText.anchor.setTo(1, 0.5);
        
        this.initialText = this.game.add.bitmapText(this.game.width * .5, (this.game.height * 0.65) + this.graphicsHeight, 'pixeled','Press Space to start', 32);
        this.initialText.anchor.setTo(0.5, 0.5);

        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.doJump, this);
    },

    newParallaxObj: function(po)
    {
        this.parallaxObjects.push(po);
        this.parallaxObjects[this.parallaxObjects.length - 1].initialX = this.parallaxObjects[this.parallaxObjects.length - 1].sprite.x;
        return this.parallaxObjects[this.parallaxObjects.length - 1];
    },

    addObstacle: function(x, y, names)
    {
        this.obstacle = this.game.add.physicsGroup(); //this.game.add.sprite(x, y, names[0]);     
        this.obstacle.enableBody = true;
        this.game.physics.enable(this.obstacle, Phaser.Physics.ARCADE);
        this.obstacle.create(x, y, names[0]);

        this.obstacle.canMove = false;
        this.obstacles.push(this.obstacle);

        for(var i = 1; i < names.length; i++)
        {
            this.obstacle.create(x + (i * this.game.rnd.realInRange(22, 26)), y, names[i]);
        }

        this.obstacle.children.forEach(function (sprite)
        {
            sprite.initialX = sprite.body.x;
            sprite.body.allowRotation = false;
            sprite.body.drag.x = 0;
            sprite.body.friction.x = 0;
            sprite.body.allowGravity = false;
            sprite.body.maxVelocity.setTo(0, 0);
            sprite.body.immovable = true;
        }, this);
    },

    doJump: function() 
    {
        if(this.player.onGround)
        {
            this.player.body.velocity.y = -600;
            this.player.onGround = false;
            this.playAnim('player_idle', 'idle', this.player);

            if(!this.startedGame)
            {
                this.playAnim('player_walk', 'walk', this.player);
                
                // reset bird
                this.bird.flying = false;
                this.bird.body.x = this.game.width;
                this.bird.x = this.game.width;
                
                //reset obstacles
                this.obstacles.forEach(function (obstacle)
                {      
                    obstacle.canMove = false;
                    obstacle.children.forEach(function (sprite)
                    {
                        sprite.body.x = sprite.initialX;
                        sprite.x = sprite.initialX;
                    }, this);
                }, this);
                this.cactusNextIndex = 0;
                this.timerElapsedForObstacle = this.game.rnd.realInRange(4, 6);

                this.parallaxObjects.forEach(function (parallaxObject)
                {
                    parallaxObject.sprite.x = parallaxObject.initialX;
                
                }, this);

                this.startedGame = true;
                this.gameOver = false;
                this.score = 0;
            }
        }
    },
    mouseUp: function() 
    {
        
    },

    doGameOver: function()
    {
        this.startedGame = false;
        this.playAnim('player_dead', 'dead', this.player);

        this.highScore = this.score;
        this.gameOver = true;


    },

    playAnim: function(name, animName, sprite)
    {
        sprite.loadTexture(name, 0);
        if(sprite.animations._anims[animName] === undefined)
            sprite.animations.add(animName);

        sprite.animations.play(animName, 12, true);
    },

    update: function()
    {
        this.initialText.visible = !this.startedGame;
        this.scoreText.visible = this.startedGame || this.gameOver;
        this.highScoreText.visible = this.highScore !== null && (this.startedGame || this.gameOver);

        var deltaTime = this.game.time.elapsed/1000;

        this.parallaxObjects.forEach(function (parallaxObject)
        {
            if(this.startedGame)
            {
                parallaxObject.update(deltaTime);

                if(parallaxObject.physicsEnabled)
                {
                    this.game.physics.arcade.collide(parallaxObject, this.player);
                    
                }
            }

        }, this);
        
        this.grounds.forEach(function (ground)
        {
            this.game.physics.arcade.collide(ground, this.player);
            if(this.startedGame)
            {
                ground.body.x -= this.groundSpeed * deltaTime;
                if(ground.body.x + ground.body.width <= 0)
                    ground.body.x = ground.body.width;
                
            }

        }, this);

        this.obstacles.forEach(function (obstacle)
        {
            if(this.startedGame)
            {
                if(obstacle.canMove)
                {
                    this.game.physics.arcade.overlap(this.player, [ obstacle ], this.doGameOver, null, this);   
                    var allChildrenAreHidden = true;
                    obstacle.children.forEach(function (sprite)
                    {
                        sprite.body.x -= this.groundSpeed * deltaTime;
                        if(sprite.body.x + sprite.body.width <= 0)
                        {
                            
                        }
                        else 
                        {
                            allChildrenAreHidden = false;
                        }
                    }, this);

                    if(allChildrenAreHidden)
                    {
                        obstacle.canMove = false;
                        obstacle.children.forEach(function (sprite)
                        {
                            sprite.body.x = sprite.initialX;
                            sprite.x = sprite.initialX;
                            
                        }, this);
                    }
                }             
            }

        }, this);

        if(this.startedGame)
        {
            this.timerElapsedForObstacle -= deltaTime;
            if(this.timerElapsedForObstacle <= 0)
            {
                //var nextRangeObst = this.game.rnd.integerInRange(0, this.obstacles.length - 1);
                this.obstacles[this.cactusNextIndex++].canMove = true;
                this.timerElapsedForObstacle = this.game.rnd.realInRange(1, 5);

                if(this.cactusNextIndex >= this.obstacles.length)
                {
                    this.cactusNextIndex = 0;
                }
            }

            this.game.physics.arcade.overlap(this.player, [this.bird], this.doGameOver, null, this);   
            



            if(this.bird.flying)
            {
                this.bird.body.x -= this.groundSpeed * deltaTime;
                if(this.bird.body.x + this.bird.body.width <= 0)
                {
                    this.bird.body.x = this.game.width;
                    this.bird.flying = false;
                }
            }
            
            //this.birdShowElapsed -= deltaTime;
            if(this.birdShowElapsed <= 0)
            {
                this.bird.flying = true;
                this.birdShowElapsed = this.game.rnd.integerInRange(6, 17);
            }

            this.elapsedScoreTime += deltaTime;
            if(this.elapsedScoreTime >= 0.1)
            {
                this.score += 1;

                var finalScore = this.score + "";
                var neededZeroes = 5 - finalScore.length;
                for(var i = 0; i < neededZeroes; i++)
                {
                    finalScore = "0" + finalScore;
                }

                this.scoreText.text = finalScore;

                this.elapsedScoreTime = 0;
            }
            
        }

        if(this.highScore !== null)
        {
            var finalHighScore = this.highScore + "";
            var needeHSZeroes = 5 - finalHighScore.length;
            for(var i = 0; i < needeHSZeroes; i++)
            {
                finalHighScore = "0" + finalHighScore;
            }

            this.highScoreText.text = "HI " + finalHighScore;
        }
    },

    render: function()
    {
        return;
        this.game.debug.body(this.player);
        this.game.debug.body(this.bird);
        this.grounds.forEach(function (ground)
        {
            this.game.debug.body(ground);

        }, this);

        this.obstacles.forEach(function (obstacles)
        {
            obstacles.children.forEach(function (obstacle)
            {
                this.game.debug.body(obstacle);
    
            }, this);
    
        }, this);

        this.parallaxObjects.forEach(function (parallaxObject)
        {
            if(this.startedGame)
            {
                if(parallaxObject.physicsEnabled)
                {
                    this.game.debug.body(parallaxObject);
                    console.log("colliding d");
                }
            }

        }, this);
    }
};
