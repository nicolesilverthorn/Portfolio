$(document).ready(function ()
{
    var CANVAS_WIDTH = 2000;
    var CANVAS_HEIGHT = 512;
    var OUTPUT_HEIGHT = 0;
    var NUM_CANVAS_ROWS = 1.3;
    var NUM_CANVAS_COLS = 3;

    var assetsLoaded = 0;
    var assetsToLoad = new Array();

    var spriteAtlas = new Image();
    spriteAtlas.src = "Assets/Images/MA_tileSheet.png";
    spriteAtlas.addEventListener("load", assetLoaded, false);
    assetsToLoad.push(spriteAtlas);

    var healthBarBG = new Image();
    healthBarBG.src = "Assets/Images/backgroundHealth.png";
    healthBarBG.addEventListener("load", assetLoaded, false);
    assetsToLoad.push(healthBarBG);

    var healthBarFG = new Image();
    healthBarFG.src = "Assets/Images/healthHealth.png";
    healthBarFG.addEventListener("load", assetLoaded, false);
    assetsToLoad.push(healthBarFG);

    var healthBarTransition = new Image();
    healthBarTransition.src = "Assets/Images/transitionHealth.png";
    healthBarTransition.addEventListener("load", assetLoaded, false);
    assetsToLoad.push(healthBarTransition);
	
	//main menu
    var splashScreen = new Image();
    splashScreen.src = "Assets/Images/splash.png";
    splashScreen.addEventListener("load", assetLoaded, false);
    assetsToLoad.push(splashScreen);
    
    var gameOverScreen = new Image();
   	gameOverScreen.src = "Assets/Images/gameOver.png";
    gameOverScreen.addEventListener("load", assetLoaded, false);
    assetsToLoad.push(gameOverScreen);

    var gameScreen = document.getElementById("gameScreen");

    var output = document.getElementById("output");
    output.style.position = "absolute";
    output.style.top = CANVAS_HEIGHT - OUTPUT_HEIGHT + "px";

    var canvasWidth = Math.floor(CANVAS_WIDTH / NUM_CANVAS_COLS);
    var canvasHeight = Math.floor(CANVAS_HEIGHT / NUM_CANVAS_ROWS);

    var canvases = new Array();

    var currState = Object.create(MainMenuStateClass);
    
    var keysPressed = new Array();

    window.addEventListener("keydown", function (event)
    {
        if (event.keyCode < 43)
        {
            event.preventDefault();
        }
        if (keysPressed.indexOf(event.keyCode) === -1)
        {
            keysPressed.push(event.keyCode);
        }
        if (event.keyCode == SPACE)
        {
            shoot = true;
        }
    }, false);

    window.addEventListener("keyup", function (event)
    {
        shoot = false;
        var index = keysPressed.indexOf(event.keyCode);
        if (index != -1)
        {
            keysPressed.splice(index, 1);
        }
    }, false);

    function mouseDownHandler(event)
    {	
		//can't click while game is playing
		if(currState.state != 4)
		{
			//start & retry button click
			if(event.pageX >= 265 && event.pageX <= 400 && event.pageY >= 225 && event.pageY <= 260)
			{
				currState = Object.create(GameStateClass);
				currState.init(0, canvasWidth, canvasHeight, assetsToLoad);
			}
		}
    }
	
    function buildCanvases()
    {
        for (var row = 0; row < NUM_CANVAS_ROWS; ++row)
        {
            for (var col = 0; col < NUM_CANVAS_COLS; ++col)
            {
                var newCanvas = document.createElement("canvas");
                newCanvas.setAttribute("width", canvasWidth);
                newCanvas.setAttribute("height", canvasHeight);
                gameScreen.appendChild(newCanvas);
                newCanvas.style.display = "block";
                newCanvas.style.position = "absolute";
                newCanvas.style.top = row * canvasHeight + "px";
                newCanvas.style.left = col * canvasWidth + "px";
                newCanvas.addEventListener("mousedown", mouseDownHandler, false);
                canvases.push(newCanvas);
            }
        }
    }

    buildCanvases();

    function gameLoop(currState)
    {
		window.requestAnimationFrame(gameLoop, canvases[0]);

		update();
		render();
    }

    var timer = 0;
    var previousTime = Date.now();

    function update()
    {
        var deltaTime = (Date.now() - previousTime) / 1000;
        previousTime = Date.now();
        timer += deltaTime;

        currState.update(deltaTime, keysPressed);
    }

    function render(currContext)
    {	
        var currContext = canvases[0].getContext("2d");
        currContext.clearRect(0, 0, canvasWidth, canvasHeight);

        currState.render(currContext);
        
        if(currState.state != undefined && currState.state == States.MAIN_MENU)
        {
        	currState = Object.create(MainMenuStateClass);
			currState.init(0, canvasWidth, canvasHeight, assetsToLoad);
        }
        
        else if(currState.state != undefined && currState.state == States.GAME_OVER)
        {
			currState = Object.create(GameOverStateClass);
			currState.init(canvasWidth, canvasHeight, assetsToLoad, gameOverScreen);
        }
    }

    function assetLoaded(event)
    {
        assetsLoaded++;
        if (assetsLoaded === assetsToLoad.length)
        {
            gameLoaded();
        }
    }

    function gameLoaded()
    {
        currState.init(canvasWidth, canvasHeight, assetsToLoad);
        gameLoop(currState);
    }
});