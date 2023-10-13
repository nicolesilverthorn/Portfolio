//rect1 will be moved out of collision with rect2
//returns a string specifying which side rect1 collided with rect 2 on.
function AARectToRectCollision(rect1, rect2) {

    var rect1CentreX = rect1.x + rect1.halfWidth;
    var rect2CentreX = rect2.x + rect2.halfWidth;
    var rect1CentreY = rect1.y + rect1.halfHeight;
    var rect2CentreY = rect2.y + rect2.halfHeight;

    var vx = rect1CentreX - rect2CentreX;
    var vy = rect1CentreY - rect2CentreY;
	var magVx = Math.abs(vx);
	var magVy = Math.abs(vy);
	
	var overlapX = (rect1.halfWidth + rect2.halfWidth) - 
					magVx;
	var overlapY = (rect1.halfHeight + rect2.halfHeight) -
					magVy;
    
					
	if(overlapX > 0)
	{
		if(overlapY > 0)
		{
			if(overlapY > overlapX)
			{
				if(vx > 0)
				{
				    rect1.x += overlapX;
				    return "left";
				}
				else
				{
				    rect1.x -= overlapX;
				    return "right";
				}
			}
			else
			{
				if(vy > 0)
				{
				    rect1.y += overlapY;
				    return "top";
				}
				else
				{
				    rect1.y -= overlapY;
				    return "bottom";
				}
			}
		}
	}
	return "none";
}

//returns the overlap amount and direction (+/-) to move the shape who's axis
//we are projecting onto in the direction of that axis. 
// Note: returns 0 if there is no overlap.
function findOverlapAxis(axis, axisRectP1, axisRectP2, 
						otherRectP1, otherRectP2, otherRectP3, otherRectP4)
{
	//project axis rect's points onto axis
	var scalar1 = axisRectP1.scalarProjection(axis);
	var scalar2 = axisRectP2.scalarProjection(axis);
	
	//get the projection of the shape (get max / min -> get size)
	var max = Math.max(scalar1, scalar2);
	var min = Math.min(scalar1, scalar2);
	
	var halfSizeR1 = (max - min) * 0.5;
	var centreR1 = min + halfSizeR1;
	
	//project r2 onto axis
	scalar1 = otherRectP1.scalarProjection(axis);
	scalar2 = otherRectP2.scalarProjection(axis);
	var scalar3 = otherRectP3.scalarProjection(axis);
	var scalar4 = otherRectP4.scalarProjection(axis);
	
	max = Math.max(scalar1, scalar2, scalar3, scalar4);
	min = Math.min(scalar1, scalar2, scalar3, scalar4);
	
	var halfSizeR2 = (max - min) * 0.5;
	var centreR2 = min + halfSizeR2;
	
	var overlap = (halfSizeR1 + halfSizeR2) - Math.abs(centreR1 - centreR2);
	if(overlap <= 0)
	{
		return 0;
	}
	
	if(centreR1 < centreR2)
	{
		overlap *= -1;
	}
	
	return overlap;
}
	
var pointsToDraw = new Array();
function rectToRect(r1, r2)
{

	//variable labels:
	/*
				 a12
				  ^
				  | 
				  |
		p11 ______|________ p12
		   |			   |
a11	<------|	  R1	   |
		   | 			   |
		   |_______________|
		 p14			    p13   	
		 
		 
				 a22
				  ^
				  | 
				  |
		p21 ______|________ p22
		   |			   |
a21	<------|	  R2	   |
		   | 			   |
		   |_______________|
		 p24			    p23   	
		
	
	
	*/
	
	var context = canvases[1].getContext("2d");
	context.fillStyle = "rgb(255,255,255)";
	context.fillRect(0,0, canvasWidth, canvasHeight);
	
	pointsToDraw = new Array();
	
	pointsToDraw.push(r1.corners[0]);
	pointsToDraw.push(r1.corners[1]);
	
	//get the perpendicular axes to project onto.
	//a11 will be the left side orthogonal vector
	var a11 = Object.create(r1.corners[0]);
	a11.subtract(r1.corners[1]);
	
	//a12 will be the r1's top side's normal
	var a12 = Object.create(r1.corners[0]);
	a12.subtract(r1.corners[3]);
	
	//a21 is r2's left side's normal
	var a21 = Object.create(r2.corners[0]);
	a21.subtract(r2.corners[1]);
	
	//a22 is r2's top side's normal
	var a22 = Object.create(r2.corners[0]);
	a22.subtract(r2.corners[3]);
	
	
	//project r1 onto a11
	var overlap = findOverlapAxis(a11, r1.corners[0], r1.corners[1], r2.corners[0], r2.corners[1], r2.corners[2], r2.corners[3]);
	if(overlap == 0)
	{
		return;
	}
	var currAxis = Object.create(VectorClass);
	currAxis.x = a11.x;
	currAxis.y = a11.y;
	var smallestOverlap = overlap;
	
	//project r1 onto a12
	//project r2 onto a12
	//check for overlap
	overlap = findOverlapAxis(a12, r1.corners[0], r1.corners[3], r2.corners[0], r2.corners[1], r2.corners[2], r2.corners[3]);
	if(overlap == 0)
	{
		return;
	}
	
	if(Math.abs(overlap) < Math.abs(smallestOverlap))
	{
		smallestOverlap = overlap;
		currAxis.x = a12.x;
		currAxis.y = a12.y;
	}
	
	//project r1 onto a21
	//project r2 onto a21
	//check for overlap
	overlap = findOverlapAxis(a21, r2.corners[0], r2.corners[1], r1.corners[0], r1.corners[1], r1.corners[2], r1.corners[3]);
	if(overlap == 0)
	{
		return;
	}
	
	if(Math.abs(overlap) < Math.abs(smallestOverlap))
	{
		smallestOverlap = -overlap;
		currAxis.x = a21.x;
		currAxis.y = a21.y;
	}
	
	//project r1 onto a22
	//project r2 onto a22
	//check for overlap
	overlap = findOverlapAxis(a22, r2.corners[0], r2.corners[3], r1.corners[0], r1.corners[1], r1.corners[2], r1.corners[3]);
	if(overlap == 0)
	{
		return;
	}
	
	if(Math.abs(overlap) < Math.abs(smallestOverlap))
	{
		smallestOverlap = -overlap;
		currAxis.x = a22.x;
		currAxis.y = a22.y;
	}
	
	currAxis.normalize();
	currAxis.scale(smallestOverlap * 0.5);
	r1.translate(currAxis.x, currAxis.y);
	
	currAxis.scale(-1);
	r2.translate(currAxis.x, currAxis.y);

	context.fillStyle = "rgb(255,0,0)";
	context.fillRect(0,0, canvasWidth, canvasHeight);	
}

function circleToCircle(c1, c2)
{
	var vx = c1.x - c2.x;
	var vy = c1.y - c2.y;
	var mag = Math.sqrt(vx * vx + vy * vy);
	
	var overlap = (c1.radius + c2.radius) - mag;
	if(overlap > 0)
	{
		vx = vx / mag;
		vy = vy / mag;
		c1.x += vx * overlap;
		c1.y += vy * overlap;
	}
}