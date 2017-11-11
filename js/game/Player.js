
function Player ()
{
}

Player.prototype.create = function ( x, y )
{
	this.speed = 350;

	//this.sprite = group.create( x, y, 'cactus', 0 );
	this.sprite = Kid.game.add.sprite( x, y, 'mario', 0 );
	this.sprite.owner = this;
	Kid.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.sprite.scale.set( 3 );
	this.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	this.setupAnimation();

	this.locked = false;
	this.lockedTo = null;
	this.wasLocked = false;
	this.willJump = false;
	this.willDrop = false;

	this.keys = Kid.game.input.keyboard.createCursorKeys();
	this.keys.w = Kid.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Kid.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Kid.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Kid.game.input.keyboard.addKey( Phaser.Keyboard.D );

	this.keys.space = Kid.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
	this.jumpTimer = 0;
};

Player.prototype.setupAnimation = function ()
{
	this.sprite.animations.add( 'duck', [0], 1, true );
	this.sprite.animations.add( 'idle', [1], 1, true );
	this.sprite.animations.add( 'skid', [6], 1, true );
	this.sprite.animations.add( 'walk', [3,5,4], 12, true );
	this.sprite.animations.add( 'jump', [6], 1, true );

	this.setAnimation( 'idle' );
};

Player.prototype.setAnimation = function ( newState )
{
	if ( this.state != newState )
	{
		this.sprite.animations.play( newState );
	}
};

Player.prototype.preRender = function ()
{
	if (this.locked || this.wasLocked)
	{
		this.sprite.x += this.lockedTo.deltaX;
		this.sprite.y = this.lockedTo.y - 40;

		if (this.sprite.body.velocity.x !== 0)
		{
			this.sprite.body.velocity.y = 0;
		}
	}

	if (this.willJump)
	{
		this.willJump = false;

		if (this.lockedTo && this.lockedTo.deltaY < 0 && this.wasLocked)
		{
			//  If the platform is moving up we add its velocity to the players jump
			this.sprite.body.velocity.y = -650 + (this.lockedTo.deltaY * 10);
		}
		else
		{
			this.sprite.body.velocity.y = -650;
		}

		this.jumpTimer = Kid.game.time.now + 10;
	}

	if (this.willDrop && this.wasLocked)
	{
		this.willDrop = false;

		this.sprite.body.velocity.y = 650/4;

		this.jumpTimer = Kid.game.time.now + 10;
		this.lockedTo.owner.lockTimer = Kid.game.time.now + 100;
	}

	if (this.wasLocked)
	{
		this.wasLocked = false;
		this.lockedTo.owner.playerLocked = false;
		this.lockedTo = null;
	}
};

Player.prototype.update = function ()
{
	var onFloor = this.sprite.body.touching.down || this.sprite.body.blocked.down || this.locked;

	var p = new Phaser.Point( 0, 0 );
	var left = this.keys.left.isDown || this.keys.a.isDown;
	var right = this.keys.right.isDown || this.keys.d.isDown;
	var down = this.keys.down.isDown || this.keys.s.isDown;
	if ( left )
	{
		p.x -= 1;
	}
	if ( right )
	{
		p.x += 1;
	}
	if ( down && onFloor )
	{
		p.x = 0;
	}

	p.setMagnitude( this.speed );
	if ( onFloor )
	{
		this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 3;
	}
	else if ( p.getMagnitude() > 0 )
	{
		this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 20;
	}


	if ( ( this.keys.space.justDown || this.keys.up.justDown ) )
	{
		if ( onFloor && Kid.game.time.now > this.jumpTimer )
		{
			if (this.locked)
			{
				this.cancelLock();
			}

			if ( down && !left && !right )
			{
				this.willDrop = true;
			}
			else
			{
				this.willJump = true;
			}
		}
	}

	if (this.locked)
	{
		this.checkLock();
	}

	if ( ( this.keys.space.isDown || this.keys.up.isDown ) && this.sprite.body.velocity.y <= 0 )
	{
		this.sprite.body.gravity.y = 0;
	}
	else
	{
		this.sprite.body.gravity.y = 1500;
	}


	var v = this.sprite.body.velocity;
	if ( !onFloor )
	{
		this.setAnimation( 'jump' );
	}
	else if ( down && !left && !right )
	{
		this.setAnimation( 'duck' );
	}
	else if ( Math.abs( v.x ) > 20 )
	{
		this.sprite.scale.x = v.x > 0 ? 3 : -3;
		this.setAnimation( 'walk' );
	}
	else
	{
		this.setAnimation( 'idle' );
	}
};

Player.prototype.render = function ()
{
	if ( Kid.debug )
	{
		Kid.game.debug.body( this.sprite, RED );
	}
};

Player.prototype.checkLock = function ()
{
	this.sprite.body.velocity.y = 0;

	//  If the player has walked off either side of the platform then they're no longer locked to it
	if ( this.sprite.body.right < this.lockedTo.body.x || this.sprite.body.x > this.lockedTo.body.right )
	{
		this.cancelLock();
	}
};

Player.prototype.cancelLock = function ()
{
	this.wasLocked = true;
	this.locked = false;
};