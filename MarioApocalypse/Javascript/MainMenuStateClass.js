var MainMenuStateClass = 
{
	canvasWidth : 0,
	canvasHeight : 0,
	assets : undefined,
	image : undefined,

	
	init : function(canvasWidth, canvasHeight, assets, image)
	{
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.assets = assets;
		this.image = image;
	},
	
	update : function(deltaTime, keysPressed)
	{
		
	},
	
	render : function(currContext)
	{
		var splashScreen = new Image();
    	splashScreen.src = "Assets/Images/splash.png";
		currContext.fillStyle = "rgb(4,4,4,0)"
	    currContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
	  	currContext.drawImage(splashScreen, 0, 0, this.canvasWidth, this.canvasHeight);
	 }
};