
function Stage ()
{
}

Stage.prototype.create = function ( x, y )
{
	this.walls = Kid.game.add.physicsGroup();

	for ( var i = 0; i < 10; i += 1 )
		this.addWall( i, 8 );

	for ( var i = 0; i < 3; i += 1 )
		this.addWall( 0, 7-i );

	for ( var i = 0; i < 6; i += 1 )
		this.addWall( 10+i, 6 );

	for ( var i = 0; i < 4; i += 1 )
		this.addWall( 5+i, 3 );
};

Stage.prototype.addWall = function ( x, y )
{
	var w = this.walls.create( x*64, y*64, 'wall' );
	w.body.allowGravity = false;
	w.body.immovable = true;
	w.scale.set( 64 / 512 );
};

Stage.prototype.update = function ()
{
};

Stage.prototype.render = function ()
{
};