
function Player ()
{
}

Player.prototype.create = function ( x, y )
{
	this.speed = 350;

	//this.sprite = group.create( x, y, 'cactus', 0 );
	this.sprite = Kid.game.add.sprite( x, y, 'cactus', 0 );
	this.sprite.owner = this;
	Kid.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.sprite.scale.set( 0.1 );

	//this.setupAnimation();

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
	var len = 6;
	var idle = [0,0,0,0,0,0,0,0,0,0,0,0,0,1];
	var walk = [3,4,5,2];
	var hurt = [1];
	this.sprite.animations.add( 'idle_right', idle, 8, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	this.sprite.animations.add( 'hurt_right', hurt, 8, false );
	idle = idle.map( n => n + len );
	walk = walk.map( n => n + len );
	hurt = hurt.map( n => n + len );
	this.sprite.animations.add( 'idle_down', idle, 8, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	this.sprite.animations.add( 'hurt_down', hurt, 8, false );
	idle = idle.map( n => n + len );
	walk = walk.map( n => n + len );
	hurt = hurt.map( n => n + len );
	this.sprite.animations.add( 'idle_left', idle, 8, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	this.sprite.animations.add( 'hurt_left', hurt, 8, false );
	idle = idle.map( n => n + len );
	walk = walk.map( n => n + len );
	hurt = hurt.map( n => n + len );
	this.sprite.animations.add( 'idle_up', idle, 8, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );
	this.sprite.animations.add( 'hurt_up', hurt, 8, false );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );

	this.swing.animations.add( 'attack', [1,1,1,1,2,3], 60, false );

	this.stepCooldown = 0;
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	if ( this.damageState == 'dead' )
		return;

	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		name = '{0}_{1}'.format( newState, newDirection );
		this.state = newState;
		this.direction = newDirection;
	}

	if ( name )
	{
		this.sprite.animations.play( name );
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
	//if ( this.keys.up.isDown || this.keys.w.isDown )
	//	p.y -= 1;
	//if ( this.keys.down.isDown || this.keys.s.isDown )
	//	p.y += 1;
	if ( this.keys.left.isDown || this.keys.a.isDown )
		p.x -= 1;
	if ( this.keys.right.isDown || this.keys.d.isDown )
		p.x += 1;

	p.setMagnitude( this.speed );
	if ( onFloor )
	{
		this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 3;
	}
	else if ( p.getMagnitude() > 0 )
	{
		this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 20;
	}

	/*
	if ( p.getMagnitude() > 0 )
	{
		var direction;
		if ( Math.abs( p.x ) >= Math.abs( p.y ) )
			direction = p.x > 0 ? 'right' : 'left';
		else
			direction = p.y > 0 ? 'down' : 'up';
		this.setAnimation( 'walk', direction );

		this.trailCooldown -= 1;
		if ( this.trailCooldown < 0 )
		{
			this.trailCooldown = 10;
			this.trail.x = this.sprite.body.center.x - p.x/this.speed*4;
			this.trail.y = this.sprite.body.center.y - p.y/this.speed*2 + 4;
			this.trail.start( true, 4000, null, 1 );
		}
	}
	else
	{
		this.setAnimation( 'idle', this.direction );
	}
	*/

	if ( this.keys.space.justDown || this.keys.up.justDown )
	{
		if ( onFloor && Kid.game.time.now > this.jumpTimer )
		{
			if (this.locked)
			{
				this.cancelLock();
			}

			if ( this.keys.down.isDown )
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