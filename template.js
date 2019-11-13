var sketchProc=function(processingInstance){ with (processingInstance){
size(400, 400); 
frameRate(60);


//ProgramCodeGoesHere
/*
The majority of these screens were written using multiple fsm's, particles, and bezier curves. The following sections detail how these concepts contributed to the overall game.

FSM: There is one large fsm that will control the game screen shown to the player. As of right now, there is a start screen, an options screen, and a in-game screen with placeholder text until further work is done. The player uses W and S to navigate between the menu options. When they are at an option they want, they use the Enter key to select. When clicking enter on start, it modifies the global variables to indicate a change to the blank screen with placeholder text. When pressing enter on options it redirects them to the option screen. In the option screen, the player uses the mouse to pick their options like sound and difficulty. Based on the currently selected option in each row, the rectangle's will be colored differently. There is a back button to return to the start screen.

Particles: I used the noise-map method demonstrated in class to make a moving sky and implement a mountain range in the distance. There is not much else to it, except for the time of day based on the sun's x position. When the sun moves off the screen and back on, I modify a return value to the coloration of the sky to make it more blue for day and more gray for night.

Bezier: This was used to make the hill range in the forefront of the view and part of the weapons on the characters. I used the draggable bezier tool offered on Khan Academy to build the curves.

The characters on the left will be the 4 party members the player has available during combat. From left to right: they are the Mage, the Rogue, the Monk, and the Warrior. On the right side are two goblins that will be one of the most basic adversary units.

Future plans include key mapping so the user isn't restricted to just wasd for movement and enter for selection. These will be incorporated into the option screen. I will use the difficulty settings in my fuzzy logic for combat to calculate damage, probability of using certain abilities, and critical hit rate.
*/
angleMode = "radians";
var startScreen = 1;
var optionsScreen = 0;
var startSelect = 1;
var optionSelect = 0;
var gameScreen = 0;
var sound = 1;
var difficulty = 1;
var keyArray = [];
var a=random(1500);

var sunX = 300;

var keyPressed = function() 
{
    keyArray[key.code] = 1;
};

var keyReleased = function() 
{
    keyArray[key.code] = 0;
};

var drawSun = function()
{
    noStroke();
    fill(252, 212, 64);
    ellipse(sunX, 50, 30, 30);
};

var timeOfDay = function()
{
    if(sunX > 385)
    {
        var ret = 450-sunX;
        if(ret<50)
        {
            ret = 50;
        }
        return ret;
    }
    else if(sunX < 0)
    {
        var ret = (15-(sunX*-1))*10;
        if(ret<50)
        {
            ret = 50;
        }
        return ret;
    }
    else
    {
        return 150;
    }
};

var drawSky = function()
{
    
    noStroke();
    var n1 = a;  
    for (var x=0; x<=400; x+=8) {
        var n2 = 0;
        for (var y=0; y<=200; y+=8) {
            var c = map(noise(n1,n2),0,1,0,255);
            fill(c, c, c+timeOfDay(),150);
            rect(x,y,8,8);
            n2 += 0.05; // step size in noise
        }
        n1 += 0.02; // step size in noise
    }
    a -= 0.001;  // speed of clouds
    
};

var drawRange = function(c1) {
    noStroke();
    fill(117, 117, 117);
    var incAmount = 0.01;
    for (var t = 0; t < incAmount*width; t += incAmount) {
        stroke(117, 117, 117);
        var n = noise(t + c1 * 20);
        var y = map(n, 0, 1, 10, height/2);
        rect(t*100, y, 1, 150);
    }

};

var drawHills = function()
{
    stroke(0, 0, 0);
    strokeWeight(1);
    fill(0, 100, 0);
    bezier(525, 265, 350, 100, 121, 259, 111, 324);
    bezier(372, 402, 150, 50, -121, 259, -201, 442);
    bezier(689, 291, 450, 150, 221, 259, 107, 410);
    bezier(453, 455, 350, 150, 121, 259, 111, 458);
};

var updateDay = function()
{
    sunX += 0.3;
    if(sunX > 430)
    {
        sunX = -30;
    }
};

var drawTitle = function()
{
    fill(0, 0, 0);
    textFont(createFont("fantasy"), 30);
    textAlign(CENTER, CENTER);
    text("CLASH OF PROSECUTION", 200, 150);
    textSize(15);
    text("Kiernan George", 200, 180);
};

var drawMage = function()
{
    noStroke();
    fill(255, 219, 172);
    ellipse(40, 320, 30, 30);
    fill(0, 0, 0);
    ellipse(35, 315, 5, 5);
    ellipse(45, 315, 5, 5);
    arc(40, 325, 10, 10, 0, PI);
    fill(0, 0, 128);
    quad(33, 335, 47, 335, 55, 355, 25, 355);
    ellipse(40, 305, 40, 10);
    arc(40, 305, 15, 30, PI, 2*PI);
    ellipse(40, 350, 16, 30);
    fill(255, 219, 172);
    ellipse(30, 345, 10, 10);
    ellipse(50, 345, 10, 10);
    fill(139,69,19);
    quad(50, 370, 55, 370,  55, 335, 50, 335);
    fill(255, 0, 0);
    rect(50, 325, 5, 10);
    fill(255, 255, 255);
    ellipse(35, 315, 2, 2);
    ellipse(45, 315, 2, 2);
};

var drawWarrior = function()
{
    noStroke();
    fill(241, 194, 125);
    ellipse(160, 320, 30, 30);
    fill(255, 255, 255);
    ellipse(155, 315, 5, 5);
    ellipse(165, 315, 5, 5);
    arc(160, 325, 10, 10, 0, PI);
    fill(255, 0, 0);
    ellipse(155, 315, 2, 2);
    ellipse(165, 315, 2, 2);
    fill(141, 85, 36);
    ellipse(160, 350, 16, 30);
    fill(241, 194, 125);
    ellipse(150, 345, 10, 10);
    ellipse(170, 345, 10, 10);
    fill(255, 215, 0);
    ellipse(160, 340, 3, 3);
    ellipse(160, 345, 3, 3);
    ellipse(160, 350, 3, 3);
    fill(141, 85, 36);
    quad(175, 337, 178, 340, 177, 359, 174, 356);
    quad(171, 334, 185, 339, 183, 342, 170, 338);
    fill(128, 128, 128);
    ellipse(175, 356, 5, 5);
    quad(179, 315, 183, 316, 180, 337, 176, 337);
    triangle(179, 315, 183, 316, 182, 310);
    stroke(105, 105, 105);
    strokeWeight(2);
    line(182, 311, 178, 337);
    noStroke();
};

var drawRogue = function()
{
    noStroke();
    fill(0, 0, 0);
    ellipse(80, 320, 30, 30);
    ellipse(80, 350, 16, 30);
    fill(255, 255, 255);
    ellipse(75, 315, 5, 5);
    ellipse(85, 315, 5, 5);
    arc(80, 325, 10, 10, 0, PI);
    fill(0, 0, 0);
    ellipse(75, 315, 2, 2);
    ellipse(85, 315, 2, 2);
    fill(224, 172, 105);
    ellipse(70, 345, 10, 10);
    ellipse(90, 345, 10, 10);
    fill(192,192,192);
    rect(73, 353, 13, 3);
    fill(139,69,19);
    rect(77, 353, 5, 3);
    
};

var drawMonk = function()
{
    fill(198, 134, 66);
    ellipse(120, 320, 30, 30);
    ellipse(120, 350, 16, 30);
    ellipse(110, 345, 10, 10);
    ellipse(130, 345, 10, 10);
    fill(255, 255, 255);
    ellipse(115, 315, 5, 5);
    ellipse(125, 315, 5, 5);
    fill(0, 0, 0);
    ellipse(115, 315, 2, 2);
    ellipse(125, 315, 2, 2);
    arc(120, 325, 10, 3, PI, 2*PI);
    strokeWeight(1);
    stroke(0, 0, 0);
    line(120, 345, 120, 355);
    line(117, 347, 123, 347);
    line(117, 350, 123, 350);
    line(117, 353, 123, 353);
    noStroke();
    fill(141, 85, 36);
    arc(120, 355, 16, 20, 0, PI);
    fill(255, 0, 0);
    rect(110, 307, 20, 3);
    
};

var drawGoblins = function()
{
    fill(220, 20, 60);
    ellipse(280, 320, 30, 30);
    stroke(0, 0, 0);
    triangle(280, 318, 275, 323, 280, 323);
    strokeWeight(1);
    line(273, 310, 278, 310);
    line(282, 310, 287, 310);
    noStroke();
    fill(0, 0, 0);
    ellipse(275, 315, 5, 5);
    ellipse(285, 315, 5, 5);
    arc(280, 330, 10, 5, PI, 2*PI);
    fill(255, 0, 255);
    ellipse(275, 315, 2, 2);
    ellipse(285, 315, 2, 2);
    fill(220, 20, 60);
    ellipse(280, 350, 16, 30);
    ellipse(290, 345, 10, 10);
    ellipse(270, 345, 10, 10);
    fill(108, 108, 108);
    arc(270, 340, 10, 10, PI/2, 3*PI/2);
    arc(290, 340, 10, 10, 3*PI/2, 2*PI);
    fill(139, 69, 19);
    rect(265, 340, 5, 10);
    rect(290, 340, 5, 10);
    
    fill(135,206,235);
    ellipse(320, 320, 30, 30);
    stroke(0, 0, 0);
    triangle(320, 318, 315, 323, 320, 323);
    strokeWeight(1);
    line(313, 310, 318, 310);
    line(322, 310, 327, 310);
    noStroke();
    fill(0, 0, 0);
    ellipse(315, 315, 5, 5);
    ellipse(325, 315, 5, 5);
    arc(320, 330, 10, 5, PI, 2*PI);
    fill(255, 0, 255);
    ellipse(315, 315, 2, 2);
    ellipse(325, 315, 2, 2);
    fill(135,206,235);
    ellipse(320, 350, 16, 30);
    ellipse(330, 345, 10, 10);
    ellipse(310, 345, 10, 10);
    fill(108, 108, 108);
    arc(310, 340, 10, 10, PI/2, 3*PI/2);
    arc(330, 340, 10, 10, 3*PI/2, 2*PI);
    fill(139, 69, 19);
    rect(305, 340, 5, 10);
    rect(330, 340, 5, 10);
};

var drawCharacters = function()
{
    drawMage();
    drawWarrior();
    drawRogue();
    drawMonk();
};

var drawMenu = function()
{
    fill(0, 0, 0);
    textFont(createFont("fantasy"), 15);
    text("START", 200, 210);
    text("OPTIONS", 200, 230);
    if(startSelect === 1)
    {
        triangle(175, 205, 180, 210, 175, 215);
    }
    else
    {
        triangle(165, 225, 170, 230, 165, 235);
    }
};

var updateSelect = function()
{
    if(startScreen === 1)
    {
        if(keyArray[119] === 1)
        {
            startSelect = 1;
            optionSelect = 0;
        }
        else if(keyArray[115] === 1)
        {
            startSelect = 0;
            optionSelect = 1;
        }
        else if(keyArray[10] === 1)
        {
            if(startSelect === 1)
            {
                startScreen = 0;
                gameScreen = 1;
            }
            else if(optionSelect === 1)
            {
                startScreen = 0;
                optionsScreen = 1;
            }
        }
    }
};

var mouseClicked = function() 
{
    if(optionsScreen === 1)
    {
        if(mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 50)
        {
            optionsScreen = 0;
            startScreen = 1;
        }
        else if(mouseX > 140 && mouseX < 240 && mouseY > 80 && mouseY < 130)
        {
            sound = 1;
        }
        else if(mouseX > 250 && mouseX < 350 && mouseY > 80 && mouseY < 130)
        {
            sound = 0;
        }
        else if(mouseX > 120 && mouseX < 200 && mouseY > 160 && mouseY < 210)
        {
            difficulty = 1;
        }
        else if(mouseX > 210 && mouseX < 290 && mouseY > 160 && mouseY < 210)
        {
            difficulty = 2;
        }
        else if(mouseX > 300 && mouseX < 380 && mouseY > 160 && mouseY < 210)
        {
            difficulty = 3;
        }
    }
};

var drawScreen = function()
{
    if(startScreen === 1)
    {
        background(255, 255, 255);
        drawSky();
        drawSun();
        drawRange(1200);
        drawHills();
        drawTitle();
        drawCharacters();
        drawGoblins();
        drawMenu();
        updateSelect();
        updateDay();
    }
    else if(optionsScreen === 1)
    {
        background(255, 255, 255);
        fill(0, 0, 0);
        textFont(createFont("fantasy"), 30);
        text("Options", 200, 20);
        text("Sound", 50, 100);
        text("Difficulty", 60, 180);
        stroke(0, 0, 0);
        strokeWeight(1);
        fill(108, 108, 108);
        rect(0, 0, 100, 50, 30);
        fill(0, 0, 0);
        text("Back", 50, 25);
        if(sound === 1)
        {
            fill(108, 108, 108);
            rect(140, 80, 100, 50, 30);
            fill(255, 255, 255);
            rect(250, 80, 100, 50, 30);
        }
        else
        {
            fill(108, 108, 108);
            rect(250, 80, 100, 50, 30);
            fill(255, 255, 255);
            rect(140, 80, 100, 50, 30);
        }
        fill(0, 0, 0);
        text("On", 190, 105);
        text("Off", 300, 105);
        if(difficulty === 1)
        {
            fill(108, 108, 108);
            rect(120, 160, 80, 50, 30);
            fill(255, 255, 255);
            rect(210, 160, 80, 50, 30);
            rect(300, 160, 80, 50, 30);
        }
        else if(difficulty === 2)
        {
            fill(108, 108, 108);
            rect(210, 160, 80, 50, 30);
            fill(255, 255, 255);
            rect(120, 160, 80, 50, 30);
            rect(300, 160, 80, 50, 30);
        }
        else
        {
            fill(108, 108, 108);
            rect(300, 160, 80, 50, 30);
            fill(255, 255, 255);
            rect(210, 160, 80, 50, 30);
            rect(120, 160, 80, 50, 30);
        }
        fill(0, 0, 0);
        textSize(20);
        text("Easy", 160, 185);
        text("Normal", 250, 185);
        text("Hard", 340, 185);
    }
    else if(gameScreen === 1)
    {
        background(255, 255, 255);
        fill(0, 0, 0);
        textFont(createFont("fantasy"), 30);
        text("TO BE ADDED LATER", 200, 200);
    }
};

draw = function() {
    drawScreen();
};


}};
