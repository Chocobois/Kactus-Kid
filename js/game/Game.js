
var Kid = Kid || {};

Kid.Game = function()
{
	this.Player = new Player();
	this.Stage = new Stage();
};

Kid.Game.prototype.create = function ()
{
	Kid.game.physics.arcade.gravity.y = 1300;

	//this.entities = Kid.game.add.group();

	this.Player.create(
		SCREEN_WIDTH / 2,
		SCREEN_HEIGHT * 3 / 4
	);

	this.Stage.create();

	this.camera.follow( this.Player.sprite );

	this.debugToggle = Kid.game.input.keyboard.addKey( Phaser.Keyboard.Q );
};

Kid.Game.prototype.preRender = function ()
{
	if ( this.game.paused )
	{
		return;
	}

	this.Player.preRender();
};

Kid.Game.prototype.update = function ()
{
	this.handleCollisions();

	this.Player.update();

	if ( this.Player.sprite.y > SCREEN_HEIGHT + 100 )
	{
		this.state.start( 'Game' );
	}

	if ( this.debugToggle.justDown )
		Kid.debug = !Kid.debug;
};

Kid.Game.prototype.handleCollisions = function ()
{
	this.physics.arcade.collide( this.Player.sprite, this.Stage.stationary );

	this.physics.arcade.collide( this.Player.sprite, this.Stage.moving, this.customSep, null, this );

	Kid.game.physics.arcade.collide( this.Player.sprite, this.Stage.balloons, function( playerSprite, balloonSprite ) {
		balloonSprite.kill();
	}, null, this );

	Kid.game.physics.arcade.collide( this.Player.sprite, this.Stage.goal, function() {
		//this.state.start( 'Game', Phaser.Plugin.StateTransition.Out.SlideUp, Phaser.Plugin.StateTransition.In.SlideUp );
		this.state.start( 'Game' );
	}, null, this );
};

Kid.Game.prototype.customSep = function ( playerSprite, platformSprite )
{
	if ( !playerSprite.owner.locked && playerSprite.body.velocity.y > 0 && Kid.game.time.now > platformSprite.owner.lockTimer )
	{
		playerSprite.owner.locked = true;
		playerSprite.owner.lockedTo = platformSprite;
		platformSprite.owner.playerLocked = true;

		playerSprite.body.velocity.y = 0;
	}

	this.physics.arcade.collide( playerSprite, platformSprite );
};

Kid.Game.prototype.render = function ()
{
	this.Player.render();
	this.Stage.render();
};
