var GameOverStateClass = 
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
	    //console.log("I died man :(");

	},
	
	render : function(currContext)
	{
	
	 	
	 	//currContext.fillStyle = "rgb(4,4,4,0)"
	    currContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
	  	currContext.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
	}
};