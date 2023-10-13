var canvas;
var context;

//curr butterfly pos
var x = 0;
var y = 0;

//curr butterfly speed
var dx = 0;
var dy = 0;

var maze = 1;

window.onload = function() 
{
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	var x = 267;
	var y = 0;

	//draw the first maze bg
	drawMaze("images/maze.png", x, y);

	//when the user presses a key, run the processKey() function
	window.onkeydown = processKey;
};

//keep track of the current timer so the drawing can be easily stopped and restarted if a new maze is loaded
var timer;

function drawMaze(mazeFile, startingX, startingY) 
{
	//stop drawing (if it's drawing)
	clearTimeout(timer);

	//stop the butterfly (if it's moving)
	dx = 0;
	dy = 0;

	//load the maze pic
	var imgMaze = new Image();
	imgMaze.onload = function() 
	{
		//resize canvas to match maze pic
		canvas.width = imgMaze.width;
		canvas.height = imgMaze.height;

		//draw maze
		context.drawImage(imgMaze, 0, 0);

		//draw butterfly
		x = startingX;
		y = startingY;

		var imgButterfly = document.getElementById("butterfly");
		context.drawImage(imgButterfly, x, y);
		context.stroke();

		timer = setTimeout("drawFrame()", 10);
	};
	imgMaze.src = mazeFile;
}


function processKey(e) 
{
	//if the butterfly is moving, stop it
	dx = 0;
	dy = 0;
	
	if(e.keyCode == 38) //up 
	{
		dy = -1;
	}
	if(e.keyCode == 40) //down
	{
		dy = 1;
	}
	if(e.keyCode == 37) //left
	{
		dx = -1;
	}
	if(e.keyCode == 39) //right
	{
		dx = 1;
	}
}

function up() {dy = -1;}
function down() {dy = 1;}
function left() {dx = -1;}
function right() {dx = 1;}

function checkForCollision() 
{
	//grab block of pixels where butterfly is & extend edges a bit
	var imgData = context.getImageData(x - 1, y - 1, 15 + 1, 15 + 1);
	var pixels = imgData.data;

	//check these pixels
	for(var i = 0; n = pixels.length, i < n; i += 4) 
	{
		var red = pixels[i];
		var green = pixels[i + 1];
		var blue = pixels[i + 2];
		var alpha = pixels[i + 3];

		//look for black walls (indicates collision)
		if(red == 0 && green == 0 && blue == 0) 
		{
			return true;
		}
		//look for gray edge space (indicates collision)
		if(red == 169 && green == 169 && blue == 169) 
		{
			return true;
		}
	}
	//no collision
	return false;
}


function drawFrame() 
{
	//only draw new frame if butterfly is moving
	if(dx != 0 || dy != 0) 
	{
		//blue trail effect
		context.beginPath();
		context.fillStyle = "rgb(211, 255, 255)";
		context.rect(x, y, 15, 15);
		context.fill()

		//increment butterfly's pos
		x += dx;
		y += dy;

		//stop butterfly if it hit a wall, and move it back to the old pos
		if(checkForCollision()) 
		{
			x -= dx;
			y -= dy;
			dx = 0;
			dy = 0;
		}

		//draw the butterfly at its new pos
		var imgButterfly = document.getElementById("butterfly");
		context.drawImage(imgButterfly, x, y);

		//check if the user has finished the maze (reached the bottom edge) if so, show a msg and return from the function, so no more frames drawn
		if(y > (canvas.height - 16)) 
		{
			alert("You win! Click next for the next maze");
			return;
		}
		else if(y > (canvas.height - 16) && maze == 10) 
		{
			alert("You solved all the mazes! Check back soon for more!");
			return;
		}
	}
	
	if(maze == 10)
	{
		document.getElementById("nextBtn").style.display = "none";
	}
	
	//document.f.level.value = String(maze);

	timer = setTimeout("drawFrame()", 10);
}

function resetPosition() 
{
	if(maze == 1)
	{
		drawMaze("images/maze.png", 267, 0);
	}
	else if(maze == 2)
	{
		drawMaze("images/maze2.png", 268, 5);
	}
	else if(maze == 3)
	{
		drawMaze("images/maze3.png", 255, 1);
	}
	else if(maze == 4)
	{
		drawMaze("images/maze4.png", 353, 1);
	}
	else if(maze == 5)
	{
		drawMaze("images/maze5.png", 28, 3);
	}
	else if(maze == 6)
	{
		drawMaze("images/maze6.png", 119, 5);
	}
	else if(maze == 7)
	{
		drawMaze("images/maze7.png", 322, 1);
	}
	else if(maze == 8)
	{
		drawMaze("images/maze8.png", 432, 1);
	}
	else if(maze == 9)
	{
		drawMaze("images/maze9.png", 350, 0);
	}
	else if(maze == 10)
	{
		drawMaze("images/maze10.png", 81, 5);
	}
}

function nextMaze() 
{
	if(maze == 1)
	{
		drawMaze("images/maze2.png", 268, 5);
		maze = 2;
	}
	else if(maze == 2)
	{
		drawMaze("images/maze3.png", 255, 1);
		maze = 3;
	}
	else if(maze == 3)
	{
		drawMaze("images/maze4.png", 353, 1);
		maze = 4;
	}
	else if(maze == 4)
	{
		drawMaze("images/maze5.png", 28, 3);
		maze = 5;
	}
	else if(maze == 5)
	{
		drawMaze("images/maze6.png", 119, 5);
		maze = 6;
	}
	else if(maze == 6)
	{
		drawMaze("images/maze7.png", 322, 1);
		maze = 7;
	}
	else if(maze == 7)
	{
		drawMaze("images/maze8.png", 432, 0);
		maze = 8;
	}
	else if(maze == 8)
	{
		drawMaze("images/maze9.png", 350, 0);
		maze = 9;
	}
	else if(maze == 9)
	{
		drawMaze("images/maze10.png", 81, 5);
		maze = 10;
	}
}	