// Canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
	
var cw = 10;
var d;
var food;
var score;

// creating the snake
var snake_array; //an array of cells to make up the snake

function init()
{
	d = "right"; 	//default direction
	create_snake();	// to create the snake
	create_food(); 	// to see the food particle
	
	score = 0;

	// move the snake using a timer which will trigger the paint function
	//every 60ms
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 60);
}	
init();
	
// function to create the snake	
function create_snake()
{
	var length = 5; 	// initial length of the snake
	snake_array = []; 	
	for(var i = length-1; i>=0; i--)
	{
		// This will create a horizontal snake starting from the top left
		snake_array.push({x: i, y:0});
	}
}
	
// function to create the food
function create_food()
{
	food = {
		x: Math.round(Math.random()*(w-cw)/cw), 
		y: Math.round(Math.random()*(h-cw)/cw), 
	};	
}

// function to paint the snake
function paint()
{
	// To avoid the snake trail we need to paint the BG on every frame
	// painting the canvas
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, w, h);
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, w, h);
	
	//The movement code for the snake to come here.
	//The logic is simple
	//Pop out the tail cell and place it infront of the head cell
	var nx = snake_array[0].x;
	var ny = snake_array[0].y;
	//These were the position of the head cell.
	//We will increment it to get the new head position
	
	// adding proper direction based movement
	if(d == "right") nx++;
	else if(d == "left") nx--;
	else if(d == "up") ny--;
	else if(d == "down") ny++;
	
	// the game over clauses now
	// this will restart the game if the snake hits the wall
	// also adding the code for body collision
	// now if the head of the snake bumps into its vody, the game will restart
	if(nx==-1||nx==w/cw||ny==-1||ny==h/cw||check_collision(nx,ny,snake_array))
	{
		//restart game
		init();		
		return;
	}

	// code to make the snake eat the food
	// the logic is simple
	// if the new head position matches with that of the food,
	// crete a new head instead of moving the tail
	if(nx==food.x&&ny==food.y)
	{
		var tail = {x:nx,y:ny};
		score++;
		// create new food
		create_food();
	}
	else
	{
		var tail = snake_array.pop(); //pops out the last cell
		tail.x = nx; tail.y = ny;
	}
	// the snake can now eat the food.
	
	snake_array.unshift(tail); //puts back the tail as the first cell
		
	for(var i = 0; i < snake_array.length; i++)
	{
		var c = snake_array[i];
		// paint 10px wide cells
		paint_cell(c.x,c.y);
	}

	// function to paint the food
	paint_cell(food.x,food.y);
	// paint the score
	var score_text = "Score:" + score;
	ctx.fillText(score_text,5,h-5);
}
	
// generic function to paint cells
function paint_cell(x,y)
{
	ctx.fillStyle = "blue";
	ctx.fillRect(x*cw, y*cw, cw, cw);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*cw, y*cw, cw, cw);
}	

// function to check if the provided x/y coordinates exist
// in an array of cells or not
function check_collision(x,y,array)
{
	for(var i=0;i<array.length;i++)
	{
		if(array[i].x==x&&array[i].y==y)
			return true;
	}
	return false;
}

function arrow_key(key) 
{
	// added another clause to prevent reverse gear
	if(key == "37" && d != "right") 
		d = "left";
	else if(key == "38" && d != "down") 
		d = "up";
	else if(key == "39" && d != "left") 
		d = "right";
	else if(key == "40" && d != "up") 
		d = "down";
	// the snake is now keyboard controllable
}

function checkKeycode(event) 
{
    // handling Internet Explorer stupidity with window.event
    // @see http://stackoverflow.com/a/3985882/517705
    var keyDownEvent = event || window.event,
        keycode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;

    arrow_key(keycode);

    return false;
}

document.onkeydown = checkKeycode;