
var CameraClass =
{
	INNER_BOUNDS_RATIO : 0.25,
	x:0,
	y:0,
	width:0,
	height:0,
	
	init: function(x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	},
	
	rightInnerBoundary : function()
	{
		return this.x + (this.width - this.width * this.INNER_BOUNDS_RATIO);
	},
	
	leftInnerBoundary : function()
	{
		return this.x + this.width * this.INNER_BOUNDS_RATIO;
	},
	
	topInnerBoundary : function()
	{
		return this.y + this.height * this.INNER_BOUNDS_RATIO;
	},
	
	bottomInnerBoundary : function()
	{
		return this.y + (this.height - this.height * this.INNER_BOUNDS_RATIO);
	},
	
	update : function(player)
	{
		if(player.right() > this.rightInnerBoundary())
		{
			var diff = player.right() - this.rightInnerBoundary();
			this.x += diff;
		}
		else if(player.left() < this.leftInnerBoundary())
		{
			var diff = player.left() - this.leftInnerBoundary();
			this.x += diff;
		}
	
		if(player.bottom() > this.bottomInnerBoundary())
		{
			var diff = player.bottom() - this.bottomInnerBoundary();
			this.y += diff;
		}
		else if(player.top() < this.topInnerBoundary())
		{
			var diff = player.top() - this.topInnerBoundary();
			this.y += diff;
		}
	},
	
	clampLevel : function(level)
	{
		this.x = clamp(this.x, level.left,
					level.right - this.width);
	
		this.y = clamp(this.y, level.top,
					level.bottom - this.height);
	}

};