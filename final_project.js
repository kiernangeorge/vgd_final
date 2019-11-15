var sketchProc = function (processingInstance) {
    with (processingInstance) {
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
        //globals to handle screen display
        var startScreen = 1;
        var optionsScreen = 0;
        var instructionsScreen = 0;
        var startMenuSelect = 0;
        var nameScreen = 0;
        var townScreen = 0;
        var wild1Screen = 0;
        var battleScreen = 0;
        var inventoryScreen = 0;
        var returnFromInventory = -1;

        //globals to handle settings
        var sound = 1;
        var difficulty = 1;
        var keyMap = [];
        keyMap[0] = 119; //up
        keyMap[1] = 115; //down
        keyMap[2] = 97; //left
        keyMap[3] = 100; //right
        keyMap[4] = 10; //select
        keyMap[5] = 105; //inventory
        var keyArray = [];

        //globals for start screen animation
        var a = random(1500);
        var sunX = 300;

        //globals for naming characters
        var enterKey = "enter";
        var rename = -1;

        //array to hold the four characters
        var characters = [];

        //player, used when moving out of battle
        var cam;

        //character sprites
        monk = loadImage("sprites/characters/monk.png");
        mage = loadImage("sprites/characters/mage.png");
        knight = loadImage("sprites/characters/knight.png");
        rogue = loadImage("sprites/characters/rogue.png");

        //tile sprites
        short_grass = loadImage("sprites/tiles/short_grass.png");
        door = loadImage("sprites/tiles/door.png");
        tall_grass = loadImage("sprites/tiles/tall_grass.png");
        water = loadImage("sprites/tiles/water.png");
        wall = loadImage("sprites/tiles/wall.png");
        flowers = loadImage("sprites/tiles/flowers.png");
        house_wall = loadImage("sprites/tiles/house_wall.png");
        house_floor = loadImage("sprites/tiles/house_floor.png");
        path = loadImage("sprites/tiles/path.png");
        fence_side = loadImage("sprites/tiles/fence_side.png");
        fence_top = loadImage("sprites/tiles/fence_top.png");
        weapon_shop = loadImage("sprites/tiles/weapon_shop.png");
        item_shop = loadImage("sprites/tiles/item_shop.png");
		coin = loadImage("sprites/items/coin.png");
		armor = loadImage("sprites/tiles/armor.png");

        //town tilemap array
        var town = [];

        //first wild tilemap array
        var wild1 = [];

        var floor = function (x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
        };

        floor.prototype.draw = function () {
            if (this.type === "wall") {
                image(wall, this.x, this.y, 20, 20);
            } else if (this.type === "short_grass") {
                image(short_grass, this.x, this.y, 20, 20);
            } else if (this.type === "water") {
                image(water, this.x, this.y, 20, 20);
            } else if (this.type === "house_wall") {
                image(house_wall, this.x, this.y, 20, 30);
            } else if (this.type === "house_floor") {
                image(house_floor, this.x, this.y, 20, 20);
            } else if (this.type === "path") {
                image(path, this.x, this.y, 20, 25);
            } else if (this.type === "flowers") {
                image(flowers, this.x, this.y, 20, 27);
            } else if (this.type === "fence_side") {
                image(short_grass, this.x, this.y, 20, 20);
                image(fence_side, this.x, this.y, 24, 27);
            } else if (this.type === "fence_top") {
                image(short_grass, this.x, this.y, 20, 20);
                image(fence_top, this.x, this.y, 20, 27);
            } else if (this.type === "weapon_shop") {
                image(house_wall, this.x, this.y, 20, 20);
                image(weapon_shop, this.x, this.y, 20, 27);
            } else if (this.type === "item_shop") {
                image(house_wall, this.x, this.y, 20, 20);
                image(item_shop, this.x, this.y, 20, 22);
            }
        };

        //w = wall, s = short grass, t = tall grass, f = flower, d = door, b = water, h = house wall
        //y = house floor, p = path, z = fence side, x = fence top
        var townTilemap = [
            "wwwwwwwwwwwwwwwwwwww",
            "wssssssssssssssssssw",
            "wssssssssssxzzzzzzxw",
            "wssshhhhhhhxssssffxw",
            "wssshyyyyyhxsfssssxw",
            "wssshyyyyyhxzzzszzxw",
            "wssshhhyhchssssssssw",
            "wsssssspsssssssssssw",
            "wsssssspppsssssssssw",
            "wsssssssspsssssssssw",
            "wsssssssspsssssssssw",
            "wsssssssspsswwwwwssw",
            "wsssssssspsswbbbwssw",
            "whhhhhssspsswbbbwssw",
            "whyyyhssspsswwwwwssw",
            "whyyyhssspsssspfsssw",
            "whyyyppppppppppssssw",
            "whhahhfsspfssssssssw",
            "wsssssssspsssssssssw",
            "wwwwwwwwwpwwwwwwwwww"];

        var wild1Tilemap = [
            "wwwwwwwwwpwwwwwwwwww",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss",
            "ssssssssssssssssssss"];

        var initTilemap = function (tilemap, tiles) {
            for (var row = 0; row < tilemap.length; row++) {
                for (var col = 0; col < tilemap[row].length; col++) {
                    switch (tilemap[row][col]) {
                    case 'w':
                        tiles.push(new floor(col * 20, row * 20, "wall"));
                        break;
                    case 's':
                        tiles.push(new floor(col * 20, row * 20, "short_grass"));
                        break;
                    case 'b':
                        tiles.push(new floor(col * 20, row * 20, "water"));
                        break;
                    case 'h':
                        tiles.push(new floor(col * 20, row * 20, "house_wall"));
                        break;
                    case 'y':
                        tiles.push(new floor(col * 20, row * 20, "house_floor"));
                        break;
                    case 'p':
                        tiles.push(new floor(col * 20, row * 20, "path"));
                        break;
                    case 'f':
                        tiles.push(new floor(col * 20, row * 20, "flowers"));
                        break;
                    case 'z':
                        tiles.push(new floor(col * 20, row * 20, "fence_side"));
                        break;
                    case 'x':
                        tiles.push(new floor(col * 20, row * 20, "fence_top"));
                        break;
                    case 'a':
                        tiles.push(new floor(col * 20, row * 20, "weapon_shop"));
                        break;
                    case 'c':
                        tiles.push(new floor(col * 20, row * 20, "item_shop"));
                        break;
                    default:
                        break;
                    }
                }
            }
        };

        var checkCollisions = function (row, col, tilemap) {
            if (tilemap[col][row] === 'w' || tilemap[col][row] === 'b' || tilemap[col][row] === 'h' || tilemap[col][row] === 'z' || tilemap[col][row] === 'x') {
                return 1;
            }
            return 0;
        };

        var drawTilemap = function (tiles) {
            for (var index = 0; index < tiles.length; index++) {
                tiles[index].draw();
            }
        };

        var character = function (health, mana, weapon, armor) {
            this.name = "Click to name";
            this.health = health;
            this.mana = mana;
			this.coin = 50;
			this.weapon = weapon;
			this.armor = armor;
        }

        characters.push(new character(100, -1, "Rusty Sword", "Tarnished Mail")); //knight
        characters.push(new character(100, 50, "Basic Staff", "Novice Robes")); //mage
        characters.push(new character(100, -1, "Dagger", "Leather Armor")); //rogue
        characters.push(new character(100, 30, "Fists", "Basic Gi")); //monk

        var camera = function () {
            this.x = 180;
            this.y = 200;
        };

        camera.prototype.draw = function () {
            image(knight, this.x, this.y, 20, 20);
        };

        cam = new camera();

        var remapKey = function () {
            for (var index = 0; index < keyMap.length; index++) {
                if (keyMap[index] === -1) {
                    return 1;
                }
            }
            return 0;
        };

        var setKey = function (x) {
            for (var index = 0; index < keyMap.length; index++) {
                if (keyMap[index] === -1) {
                    keyMap[index] = x;
                }
            }
        };

        var setName = function (x) {
            characters[rename].name += String.fromCharCode(x);
        }

        var setDefaultNamesIfNecessary = function () {
            if (characters[0].name === "Click to name" || characters[0].name === "") {
                characters[0].name = "Knight";
            }
            if (characters[1].name === "Click to name" || characters[1].name === "") {
                characters[1].name = "Mage";
            }
            if (characters[2].name === "Click to name" || characters[2].name === "") {
                characters[2].name = "Rogue";
            }
            if (characters[3].name === "Click to name" || characters[3].name === "") {
                characters[3].name = "Monk";
            }
        }

        var checkForKeyConflicts = function (x) {
            for (var index = 0; index < keyMap.length; index++) {
                if (keyMap[index] === x) {
                    return 1;
                }
            }
            return 0;
        };

        var validNameCharacter = function (x) {
            if ((x > 47 && x < 58) || x === 32 || (x > 96 && x < 123)) {
                return 1;
            } else {
                return 0;
            }
        }

        var keyPressed = function () {
            if (remapKey() === 1) {
                if (checkForKeyConflicts(key.code) === 0) {
                    setKey(key.code);
                }
            } else if (rename !== -1) {
                if (key.code === keyMap[4]) {
                    rename = -1;
                } else if (validNameCharacter(key.code) === 1) {
                    setName(key.code);
                }
            } else {
                keyArray[key.code] = 1;
            }
        };

        var keyReleased = function () {
            keyArray[key.code] = 0;
        };

        var drawSun = function () {
            noStroke();
            fill(252, 212, 64);
            ellipse(sunX, 50, 30, 30);
        };

        var timeOfDay = function () {
            if (sunX > 385) {
                var ret = 450 - sunX;
                if (ret < 50) {
                    ret = 50;
                }
                return ret;
            } else if (sunX < 0) {
                var ret = (15 - (sunX * -1)) * 10;
                if (ret < 50) {
                    ret = 50;
                }
                return ret;
            } else {
                return 150;
            }
        };

        var drawSky = function () {

            noStroke();
            var n1 = a;
            for (var x = 0; x <= 400; x += 8) {
                var n2 = 0;
                for (var y = 0; y <= 200; y += 8) {
                    var c = map(noise(n1, n2), 0, 1, 0, 255);
                    fill(c, c, c + timeOfDay(), 150);
                    rect(x, y, 8, 8);
                    n2 += 0.05; // step size in noise
                }
                n1 += 0.02; // step size in noise
            }
            a -= 0.001; // speed of clouds

        };

        var drawRange = function (c1) {
            noStroke();
            fill(117, 117, 117);
            var incAmount = 0.01;
            for (var t = 0; t < incAmount * width; t += incAmount) {
                stroke(117, 117, 117);
                var n = noise(t + c1 * 20);
                var y = map(n, 0, 1, 10, height / 2);
                rect(t * 100, y, 1, 150);
            }

        };

        var drawHills = function () {
            stroke(0, 0, 0);
            strokeWeight(1);
            fill(0, 100, 0);
            bezier(525, 265, 350, 100, 121, 259, 111, 324);
            bezier(372, 402, 150, 50, -121, 259, -201, 442);
            bezier(689, 291, 450, 150, 221, 259, 107, 410);
            bezier(453, 455, 350, 150, 121, 259, 111, 458);
        };

        var updateDay = function () {
            sunX += 0.3;
            if (sunX > 430) {
                sunX = -30;
            }
        };

        var drawTitle = function () {
            fill(0, 0, 0);
            textFont(createFont("fantasy"), 30);
            textAlign(CENTER, CENTER);
            text("CLASH OF PROSECUTION", 200, 150);
            textSize(15);
            text("Kiernan George", 200, 180);
        };

        var drawMage = function () {
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
            arc(40, 305, 15, 30, PI, 2 * PI);
            ellipse(40, 350, 16, 30);
            fill(255, 219, 172);
            ellipse(30, 345, 10, 10);
            ellipse(50, 345, 10, 10);
            fill(139, 69, 19);
            quad(50, 370, 55, 370, 55, 335, 50, 335);
            fill(255, 0, 0);
            rect(50, 325, 5, 10);
            fill(255, 255, 255);
            ellipse(35, 315, 2, 2);
            ellipse(45, 315, 2, 2);
        };

        var drawWarrior = function () {
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

        var drawRogue = function () {
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
            fill(192, 192, 192);
            rect(73, 353, 13, 3);
            fill(139, 69, 19);
            rect(77, 353, 5, 3);

        };

        var drawMonk = function () {
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
            arc(120, 325, 10, 3, PI, 2 * PI);
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

        var drawGoblins = function () {
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
            arc(280, 330, 10, 5, PI, 2 * PI);
            fill(255, 0, 255);
            ellipse(275, 315, 2, 2);
            ellipse(285, 315, 2, 2);
            fill(220, 20, 60);
            ellipse(280, 350, 16, 30);
            ellipse(290, 345, 10, 10);
            ellipse(270, 345, 10, 10);
            fill(108, 108, 108);
            arc(270, 340, 10, 10, PI / 2, 3 * PI / 2);
            arc(290, 340, 10, 10, 3 * PI / 2, 2 * PI);
            fill(139, 69, 19);
            rect(265, 340, 5, 10);
            rect(290, 340, 5, 10);

            fill(135, 206, 235);
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
            arc(320, 330, 10, 5, PI, 2 * PI);
            fill(255, 0, 255);
            ellipse(315, 315, 2, 2);
            ellipse(325, 315, 2, 2);
            fill(135, 206, 235);
            ellipse(320, 350, 16, 30);
            ellipse(330, 345, 10, 10);
            ellipse(310, 345, 10, 10);
            fill(108, 108, 108);
            arc(310, 340, 10, 10, PI / 2, 3 * PI / 2);
            arc(330, 340, 10, 10, 3 * PI / 2, 2 * PI);
            fill(139, 69, 19);
            rect(305, 340, 5, 10);
            rect(330, 340, 5, 10);
        };

        var drawCharacters = function () {
            drawMage();
            drawWarrior();
            drawRogue();
            drawMonk();
        };

        var drawMenu = function () {
            fill(0, 0, 0);
            textFont(createFont("fantasy"), 15);
            text("START", 200, 210);
            text("OPTIONS", 200, 250);
            text("INSTRUCTIONS", 200, 230);
            if (startMenuSelect === 0) {
                triangle(175, 205, 180, 210, 175, 215);
            } else if (startMenuSelect === 1) {
                triangle(145, 225, 150, 230, 145, 235);
            } else if (startMenuSelect === 2) {
                triangle(165, 245, 170, 250, 165, 255);
            }
        };

        var updateSelect = function () {
            if (startScreen === 1) {
                if (keyArray[keyMap[0]] === 1) {
                    if (startMenuSelect > 0) {
                        startMenuSelect--;
                    }
                    keyArray[keyMap[0]] = 0;
                } else if (keyArray[keyMap[1]] === 1) {
                    if (startMenuSelect < 2) {
                        startMenuSelect++;
                    }
                    keyArray[keyMap[1]] = 0;
                } else if (keyArray[keyMap[4]] === 1) {
                    if (startMenuSelect === 0) {
                        startScreen = 0;
                        nameScreen = 1;
                    } else if (startMenuSelect === 1) {
                        startScreen = 0;
                        instructionsScreen = 1;
                    } else if (startMenuSelect === 2) {
                        startScreen = 0;
                        optionsScreen = 1;
                    }
                }
            }
        };

        var mouseClicked = function () {
            if (optionsScreen === 1) {
                if (remapKey() === 0) {
                    if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 50) {
                        optionsScreen = 0;
                        startScreen = 1;
                    } else if (mouseX > 140 && mouseX < 240 && mouseY > 80 && mouseY < 130) {
                        sound = 1;
                    } else if (mouseX > 250 && mouseX < 350 && mouseY > 80 && mouseY < 130) {
                        sound = 0;
                    } else if (mouseX > 120 && mouseX < 200 && mouseY > 160 && mouseY < 210) {
                        difficulty = 1;
                    } else if (mouseX > 210 && mouseX < 290 && mouseY > 160 && mouseY < 210) {
                        difficulty = 2;
                    } else if (mouseX > 300 && mouseX < 380 && mouseY > 160 && mouseY < 210) {
                        difficulty = 3;
                    } else if (mouseX > 230 && mouseX < 380 && mouseY > 310 && mouseY < 360) {
                        sound = 1;
                        difficulty = 1;
                        keyMap[0] = 119;
                        keyMap[1] = 115;
                        keyMap[2] = 97;
                        keyMap[3] = 100;
                        keyMap[4] = 10;
                        keyMap[5] = 105;
                    } else if (mouseX > 120 && mouseX < 180 && mouseY > 220 && mouseY < 260) {
                        keyMap[0] = -1;
                    } else if (mouseX > 120 && mouseX < 180 && mouseY > 265 && mouseY < 305) {
                        keyMap[1] = -1;
                    } else if (mouseX > 120 && mouseX < 180 && mouseY > 310 && mouseY < 350) {
                        keyMap[2] = -1;
                    } else if (mouseX > 120 && mouseX < 180 && mouseY > 355 && mouseY < 395) {
                        keyMap[3] = -1;
                    } else if (mouseX > 320 && mouseX < 380 && mouseY > 220 && mouseY < 260) {
                        keyMap[5] = -1;
                    } else if (mouseX > 320 && mouseX < 380 && mouseY > 265 && mouseY < 305) {
                        keyMap[4] = -1;
                    }
                }
            } else if (instructionsScreen === 1) {
                if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 50) {
                    instructionsScreen = 0;
                    startScreen = 1;
                }
            } else if (nameScreen === 1) {
                if (rename === -1) {
                    /*
                    rect(160, 90, 200, 50, 30); //knight name
                    rect(160, 160, 200, 50, 30); //mage
                    rect(160, 230, 200, 50, 30); //rogue
                    rect(160, 300, 200, 50, 30); //monk
                     */
                    if (mouseX > 160 && mouseX < 360 && mouseY > 90 && mouseY < 140) {
                        characters[0].name = "";
                        rename = 0;
                    } else if (mouseX > 160 && mouseX < 360 && mouseY > 160 && mouseY < 210) {
                        characters[1].name = "";
                        rename = 1;
                    } else if (mouseX > 160 && mouseX < 360 && mouseY > 230 && mouseY < 280) {
                        characters[2].name = "";
                        rename = 2;
                    } else if (mouseX > 160 && mouseX < 360 && mouseY > 300 && mouseY < 350) {
                        characters[3].name = "";
                        rename = 3;
                    } else if (mouseX > 300 && mouseY > 370) {
                        setDefaultNamesIfNecessary();
                        nameScreen = 0;
                        townScreen = 1;
                    }
                }
            } else if (inventoryScreen === 1) 
			{
				if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 50) {
                    inventoryScreen = 0;
                    if(returnFromInventory === 0)
					{
						townScreen = 1;
						returnFromInventory = -1;
					}
					else if(returnFromInventory === 1)
					{
						wild1Screen = 1;
						returnFromInventory = -1;
					}
                }
			}
        };

        var updateFocus = function (map) {
            if (keyArray[keyMap[0]] === 1) {
                if (cam.y === 0 && cam.x === 180 && wild1Screen === 1) {
                    wild1Screen = 0;
                    townScreen = 1;
                    cam.y = 380;
                } else {
                    if (cam.y > 0) {
                        cam.y -= 20;
                        keyArray[keyMap[0]] = 0;
                        if (checkCollisions(cam.x / 20, cam.y / 20, map) === 1) {
                            cam.y += 20;
                        }
                    }
                }
            } else if (keyArray[keyMap[1]] === 1) {
                if (cam.y === 380 && cam.x === 180 && townScreen === 1) {
                    townScreen = 0;
                    wild1Screen = 1;
                    cam.y = 0;
                } else {
                    if (cam.y < 380) {
                        cam.y += 20;
                        keyArray[keyMap[1]] = 0;
                        if (checkCollisions(cam.x / 20, cam.y / 20, map) === 1) {
                            cam.y -= 20;
                        }
                    }
                }
            } else if (keyArray[keyMap[2]] === 1) {
                if (cam.x > 0) {
                    cam.x -= 20;
                    keyArray[keyMap[2]] = 0;
                    if (checkCollisions(cam.x / 20, cam.y / 20, map) === 1) {
                        cam.x += 20;
                    }
                }
            } else if (keyArray[keyMap[3]] === 1) {
                if (cam.x < 380) {
                    cam.x += 20;
                    keyArray[keyMap[3]] = 0;
                    if (checkCollisions(cam.x / 20, cam.y / 20, map) === 1) {
                        cam.x -= 20;
                    }
                }
            } else if (keyArray[keyMap[5]] === 1) {
                if (townScreen === 1) {
                    townScreen = 0;
                    inventoryScreen = 1;
                    returnFromInventory = 0;
				}
                    else if (wild1Screen === 1) {
                        wild1Screen = 0;
                        inventoryScreen = 1;
                        returnFromInventory = 1;
                    }
                }
            
        }

        initTilemap(townTilemap, town);
        initTilemap(wild1Tilemap, wild1);

        var drawScreen = function () {
            textAlign(CENTER, CENTER);
            if (startScreen === 1) {
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
            } else if (optionsScreen === 1) {
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
                if (sound === 1) {
                    fill(108, 108, 108);
                    rect(140, 80, 100, 50, 30);
                    fill(255, 255, 255);
                    rect(250, 80, 100, 50, 30);
                } else {
                    fill(108, 108, 108);
                    rect(250, 80, 100, 50, 30);
                    fill(255, 255, 255);
                    rect(140, 80, 100, 50, 30);
                }
                fill(0, 0, 0);
                text("On", 190, 105);
                text("Off", 300, 105);
                if (difficulty === 1) {
                    fill(108, 108, 108);
                    rect(120, 160, 80, 50, 30);
                    fill(255, 255, 255);
                    rect(210, 160, 80, 50, 30);
                    rect(300, 160, 80, 50, 30);
                } else if (difficulty === 2) {
                    fill(108, 108, 108);
                    rect(210, 160, 80, 50, 30);
                    fill(255, 255, 255);
                    rect(120, 160, 80, 50, 30);
                    rect(300, 160, 80, 50, 30);
                } else {
                    fill(108, 108, 108);
                    rect(300, 160, 80, 50, 30);
                    fill(255, 255, 255);
                    rect(120, 160, 80, 50, 30);
                    rect(210, 160, 80, 50, 30);
                }
                fill(0, 0, 0);
                textSize(20);
                text("Easy", 160, 185);
                text("Normal", 250, 185);
                text("Hard", 340, 185);

                fill(108, 108, 108);
                rect(120, 220, 60, 40, 30); //up
                rect(120, 265, 60, 40, 30); //down
                rect(120, 310, 60, 40, 30); //left
                rect(120, 355, 60, 40, 30); //right
                rect(320, 220, 60, 40, 30); //inventory
                rect(320, 265, 60, 40, 30); //select
                rect(230, 310, 150, 50, 30); //restore defaults
                fill(0, 0, 0);
                textSize(30);
                text("Up", 60, 240);
                text("Down", 60, 285);
                text("Left", 60, 330);
                text("Right", 60, 375);
                text("Inventory", 250, 240);
                text("Select", 250, 285);
                text(String.fromCharCode(keyMap[0]), 150, 240);
                text(String.fromCharCode(keyMap[1]), 150, 285);
                text(String.fromCharCode(keyMap[2]), 150, 330);
                text(String.fromCharCode(keyMap[3]), 150, 375);
                text(String.fromCharCode(keyMap[5]), 350, 240);
                if (keyMap[4] === 10) {
                    textSize(20);
                    text(enterKey, 350, 285);
                } else {
                    text(String.fromCharCode(keyMap[4]), 350, 285);
                }
                textSize(20);
                text("Restore Default", 305, 335);
            } else if (instructionsScreen === 1) {
                background(0, 0, 0);
                textFont(createFont("fantasy"), 30);
                fill(255, 255, 255);
                text("Instructions", 200, 20);
                stroke(255, 255, 255);
                line(100, 40, 300, 40);
                noStroke();
                textSize(18);
                textAlign(LEFT, LEFT);
                text("Welcome to Clash of Prosecution, a turn-based", 10, 80);
                text("RPG inspired by Final Fantasy 1. You will control", 10, 110);
                text("a character while roaming in the semi-open world.", 10, 140);
                text("While outside of the starting town, there is a", 10, 170);
                text("random encounter system that will trigger combat.", 10, 200);
                text("In combat you will control 4 characters, a mage, a", 10, 230);
                text("knight, a monk, and a rogue. Default keys are WASD", 10, 260);
                text("for movement, Enter for select, and I for inventory.", 10, 290);
                text("You can change the key mappings and other settings in", 10, 320);
                text("the options screen. Have fun!", 10, 350);
                fill(108, 108, 108);
                rect(0, 0, 100, 50, 30);
                fill(0, 0, 0);
                textSize(30);
                textAlign(CENTER, CENTER);
                text("Back", 50, 25);
            } else if (nameScreen === 1) {
                background(0, 0, 0);
                image(knight, 80, 70, 60, 60);
                image(mage, 80, 140, 60, 60);
                image(rogue, 80, 210, 60, 60);
                image(monk, 85, 300, 50, 50);
                textFont(createFont("fantasy"), 30);
                fill(255, 255, 255);
                text("Characters", 200, 40);
                stroke(255, 255, 255);
                line(100, 60, 300, 60);
                noStroke();
                textSize(20);
                text("Knight", 30, 110);
                text("Mage", 30, 180);
                text("Rogue", 30, 255);
                text("Monk", 30, 330);
                stroke(0, 0, 0);
                fill(108, 108, 108);
                rect(160, 90, 200, 50, 30); //knight name
                rect(160, 160, 200, 50, 30); //mage
                rect(160, 230, 200, 50, 30); //rogue
                rect(160, 300, 200, 50, 30); //monk
                noStroke();
                fill(0, 0, 0);
                textAlign(CENTER, CENTER);
                textSize(20);
                text(characters[0].name, 260, 115);
                text(characters[1].name, 260, 185);
                text(characters[2].name, 260, 255);
                text(characters[3].name, 260, 325);
                fill(255, 255, 255);
                text("Continue->", 350, 380);
                if (rename !== -1) {
                    text("Press Select to finish", 200, 380);
                }
            } else if (townScreen === 1) {
                background(0, 0, 0);
                drawTilemap(town);
                cam.draw();
                updateFocus(townTilemap);
            } else if (wild1Screen === 1) {
                background(0, 0, 0);
                drawTilemap(wild1);
                cam.draw();
                updateFocus(wild1Tilemap);
            } else if (inventoryScreen === 1) {
                background(0, 0, 0);
                fill(108, 108, 108);
                rect(0, 0, 100, 50, 30);
                fill(0, 0, 0);
                textFont(createFont("fantasy"), 30);
                textAlign(CENTER, CENTER);
                text("Back", 50, 25);
                fill(255, 255, 255);
                textAlign(LEFT, LEFT);
                textSize(15);
                text(characters[0].name, 0, 115, 20);
                text(characters[1].name, 0, 185);
                text(characters[2].name, 0, 255);
                text(characters[3].name, 0, 325);
                textSize(30);
                text("Inventory", 140, 30);
                stroke(255, 255, 255);
                noStroke();
                image(knight, 70, 70, 60, 60);
                image(mage, 70, 140, 60, 60);
                image(rogue, 70, 210, 60, 60);
                image(monk, 75, 300, 50, 50);
                textSize(15);
                text("Health: " + characters[0].health + "/100", 150, 105);
                text("Mana:", 150, 125);
                text("Health: " + characters[1].health + "/100", 150, 175);
                text("Mana: " + characters[1].mana + "/50", 150, 195);
                text("Health: " + characters[2].health + "/100", 150, 245);
                text("Mana:", 150, 265);
                text("Health: " + characters[3].health + "/100", 150, 320);
                text("Mana: " + characters[3].mana + "/30", 150, 340);
				image(coin, 330, 0, 30, 30);
				textSize(20);
				text(characters[0].coin, 365, 25);
				image(weapon_shop, 260, 95);
				image(armor, 262, 115, 15, 20);
				image(weapon_shop, 260, 165);
				image(armor, 262, 185, 15, 20);
				image(weapon_shop, 260, 235);
				image(armor, 262, 255, 15, 20);
				image(weapon_shop, 260, 310);
				image(armor, 262, 330, 15, 20);
				textSize(15);
				text(characters[0].weapon, 290, 107);
				text(characters[0].armor, 290, 132);
				text(characters[1].weapon, 290, 177);
				text(characters[1].armor, 290, 202);
				text(characters[2].weapon, 290, 247);
				text(characters[2].armor, 290, 272);
				text(characters[3].weapon, 290, 322);
				text(characters[3].armor, 290, 347);
            }
        };

        draw = function () {
            drawScreen();
        };

    }
};
