
var Kid = Kid || {};

Kid.Game = function()
{
	this.Player = new Player();
	this.Stage = new Stage();
};

Kid.Game.prototype.create = function ()
{
	Kid.game.physics.arcade.gravity.y = 1000;

	//this.entities = Kid.game.add.group();

	this.Player.create(
		SCREEN_WIDTH / 2,
		SCREEN_HEIGHT * 3 / 4
	);
	this.Player.sprite.body.collideWorldBounds = true;

	this.Stage.create();


	this.debugToggle = Kid.game.input.keyboard.addKey( Phaser.Keyboard.Q );
};

Kid.Game.prototype.update = function ()
{
	Kid.game.physics.arcade.collide( this.Player.sprite, this.Stage.walls );

	this.Player.update();

	if ( this.debugToggle.justDown )
		Kid.debug = !Kid.debug;
};

Kid.Game.prototype.handleCollisions = function ()
{
	/*for ( var i = 0; i < this.entityManager.entities.length; i++ )
	{
		var entity = this.entityManager.entities[i];
		if ( entity && entity.sprite.exists )
		{
			Kid.game.physics.arcade.overlap( this.Player.sprite, entity.sprite, function(){
				entity.overlap( this.Player );
			}, null, this );
		}
	}*/

	//Kid.game.physics.arcade.collide( this.Player.sprite, this.roomManager.physics );
};

Kid.Game.prototype.render = function ()
{
	this.Player.render();
};
