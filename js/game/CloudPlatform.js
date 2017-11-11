CloudPlatform = function (x, y, key, group)
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

CloudPlatform.prototype.addMotionPath = function (motionPath) {
	this.tweenX = Kid.game.add.tween( this.sprite.body );
	this.tweenY = Kid.game.add.tween( this.sprite.body );

	//  motionPath is an array containing objects with this structure
	//  [
	//   { x: "+200", xSpeed: 2000, xEase: "Linear", y: "-200", ySpeed: 2000, yEase: "Sine.easeIn" }
	//  ]

	for (var i = 0; i < motionPath.length; i++)
	{
		this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
		this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);
	}

	this.tweenX.loop();
	this.tweenY.loop();
};

CloudPlatform.prototype.start = function () {
	this.tweenX.start();
	this.tweenY.start();
};

CloudPlatform.prototype.stop = function () {
	this.tweenX.stop();
	this.tweenY.stop();
};