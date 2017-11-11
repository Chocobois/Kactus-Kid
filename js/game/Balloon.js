Balloon = function (x, y, key, group)
{
	this.sprite = group.create( x, y, key );
	this.sprite.owner = this;

	this.sprite.anchor.x = 0.5;
	this.sprite.scale.set( 0.5 );

	this.sprite.body.customSeparateX = true;
	this.sprite.body.customSeparateY = true;
	this.sprite.body.allowGravity = false;
	this.sprite.body.immovable = true;

	this.playerLocked = false;
	this.lockTimer = 0;
};

Balloon.prototype.addMotionPath = function (motionPath) {
	this.tweenX = Kid.game.add.tween( this.sprite.body );
	this.tweenY = Kid.game.add.tween( this.sprite.body );

	for (var i = 0; i < motionPath.length; i++)
	{
		this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
		this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);
	}

	this.tweenX.loop();
	this.tweenY.loop();
};

Balloon.prototype.start = function () {
	this.tweenX.start();
	this.tweenY.start();
};

Balloon.prototype.stop = function () {
	this.tweenX.stop();
	this.tweenY.stop();
};