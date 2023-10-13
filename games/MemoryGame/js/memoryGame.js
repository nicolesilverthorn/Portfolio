$(function()
{  
	memoryGame.deck.sort(shuffle);
	//clone copies of the card  
	for(var i = 0; i < 15; i++)
	{ 
		$(".card:first-child").clone().appendTo("#cards");  
	}  
	//initialize each card's position  
	$("#cards").children().each(function(index) 
	{        
		//align the cards to be 4x4    
		$(this).css(
		{      
			"left" : ($(this).width() + 20) * (index % 4),
			"top" : ($(this).height() + 20) * Math.floor(index / 4)    
		});
		 //get a pattern from the shuffled deck    
		 var pattern = memoryGame.deck.pop();      
		 //visually apply the pattern on the cards back side.    
		 $(this).find(".back").addClass(pattern);      
		 //embed the pattern data into the DOM element    
		 $(this).attr("data-pattern",pattern);      
		 //listen the click event on each card DIV element
		 $(this).click(selectCard);
	});  
}); 

var memoryGame = {}; 
memoryGame.deck = 
[  
	'fluffy', 'fluffy',
	'spike', 'spike',
	'squirrel', 'squirrel',
	'monster', 'monster',
	'hedgehog', 'hedgehog',
	'tiger', 'tiger',
	'fairy', 'fairy',
	'bee', 'bee'
]; 

function shuffle() 
{  
	return 0.5 - Math.random(); 
}

function selectCard() 
{  
	//do nothing if theres already 2 cards flipped 
	if ($(".card-flipped").size() > 1) 
	{    
		return;  
	}  
	$(this).addClass("card-flipped");  
	//check pattern of both flipped cards 0.7s later 
	if ($(".card-flipped").size() == 2) 
	{    
		setTimeout(checkPattern,700);  
	} 
} 

function checkPattern() 
{  
	if (isMatchPattern()) 
	{    
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");    
		$(".card-removed").bind("webkitTransitionEnd", removeTookCards);  
	} 
	else 
	{    
		$(".card-flipped").removeClass("card-flipped");  
	} 
}

function isMatchPattern() 
{  
	var cards = $(".card-flipped");  
	var pattern = $(cards[0]).data("pattern");  
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern); 
}

var count = 0;

function removeTookCards() 
{  
	$(".card-removed").remove(); 
	
	count++;
	//if all matches made, display you win image
	if(count == 8)
	{
		document.getElementById("gameWon").setAttribute("style", "display:block;");
		document.getElementById("gameWon").style.display = "block";	
		document.getElementById('gameWon').style.visibility = 'visible';
	}
}