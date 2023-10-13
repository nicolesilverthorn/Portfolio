var PlayerClass = Object.create(GameObjectClass);
PlayerClass.PLAYER_DEFAULT_ACCELERATION = 100;
PlayerClass.JUMP_RIGHT_ANIM = 0;
PlayerClass.JUMP_LEFT_ANIM = 1;
PlayerClass.DEFAULT_ANIM = 2;  //default anim is walk right
PlayerClass.WALK_LEFT_ANIM = 3;
PlayerClass.DEAD_ANIM = 4;
PlayerClass.inputDirection = undefined;
PlayerClass.baseInit = PlayerClass.init;
PlayerClass.state = undefined;
PlayerClass.toggleAlphaTimer = undefined;
PlayerClass.acceleration = 100;
PlayerClass.groundFriction = 0.9;
PlayerClass.assets;
PlayerClass.anims = new Array();
PlayerClass.bullet_right = undefined;
PlayerClass.bullet_left = undefined;
PlayerClass.bullets = new Array();
PlayerClass.spriteAtlas = undefined;
timer: undefined;

PlayerClass.init = function (assets, x, y, frameWidth, frameHeight, startFrame, numFrames,
							 frameRate, collisionX, collisionY, collisionWidth, collisionHeight)
{
    PlayerClass.spriteAtlas = assets[SPRITE_ATLAS];
    this.assets = assets;
    this.state = States.DEFAULT;
    this.baseInit(assets[SPRITE_ATLAS], x, y, frameWidth, frameHeight, startFrame, numFrames,
				  frameRate, collisionX, collisionY, collisionWidth, collisionHeight);
    this.inputDirection = Object.create(VectorClass);
    this.inputDirection.x = 0;
    this.inputDirection.y = 0;
    this.health = PLAYER_START_HEALTH;

    var jumpRightAnim = Object.create(SpriteAnimClass);
    jumpRightAnim.init(assets[SPRITE_ATLAS], x, y, frameWidth, frameHeight, 28, 1, frameRate);
    this.anims[this.JUMP_RIGHT_ANIM] = jumpRightAnim;

    var jumpLeftAnim = Object.create(SpriteAnimClass);
    jumpLeftAnim.init(assets[SPRITE_ATLAS], x, y, frameWidth, frameHeight, 27, 1, frameRate);
    this.anims[this.JUMP_LEFT_ANIM] = jumpLeftAnim;

    var defaultAnim = Object.create(SpriteAnimClass);   //walk right
    defaultAnim.init(assets[SPRITE_ATLAS], x, y, frameWidth, frameHeight, 0, 4, frameRate);
    this.anims[this.DEFAULT_ANIM] = defaultAnim;

    var walkLeftAnim = Object.create(SpriteAnimClass);
    walkLeftAnim.init(assets[SPRITE_ATLAS], x, y, frameWidth, frameHeight, 8, 4, frameRate);
    this.anims[this.WALK_LEFT_ANIM] = walkLeftAnim;

    var deadAnim = Object.create(SpriteAnimClass);
    deadAnim.init(assets[SPRITE_ATLAS], x, y, frameWidth, frameHeight, 26, 1, frameRate);
    this.anims[this.DEAD_ANIM] = deadAnim;

    this.spriteAnim = defaultAnim;
};

var shoot = false;
var isFacingRight = true;

PlayerClass.fireBullet = function ()
{
    if (canShoot)
    {
        if (shoot)
        {
            this.addBullet();
            weaponCooldownTimer = 1;
        }
    }
};

PlayerClass.addBullet = function ()
{
	if (isFacingRight)
	{
		canShoot = false;
		this.bullet_right = Object.create(GameObjectClass);
		this.bullet_right.update = function (deltaTime)
		{
			this.translate(this.vx * deltaTime, this.vy * deltaTime);

		};
		this.bullet_right.init(this.spriteAtlas, this.collisionRect.x + 30, this.collisionRect.y, 64, 64, 4, 1, 128, this.collisionRect.x, this.collisionRect.y, 64, 64);
		this.bullet_right.vx = 600;
		this.bullets.push(this.bullet_right);
	}
	else
	{
		canShoot = false;
		this.bullet_left = Object.create(GameObjectClass);
		this.bullet_left.update = function (deltaTime)
		{
			this.translate(this.vx * deltaTime, this.vy * deltaTime);
		};
		this.bullet_left.init(this.spriteAtlas, this.collisionRect.x - 30, this.collisionRect.y, 64, 64, 12, 1, 128, this.collisionRect.x, this.collisionRect.y, 64, 64);
		this.bullet_left.vx = -600;
		this.bullets.push(this.bullet_left);
	}    
};

