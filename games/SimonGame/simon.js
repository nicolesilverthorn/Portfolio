function Game() 
{
	if(!(this instanceof arguments.callee)) 
	{
        return new arguments.callee(arguments); 
    }
	
	var self = this;
	self.gameLoop = null;
	
	self.init = function() 
	{
		self.canvas = document.getElementById("game");
		self.context = self.canvas.getContext("2d");
		self.sequence = null;
		self.position = 0;
		self.currentRound = 1;
		self.playersTurn = false;
		self.playerSequence = new Array();
		self.generateSequence(1);
		self.setupTimelines();
		self.setupAudioChannels();	
		self.canvas.addEventListener("click", self.handleMouseClick, false);
		self.startGame(); 	
	}

	self.setupTimelines = function() 
	{
		//colours to interpolate
		self.redColour = "rgb(200, 0, 0)";
		self.greenColour = "rgb(0, 150, 0)";
		self.blueColour = "rgb(0, 0, 150)";
		self.yellowColour = "rgb(150, 150, 0)";
		
		self.timelines = new Object();
		
		//red
		var redTimeline = new Timeline(this);
		redTimeline.addPropertiesToInterpolate([
			{ 
				property: "redColour", 
				goingThrough:{0:"rgb(200, 0, 0)", 0.5:"rgb(255, 0, 0)", 1:"rgb(200, 0, 0)"}, 
				interpolator: new RGBPropertyInterpolator()
			}
  		]);
		//green
		var greenTimeline = new Timeline(this);
		greenTimeline.addPropertiesToInterpolate([
			{ 
				property: "greenColour", 
				goingThrough:{0:"rgb(0, 150, 0)", 0.5:"rgb(0, 255, 0)", 1:"rgb(0, 150, 0)"},
				interpolator: new RGBPropertyInterpolator()
			}
  		]);
		//blue
		var blueTimeline = new Timeline(this);
		blueTimeline.addPropertiesToInterpolate([
			{ 
				property: "blueColour", 
				goingThrough:{0:"rgb(0, 0, 150)", 0.5:"rgb(0, 0, 255)", 1:"rgb(0, 0, 150)"},
				interpolator: new RGBPropertyInterpolator()
			}
  		]);
		//yellow
		var yellowTimeline = new Timeline(this);
		yellowTimeline.addPropertiesToInterpolate([
			{ 
				property: "yellowColour", 
				goingThrough:{0:"rgb(150, 150, 0)", 0.5:"rgb(255, 255, 0)", 1:"rgb(150, 150, 0)"},
				interpolator: new RGBPropertyInterpolator()
			}
  		]);
		
		redTimeline.duration = greenTimeline.duration = blueTimeline.duration = yellowTimeline.duration = 500;
		
		self.timelines.red = redTimeline;
		self.timelines.blue = blueTimeline;
		self.timelines.green = greenTimeline;
		self.timelines.yellow = yellowTimeline;
	}
	
	self.setupAudioChannels = function() 
	{
		self.numChannels = 1;
		self.channels = new Array();
		for(var i = 0; i < self.numChannels; i++) 
		{
			self.channels[i] = new Audio();
		}
		
		self.sounds = new Object();
		self.sounds.red = "sounds/r.mp3";
		self.sounds.green = "sounds/g.mp3";
		self.sounds.blue = "sounds/b.mp3";
		self.sounds.yellow = "sounds/y.mp3";
	}
	
	self.startGame = function() 
	{
		//hide loading/progress bar
		document.getElementById("progBar").style.display = "none";
	
		self.gameLoop = new Timeline(this);
		self.gameLoop.addEventListener("onpulse", function(t, d, tp) 
		{
            //check if its the computers turn
			if(!self.playersTurn) 
			{
				self.playersTurn = true;
				setTimeout(function()
				{
					//wait for player to play sequence
					self.playSequence();
				}, 1000);   //forces a 1 second gap between rounds
			} 
			self.drawSquares();	
		});
		self.gameLoop.playInfiniteLoop();
	}
	
	self.generateSequence = function(numTones) 
	{
		if(self.sequence == null)
		{
			self.sequence = new Array();
		}
		for(var i = 0; i < numTones; i++)
		{
			self.sequence.push(Math.floor(Math.random() * 100) % 4);
		}
	}
	
	self.playSequence = function() 
	{
		self.currentPosition = 1;
		self.audios = new Array();
		for(var i = 0; i < self.sequence.length; i++) 
		{
			var position = self.sequence[i];
			
			switch(position) 
			{
				case 0:   //red
					self.audios.push(
					{
						audio: new Audio(self.sounds.red),
						timeline: self.timelines.red
					});
					break;
				case 1:   //green
					self.audios.push(
					{
						audio: new Audio(self.sounds.green),
						timeline: self.timelines.green
					});
					break;
				case 2:   //blue
					self.audios.push(
					{
						audio: new Audio(self.sounds.blue), 
						timeline: self.timelines.blue
					});
					break;
				case 3:   //yellow
					self.audios.push(
					{
						audio: new Audio(self.sounds.yellow),
						timeline: self.timelines.yellow
					});
					break;
			}
			if(i < self.sequence.length - 1) 
			{
				self.audios[i].audio.addEventListener('ended', self.playNext, false);
			}
		}
		self.audios[0].audio.play();
		self.audios[0].timeline.play();
	}
	
	self.playNext = function() 
	{
		var j = self.currentPosition++;
		self.audios[j].audio.play();
		self.audios[j].timeline.play();
	}
	
	self.drawGameText = function() 
	{
		var ctx = self.context;
		ctx.fillStyle = "white";
		ctx.font = "55px Luckiest Guy";
		ctx.fillText("Simon", 217, 290);
		ctx.font = "35px Luckiest Guy";
		ctx.fillText("Round " + self.currentRound, 232, 340);	
	}
	
	self.drawSquares = function() 
	{
		var ctx = self.context;
		
		ctx.clearRect(0, 0, 600, 600);
		self.drawGameText();
		//ctx.shadowColor = "gray";   //-----------------------------------------------------------------------------------------------------------------------uncomment for shadow
		
		ctx.save();
		ctx.fillStyle = self.redColour;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;	
		ctx.beginPath();
		ctx.rect(200, 0, 200, 200);
		ctx.fill();
		ctx.restore();
		
		ctx.save();
		ctx.fillStyle = self.blueColour;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;	
		ctx.beginPath();
		ctx.rect(0, 200, 200, 200);
		ctx.fill();
		ctx.restore();
		
		ctx.save();
		ctx.fillStyle = self.yellowColour;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;	
		ctx.beginPath();
		ctx.rect(400, 200, 200, 200);
		ctx.fill();
		ctx.restore();
		
		ctx.save();
		ctx.fillStyle = self.greenColour;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;	
		ctx.beginPath();
		ctx.rect(200, 400, 200, 200);
		ctx.fill();
		ctx.restore();
	}
	
	self.handleMouseClick = function(e) 
	{
		x = e.clientX - self.canvas.offsetLeft;
		y = e.clientY - self.canvas.offsetTop;
		
		var audio;
		var value;
		
		if(x >= 200 && x <= 400) 
		{
			if(y >= 0 && y <= 200)   //red 
			{
				audio = new Audio(self.sounds.red);
				audio.play();
				self.timelines.red.play();
				value = 0;
			} 
			else if(y >= 400 && y <= 600)   //green 
			{
				audio = new Audio(self.sounds.green);
				audio.play();
				self.timelines.green.play();
				value = 1;
			}
		} 
		else if(y >= 200 && y <= 400) 
		{
			if(x >= 0 && x <= 200)   //blue 
			{
				audio = new Audio(self.sounds.blue);
				audio.play();
				self.timelines.blue.play();
				value = 2;
			} 
			else if(x >= 400 && x <= 600)   //yellow
			{
				audio = new Audio(self.sounds.yellow);
				audio.play();
				self.timelines.yellow.play();
				value = 3;
			}
		}
		if(value != undefined) 
		{
			self.playerSequence.push(value);
		
			if(self.playerSequence[self.position] != self.sequence[self.position]) 
			{
				//blink all timelines when error is made
				self.timelines.red.play();
				self.timelines.green.play();
				self.timelines.blue.play();
				self.timelines.yellow.play();
				self.currentRound = "--";
				self.position = 0;
				self.playerSequence = new Array();
				self.sequence = self.generateSequence(1);
				self.playersTurn = false;
			} 
			else 
			{
				if(self.playerSequence.length == self.sequence.length) 
				{
					//increment round
					self.currentRound++;
					//computers turn
					self.playerSequence = new Array();
					self.position = 0;
					self.generateSequence(1);
					self.playersTurn = false;
				} 
				else 
				{
					self.position++;
				}
			}
		}
	}
	self.init();
}