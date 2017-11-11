
function Stage ()
{
}

Stage.prototype.create = function ( x, y )
{
	this.stationary = Kid.game.add.physicsGroup();
	this.moving = Kid.game.add.physicsGroup();
	this.balloons = Kid.game.add.physicsGroup();
	this.goal = Kid.game.add.physicsGroup();

	for ( var i = 0; i < 10; i += 1 )
		this.addWall( i, 8 );

	for ( var i = 0; i < 8; i += 1 )
		this.addWall( 0, 7-i );

	for ( var i = 0; i < 6; i += 1 )
		this.addWall( 10+i, 6 );

	for ( var i = 0; i < 4; i += 1 )
		this.addWall( 5+i, 3 );

	this.addGoal( 7, 1 );
	this.addBalloon( 12, 4 );

	var s = new CloudPlatform( 100, 400, 'cloud', this.moving );
	s.addMotionPath([
		{ x: "+0", xSpeed: 2000, xEase: "Linear", y: "-100", ySpeed: 2000, yEase: "Sine.easeIn" },
		{ x: "-0", xSpeed: 2000, xEase: "Linear", y: "-100", ySpeed: 2000, yEase: "Sine.easeOut" },
		{ x: "-0", xSpeed: 2000, xEase: "Linear", y: "+100", ySpeed: 2000, yEase: "Sine.easeIn" },
		{ x: "+0", xSpeed: 2000, xEase: "Linear", y: "+100", ySpeed: 2000, yEase: "Sine.easeOut" }
	]);
	s.start();
};

Stage.prototype.addWall = function ( x, y )
{
	var w = this.stationary.create( x*64, y*64, 'wall' );
	w.body.allowGravity = false;
	w.body.immovable = true;
	w.scale.set( 64 / 512 );
};

Stage.prototype.addBalloon = function ( x, y )
{
	var b = new Balloon( x*64, y*64, 'balloons', this.balloons );
	b.sprite.body.allowGravity = false;
	b.sprite.body.immovable = true;
	b.sprite.scale.set( 128 / 409 );

	var speed = 700;
	b.addMotionPath([
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "-5", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "-5", ySpeed: speed, yEase: "Sine.easeOut" },
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "+5", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "+5", ySpeed: speed, yEase: "Sine.easeOut" },
	]);
	b.start();
};

Stage.prototype.addGoal = function ( x, y )
{
	var w = this.goal.create( x*64, y*64, 'balloon' );
	w.body.allowGravity = false;
	w.body.immovable = true;
	w.scale.set( 128 / 409 );
};

Stage.prototype.update = function ()
{
};

Stage.prototype.render = function ()
{
	if ( Kid.debug )
	{
		for (var i = this.stationary.children.length - 1; i >= 0; i--) {
			Kid.game.debug.body( this.stationary.children[i], BLUE );
		}
		for (var i = this.balloons.children.length - 1; i >= 0; i--) {
			Kid.game.debug.body( this.balloons.children[i], YELLOW );
		}
		for (var i = this.moving.children.length - 1; i >= 0; i--) {
			Kid.game.debug.body( this.moving.children[i], CYAN );
		}
		for (var i = this.goal.children.length - 1; i >= 0; i--) {
			Kid.game.debug.body( this.goal.children[i], GREEN );
		}
	}
};