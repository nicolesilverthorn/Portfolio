/*
	This class represents a sprite animation. It contains the data 
	and functionality necessary to render and play a sprite animation
	to a canvas 2d context.
*/
var SpriteClass =
{
	image: undefined,

	srcX: 0, //the current left pixel to start copying pixels from in the source image
	srcY: 0, //the current top pixel to start copying pixels from in the source image
			 
	
	imageWidth: 0,
	imageHeight: 0,
	

	visible: true,
	
	//Initialize the sprite anim. Sets the image, image dimensions, sprite anim 
	//settings (num frames, start frame, framerate etc..). Also, inits the 
	//source x and y location based on the anim settings.
	init: function(image, x, y)
	{
		this.image = image;
	
		this.imageWidth = image.width;
		this.imageHeight = image.height;
		
	},
	
	render: function(currContext)
	{
		if(this.visible)
		{
			currContext.save();
			
			currContext.drawImage(this.image, 
								this.srcX, this.srcY   //source rect (x,y,width,height)
								 );
			currContext.restore();
		}
	}
};