PlayerClass.updateDirection = function (keysPressed)
{
    this.inputDirection.x = 0;
    this.inputDirection.y = 0;
    for (var i = 0; i < keysPressed.length; ++i)
    {
        switch (keysPressed[i])
        {
        case RIGHT:
            isFacingRight = true;
            this.inputDirection.x += 1;
            this.spriteAnim = this.anims[this.DEFAULT_ANIM];
            this.spriteAnim.play(true);
            break;
				
        case LEFT:
            isFacingRight = false;
            this.inputDirection.x -= 1;
            this.spriteAnim = this.anims[this.WALK_LEFT_ANIM];
            this.spriteAnim.play(true);
            break;

        case SPACE:
            this.fireBullet();
            break;

        case UP:
            this.jump();
            if (isFacingRight)
            {
                this.spriteAnim = this.anims[this.JUMP_RIGHT_ANIM];
                this.spriteAnim.play(true);
            }
            else
            {
                this.spriteAnim = this.anims[this.JUMP_LEFT_ANIM];
                this.spriteAnim.play(true);
            }
            break;
        }
    }
};

PlayerClass.toggleAlpha = function ()
{
    if (this.spriteAnim.alpha == 1)
    {
        this.spriteAnim.alpha = 0;
    }
    else
    {
        this.spriteAnim.alpha = 1;
    }
    var self = this;
    this.toggleAlphaTimer = setTimeout(function () { self.toggleAlpha(); }, PLAYER_FLASH_LENGTH);
}

var canShoot = true;
var previousTime = Date.now();
var weaponCooldownTimer = 1;

PlayerClass.update = function (deltaTime)
{
    var deltaTime = (Date.now() - previousTime) / 1000;
    previousTime = Date.now();
    
    if (shoot)
    {
        //console.log("shoot true");
    }

    if (!canShoot)
    {
        //shoot = false;
        weaponCooldownTimer -= deltaTime;
        //console.log(weaponCooldownTimer);
        if(weaponCooldownTimer <= 0)
        {
            weaponCooldownTimer = 1;
            canShoot = true;
        }
    
    }

    if (this.inputDirection.x > 0 && this.vx < 0 ||
        this.inputDirection.x < 0 && this.vx > 0 ||
        this.inputDirection.x == 0)
    {
        this.vx *= this.groundFriction;
    }
    this.vy *= AIR_FRICTION;

    switch (this.state)
    {
        case States.DEFAULT:
		
        case States.INVULNERABLE:
            this.inputDirection.normalize();
            this.inputDirection.scale(this.acceleration);
            this.vx += this.inputDirection.x * deltaTime;
            this.vy += this.inputDirection.y * deltaTime;
            this.translate(this.vx * deltaTime, this.vy * deltaTime);
            break;

        case States.DEAD:
            this.translate(this.vx * deltaTime, this.vy * deltaTime);
            break;

        case States.GAME_OVER:
            if (this.state != States.GAME_OVER)
            {
                this.state = States.GAME_OVER;
            }
            break;
    }

    for (var i = 0; i < this.bullets.length; ++i)
    {
        this.bullets[i].update(deltaTime);

        if (this.bullets[i] > CANVAS_WIDTH)
        {
            this.bullets.splice(i);
            i--;
        }
        else if (this.bullets[i] < 0)
        {
            this.bullets.splice(i);
            i--;
        }
    }
    this.fireBullet();

};

PlayerClass.setDefaultState = function ()
{
    this.state = States.DEFAULT;
    clearTimeout(this.toggleAlphaTimer);
    this.spriteAnim.alpha = 1;
}

PlayerClass.removeFromGame = function ()
{
    this.state = States.INACTIVE;
}

PlayerClass.applyDamage = function (amount)
{
    if (this.state == States.INVULNERABLE)
    {
        //console.log("Can't touch this!!! player invulnerable");
        return;
    }
    this.health -= amount;
    if (this.health <= 0)
    {
        this.state = States.DEAD;
        this.spriteAnim = this.anims[this.DEAD_ANIM];
        this.spriteAnim.play(true);
        var self = this;
        setTimeout(function () { self.removeFromGame(); }, PLAYER_DEATH_TIME);
		this.state = States.GAME_OVER;
    }
    else
    {
        this.state = States.INVULNERABLE;
        var self = this;
        setTimeout(function () { self.setDefaultState(); }, PLAYER_INVULNERABLE_TIME);
        this.spriteAnim.alpha = 0;
        this.toggleAlphatimer = setTimeout(function () { self.toggleAlpha(); }, PLAYER_FLASH_LENGTH);
    }
};

PlayerClass.left = function () 
{
    return this.spriteAnim.rect.x;
};

PlayerClass.top = function () 
{
    return this.spriteAnim.rect.y;
};

PlayerClass.right = function () 
{
	return this.spriteAnim.rect.x + this.spriteAnim.rect.width;
};

PlayerClass.bottom = function () 
{
	return this.spriteAnim.rect.y +	this.spriteAnim.rect.height;
}