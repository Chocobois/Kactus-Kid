var Kid = Kid || {};

//loading the game assets
Kid.Preload = function() {};

Kid.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#eeeeee';


		/* Fonts */

		this.load.bitmapFont( 'Balsamiq', 'assets/fonts/balsamiq_regular.png', 'assets/fonts/balsamiq_regular.fnt' );
		this.load.bitmapFont( 'BalsamiqBold', 'assets/fonts/balsamiq_bold.png', 'assets/fonts/balsamiq_bold.fnt' );


		/* Sprites */

		this.load.spritesheet( 'mario', 'assets/sprites/mario.png', 16, 32 );

		this.load.image( 'cactus', 'assets/sprites/cactus.png' );
		this.load.image( 'balloon', 'assets/sprites/balloon.png' );
		this.load.image( 'balloons', 'assets/sprites/cute-balloons.png' );

		this.load.image( 'wall', 'assets/sprites/wall.png' );
		this.load.image( 'cloud', 'assets/sprites/cloud-platform.png' );


		/* Audio */

		//this.load.audio( 'name', 'assets/sounds/name.ogg' );


		// Loading progress bar
		var scale = 4;
		var x = this.game.world.centerX - this.game.cache.getImage( 'preloader-bar' ).width / 2 * scale;
		var y = this.game.world.centerY;
		var progressBg = this.game.add.sprite( x, y, 'preloader-bar' );
		var progressFg = this.game.add.sprite( x, y, 'preloader-bar' );
		progressBg.tint = 0x42A5F5;
		progressBg.anchor.set( 0, 0.5 );
		progressFg.anchor.set( 0, 0.5 );
		progressBg.scale.set( scale );
		progressFg.scale.set( scale );
		this.game.load.setPreloadSprite( progressFg );

	},
	create: function () {
		this.state.start( 'MainMenu', Phaser.Plugin.StateTransition.Out.ScaleUp );
	}
};
