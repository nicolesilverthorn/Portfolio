var messageObject =
{
	x: 0,
	y: 0,
	visible: true,
	text: "Message",
	font: "normal bold 20px Helvetica",
	fillStyle: "red",
	textBaseline: "top"
};

var GameStateClass =
{
    States:
	{
	    START: 0,
	    RUNNING: 1,
	    PAUSE: 2,
	    GAME_OVER: 3
	},

    gameObjects: undefined,
    staticGameObjects: undefined,
    player: undefined,
    level: undefined,
    camera: undefined,
    state: undefined,

    tunnelEnd1: undefined,
    tunnelEnd2:undefined,

    endLevelRect1: undefined,
    endLevelRect2: undefined,

    bloodWater1: undefined, 
    bloodWater2: undefined,

    bloodRect1: undefined,
    bloodRect2: undefined,

    bloodRects: undefined,

    splashScreen: undefined,
    gameOverScreen: undefined,
    healthBG: undefined,
    healthTransition: undefined,
    healthFG: undefined,
    healthBarRatio: 1.0,

    score: undefined,
    scoreDisplay: undefined,
	messages: undefined,

    healthBarWidth: 246,
    healthBarTransWidth: 246,
    lastHealthTransition: 246,  // the start width of the transition the health bar is taking

    init: function (id, canvasWidth, canvasHeight, assets)
    {
        this.bloodRects = new Array();
        this.state = States.DEFAULT;
        this.splashScreen = assets[SPLASH_SCREEN];
        this.gameOverScreen = assets[GAME_OVER_SCREEN];
        this.healthBG = assets[HEALTH_BG];
        this.healthFG = assets[HEALTH_FG];
        this.healthTransition = assets[HEALTH_TRANSITION];
        this.score = 0;

        this.gameObjects = new Array();
        this.staticGameObjects = new Array();
        this.player = Object.create(PlayerClass);
        this.gameObjects.push(this.player);		

        this.level = Object.create(LevelClass);
        this.level.init(assets[SPRITE_ATLAS], 0, 0, 14464, 512, id);
        this.loadGameObjects(assets);

        this.camera = Object.create(CameraClass);
        this.camera.x = 0;
        this.camera.y = 0;
        this.camera.width = canvasWidth;
        this.camera.height = canvasHeight;

        for (var i = 0; i < this.gameObjects.length; ++i)
        {
            this.gameObjects[i].spriteAnim.play(true);
        }

        for (var i = 0; i < this.staticGameObjects.length; ++i)
        {
            this.staticGameObjects[i].spriteAnim.play(true);
        }
		
		this.scoreDisplay = Object.create(messageObject);
		this.scoreDisplay.font = "normal bold 20px emulogic";
		this.scoreDisplay.fillStyle = "#FFFFFF";
		this.scoreDisplay.x = 0;
		this.scoreDisplay.y = 35;
		this.messages = [];
		this.messages.push(this.scoreDisplay);
    },

    loadGameObjects: function (assets)
    {
        for (var i = 0; i < this.level.gameObjects.length; ++i)
        {
            var currData = this.level.gameObjects[i];
            switch (currData.type)
            {
                case GameObjectData.PLAYER:
                    this.player.init(assets, currData.x, currData.y - 50, 64, 64, 0, 4, 128, currData.x, currData.y - 50, 64, 64);
                    break;
					
                case GameObjectData.BULLET_RIGHT:
                    var bullet_right = Object.create(GameObjectClass);
                    this.gameObjects.push(this.bullet_right);
                    this.bullet_right.init(assets[SPRITE_ATLAS], currData.x, currData.y - 50, 64, 64, 4, 1, 128, currData.x, currData.y - 50, 64, 64);

                    this.bullet_right_rect = Object.create(RectClass);
                    this.bullet_right_rect.init(currData.x + 20, currData.y, 1, this.level.tileSize, 0);
                    break;
                
				case GameObjectData.BULLET_LEFT:
                    var bullet_left = Object.create(GameObjectClass);
                    this.gameObjects.push(this.bullet_left);
                    this.bullet_left.init(assets[SPRITE_ATLAS], currData.x, currData.y - 50, 64, 64, 12, 1, 128, currData.x, currData.y - 50, 64, 64);

                    this.bullet_left_rect = Object.create(RectClass);
                    this.bullet_left_rect.init(currData.x - 20, currData.y, 1, this.level.tileSize, 0);
                    break;
                
                case GameObjectData.TURTLE_ZOMBIE:
                    var turtleZombie = Object.create(PlatformEnemy);
                    turtleZombie.init(this.level, assets[SPRITE_ATLAS], currData.x, currData.y, 64, 64, 24, 2, 128, currData.x, currData.y, 64, 64);
                    this.gameObjects.push(turtleZombie);
                    break;

                case GameObjectData.GROUND_ZOMBIE:
                    var groundZombie = Object.create(GroundEnemy);
                    groundZombie.init(this.level, assets[SPRITE_ATLAS], currData.x, currData.y, 64, 64, 56, 4, 128, currData.x, currData.y, 64, 64);
                    this.gameObjects.push(groundZombie);
                    break;

                case GameObjectData.TUNNEL_TOP_1:
                    var tunnelEnd1 = Object.create(GameObjectClass);
                    tunnelEnd1.init(assets[SPRITE_ATLAS], currData.x, currData.y, 64, 64, 46, 1, 128, currData.x, currData.y, 64, 64);
                    this.staticGameObjects.push(tunnelEnd1);

                    this.endLevelRect1 = Object.create(RectClass);
                    this.endLevelRect1.init(currData.x + this.level.tileSize / 2, currData.y, 1, this.level.tileSize, 0);
					break;
					
                case GameObjectData.TUNNEL_TOP_2:
                    var tunnelEnd2 = Object.create(GameObjectClass);
                    tunnelEnd2.init(assets[SPRITE_ATLAS], currData.x, currData.y, 64, 64, 47, 1, 128, currData.x, currData.y, 64, 64);
                    this.staticGameObjects.push(tunnelEnd2);

                    this.endLevelRect2 = Object.create(RectClass);
                    this.endLevelRect2.init(currData.x + this.level.tileSize / 2, currData.y, 1, this.level.tileSize, 0);
                    break;

                case GameObjectData.BLOODY_WATER_1:
                    var bloodWater1 = Object.create(GameObjectClass);
                    bloodWater1.init(assets[SPRITE_ATLAS], currData.x, currData.y, 64, 64, 19, 1, 128, currData.x, currData.y, 64, 64);
                    this.staticGameObjects.push(bloodWater1);

                    var tempRect = Object.create(RectClass);
                    tempRect.init(currData.x + this.level.tileSize, currData.y, this.level.tileSize, this.level.tileSize, 0);
                    this.bloodRects.push(tempRect);
                    break;

                case GameObjectData.BLOODY_WATER_2:
                    var bloodWater2 = Object.create(GameObjectClass);
                    bloodWater2.init(assets[SPRITE_ATLAS], currData.x, currData.y, 64, 64, 20, 1, 128, currData.x, currData.y, 64, 64);
                    this.staticGameObjects.push(bloodWater2);

                    var tempRect = Object.create(RectClass);
                    tempRect.init(currData.x + this.level.tileSize, currData.y, this.level.tileSize, this.level.tileSize, 0);
                    this.bloodRects.push(tempRect);
                    break;
            }
        }
    },

    updateHealthBar: function (deltaTime)
    {
        this.healthBarRatio = this.player.health / PLAYER_START_HEALTH;

        this.healthBarRatio = clamp(this.healthBarRatio, 0, 1);

        var healthCurrWidth = this.healthBarRatio * this.healthBarWidth

        //get difference between last width and current
        var diff = this.lastHealthTransition - healthCurrWidth;

        //interpolate transition width from current transition to current actual by the difference * the ratio of time elapsed to transition time
        var timeRatio = deltaTime / HEALTH_TRANSITION_TIME;

        this.healthBarTransWidth -= (diff * timeRatio);

        if (this.healthBarTransWidth <= healthCurrWidth)
        {
            this.lastHealthTransition = this.healthBarTransWidth;
        }
    },

    endGame: function ()
    {
        this.state = States.GAME_OVER;
    },

    update: function (deltaTime, keys)
    {
        if (this.player.state == States.INACTIVE)
        {
            this.endGame();
            this.curState == States.GAME_OVER;
        }
        this.player.vx += this.level.gravity.x * deltaTime;
        this.player.vy += this.level.gravity.y * deltaTime;
        this.player.updateDirection(keys);
        this.player.update(deltaTime);
        this.camera.update(this.player);
        this.camera.clampLevel(this.level);

        for (var i = 0; i < this.gameObjects.length; ++i)
        {
            if (this.gameObjects[i].update != undefined)
            {
                this.gameObjects[i].update(deltaTime);
            }
        }

        for (var i = 0; i < this.staticGameObjects.length; ++i)
        {
            if (this.staticGameObjects[i].update != undefined)
            {
                this.staticGameObjects[i].update(deltaTime);
            }
        }

        this.checkLevelCollision();
        this.checkLevelGoal();
        this.checkWaterDeath();
        this.checkStaticGameObjectCollision();
        this.checkGameObjectCollision();
        this.clampGameObjectInLevel(this.player);
        this.getPlayerFriction();
        this.updatePlayerGrounded();
        this.checkBulletCollision();
        this.updateHealthBar(deltaTime);
		
		this.scoreDisplay.text = "SCORE:" + this.score;
    },

    getPlayerFriction : function()
    {
        var x = this.player.collisionRect.x + this.player.collisionRect.width / 2;
        var y = this.player.collisionRect.y + this.player.collisionRect.height + 1;
        this.player.groundFriction = this.level.getFriction(x, y);
        this.player.acceleration = this.player.PLAYER_DEFAULT_ACCELERATION * this.level.getAcceleration(x, y);
    },

    checkLevelGoal: function ()
    {
        var side1 = AARectToRectCollision(this.player.collisionRect, this.endLevelRect1);
		var side2 = AARectToRectCollision(this.player.collisionRect, this.endLevelRect2);
        if (side1 == "bottom" || side2 == "bottom")
        {
            this.endGame();
        }
    },

    checkWaterDeath: function ()
    {
        for (var i = 0; i < this.bloodRects.length; ++i)
        {
            var side = AARectToRectCollision(this.player.collisionRect, this.bloodRects[i]);
            if (side != "none")
            {
                this.endGame();
            }
        }
    },

    updatePlayerGrounded: function ()
    {
        if (LevelClass.isTileCollidable(this.level.getTileValue(this.player.collisionRect.x + this.player.collisionRect.width / 2, this.player.collisionRect.y + 
            this.player.collisionRect.height).type))
        {
            this.player.grounded = true;
        }
        else
        {
            this.player.grounded = false;
        }
    },

    checkBulletCollision: function ()
    {
        for (var i = 0; i < this.player.bullets.length; ++i)
        {
            for(var j = 0; j < this.gameObjects.length; ++j)
            {
                var side = AARectToRectCollision(this.player.bullets[i].collisionRect, this.gameObjects[j].collisionRect);
                if (side != "none")
                {
                    this.score += 100;

                    this.player.bullets.splice(i, 1);
                    i--;
                    this.gameObjects.splice(j, 1);
                    j--;
                    continue;
                }
            }
        }
    },

    checkGameObjectCollision: function ()
    {
        for (var i = 0; i < this.gameObjects.length; ++i)
        {
            var side = AARectToRectCollision(this.player.collisionRect, this.gameObjects[i].collisionRect);
            if (side == "bottom")
            {
                this.player.vy = -ENEMY_BOUNCE_AMT;
                this.gameObjects.splice(i, 1);
                i--;
                continue;
            }
            else
            {
                if (side != "none")
                {
					//console.log("damaged player");
                    this.player.applyDamage(2/*this.gameObjects[i].damageAmt*/);
                }
            }
        }
    },

    checkStaticGameObjectCollision: function ()
    {
        for (var i = 0; i < this.staticGameObjects.length; ++i)
        {
            var side = AARectToRectCollision(this.player.collisionRect, this.staticGameObjects[i].collisionRect);
            if (side == "bottom")
            {
                this.player.vy = -ENEMY_BOUNCE_AMT;
                i--;
                continue;
            }
            else
            {
                if (side != "none")
                {
                    //console.log("damaged player");
                }
            }
        }
    },

    checkLevelCollision: function ()
    {
        for (var i = 0; i < this.level.collisionRects.length; ++i)
        {
            var side = AARectToRectCollision(this.player.collisionRect, this.level.collisionRects[i]);
            if (side == "bottom")
            {
                this.player.vy = 0;
                this.player.grounded = true;
            }
            else if (side == "top")
            {
                this.player.vy = 0;
            }
            this.player.spriteAnim.rect.setPos(this.player.collisionRect.x, this.player.collisionRect.y);
        }
    },
    
    clampGameObjectInLevel: function (gameObject)
    {
        var levelWidth = 14464;
        var levelHeight = 512;

        gameObject.collisionRect.x = clamp(gameObject.collisionRect.x, this.level.left, levelWidth - gameObject.collisionRect.width);

        gameObject.collisionRect.y = clamp(gameObject.collisionRect.y, this.level.top, (levelHeight - gameObject.collisionRect.height) -2 );

        gameObject.spriteAnim.rect.x = gameObject.collisionRect.x;
        gameObject.spriteAnim.rect.y = gameObject.collisionRect.y;
    },

    render: function (context)
    {
        context.save();
        context.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));
        this.level.render(context);
		
        for (var i = 0; i < this.gameObjects.length; ++i)
        {
            this.gameObjects[i].spriteAnim.render(context);
        }

        for (var i = 0; i < this.staticGameObjects.length; ++i)
        {
            this.staticGameObjects[i].spriteAnim.render(context);
        }
        this.player.spriteAnim.render(context);

        for (var i = 0; i < this.player.bullets.length; ++i)
        {
            this.player.bullets[i].spriteAnim.render(context);
        }

        context.restore();

        context.drawImage(this.healthBG, 0, 0, this.healthBarWidth, 32, 0, 0, 256, 32);
        context.drawImage(this.healthTransition, 0, 0, this.healthBarWidth, 32, 5, 0, this.healthBarTransWidth, 32);
        context.drawImage(this.healthFG, 0, 0, this.healthBarWidth, 32, 5, 0, this.healthBarWidth * this.healthBarRatio, 32);
		
		if(this.messages.length != 0)
		{
			for(var i = 0; i < this.messages.length; i++)
			{
				var message = this.messages[i];
				if(message.visible)
				{
					context.font = message.font;  
					context.fillStyle = message.fillStyle;
					context.textBaseline = message.textBaseline;
					context.fillText(message.text, message.x, message.y);  
				}
			}
		}
    }
};