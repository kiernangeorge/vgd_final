var sketchProc = function (processingInstance) {
    with (processingInstance) {
        size(400, 400);
        frameRate(60);

        //Document for Final Project Milestone 2
        /*
        I made substantial changes to the project for this milestone.
        FSM: the basic idea is the same. There is a title screen, instructions, options, inventory screen, naming screen, and 2 environment screens. These are navigated with key presses and mouse clicks.
        Key Mapping: this was pretty easy to implement. I have an array containing positions specified to hold interactive keys, like movement, inventory, and select. The user can change these in the options screen.
        Options: The sound can be turned on/off which is represented by a global control variable. The difficulty is a global that will be used in combat for hit chance calculation and so forth, not implemented yet. The key mappings are the only other option.
        Title Animation: A particle system was implemented with the map and noise function to create a realistic sky system, day-night cycle, mountains, and hills. The characters are sprites from a free rpg sprite sharing site, references above. The sounds are from the same.
        Naming characters: The player is able to name characters in the first screen after starting the game. They can only enter alphanumeric characters. There are default names if they choose not to name them. These are implemented in an object oriented perspective.
        Worlds: The player can navigate through 2 screens, a town, and a wild area. These tiles use the tilemap system shown in class. The letters represent a tile which is imported pixel art. The player moves with their mapped keys and collision detection is implemented.
        Inventory: The inventory currently displays the 4 characters, their health and mana, their weapons and armor, and the amount of gold the player has accumulated.
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
        var equipmentScreen = 0;
        var itemScreen = 0;
        var equipmentShopScreen = 0;
        var itemShopScreen = 0;
        var battleScreen = 0;
        var returnFromInventory = -1;

        //animation globals for start screen npc's
        var animateKnight = 0;
        var animateMage = 0;
        var animateRogue = 0;
        var animateMonk = 0;
        var knightY = 340;
        var mageY = 340;
        var rogueY = 340;
        var monkY = 353;

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

        var enemies = [];

        var wild1Enemies = [];

        var villagers = [];

        var joints = [];

        //array to hold equipment of group
        var equipment = [];
        //arrow for equipment selection
        var equipmentIndex = 0;

        var items = [];
        var itemIndex = 0;

        var equipmentForSale = [];
        var equipmentShopIndex = 0;

        var itemsForSale = [];
        var itemShopIndex = 0;

        var buyYes = 0;
        var buyNo = 0;

        var equipIndex = -1;

        //player, used when moving out of battle
        var cam;

        var clickedOnNPC = 0;

        //character sprites
        monk = loadImage("sprites/characters/monk.png");
        mage = loadImage("sprites/characters/mage.png");
        knight = loadImage("sprites/characters/knight.png");
        rogue = loadImage("sprites/characters/rogue.png");
        big_orc = loadImage("sprites/characters/big_orc.png");
        orc = loadImage("sprites/characters/orc.png");

        //villager sprites
        blacksmith = loadImage("sprites/village/blacksmith.png");
        apothecary = loadImage("sprites/village/apothecary.png");
        kid = loadImage("sprites/village/kid.png");
        horse = loadImage("sprites/village/horse.png");

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
        bridge = loadImage("sprites/tiles/bridge.png");
        tree = loadImage("sprites/tiles/tree.png");

        //sounds
        spell = new Audio("sounds/spell.wav");
        sword = new Audio("sounds/sword.wav");
        punch = new Audio("sounds/punch.wav");
        knife = new Audio("sounds/knife1.wav");
        small_orc = new Audio("sounds/small_orc.wav");
        large_orc = new Audio("sounds/big_orc.wav");
        select_sound = new Audio("sounds/select.wav");
        door_sound = new Audio("sounds/door.wav");

        //town tilemap array
        var town = [];

        //first wild tilemap array
        var wild1 = [];

        var floor = function (x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
        };

        var jointObj = function (x, y) {
            this.x = x;
            this.y = y;
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
            } else if (this.type === "bridge") {
                image(bridge, this.x, this.y, 20, 20);
            } else if (this.type === "tree") {
                image(tree, this.x, this.y, 20, 20);
            } else if (this.type === "tall_grass") {
                image(tall_grass, this.x, this.y, 20, 20);
            }
        };

        //w = wall, s = short grass, t = tall grass, f = flower, d = door, b = water, h = house wall
        //y = house floor, p = path, z = fence side, x = fence top, n = bridge, m = tree
        var townTilemap = [
            "wwwwwwwwwwwwwwwwwwww",
            "wssssssssssssssssssw",
            "wssssssssssxzzzzzzxw",
            "wssshhhhhhhxssssffxw",
            "wssshyyyyyhxsfssssxw",
            "wssshyyyyyhxzzzzzzxw",
            "wssshhhyhchssssssssw",
            "wsssssspsssssssssssw",
            "wsssssspppsssssssssw",
            "wsssssssspsssssssssw",
            "wsssssssspsssssssssw",
            "wsssssssspsswwwwwssw",
            "wsssssssspsswbbbwssw",
            "whhhhhssspsswbbbwssw",
            "whyyyhssspsswwwwwssw",
            "whyyypppppsssspfsssw",
            "whyyyhsssppppppssssw",
            "whhahhfsspfssssssssw",
            "wsssssssspsssssssssw",
            "wwwwwwwwwpwwwwwwwwww"];

        var wild1Tilemap = [
            "wwwwwwwwwpwwwwwwwwww",
            "xffffxssspsssssssssw",
            "xffffxsssppppppppppp",
            "xzzzzxssspsssssssssw",
            "ssppppppppsssssssssw",
            "ssssssssspsssssssssw",
            "sssstsssspsssssssmsm",
            "ssssssssspsssssssbbb",
            "stsssssssppppppssbtt",
            "sssssfbbbssssspssbss",
            "sstsssbbbbbbbbnbbbss",
            "sssssfbbbssssmpmssss",
            "sssssssssssssmpmssss",
            "stsssssssssssmpmssss",
            "sssssssssssssspsssss",
            "ssssmsmsmsmsmspsmsms",
            "sssspppppppppppppppp",
            "mffsmsmsmsmsmsssmsms",
            "bbfssssssssssstsssss",
            "bbfssssssttsssstssss"];

        var wild1Joints = [
            "wwwwwwwwwpwwwwwwwwww",
            "xffffxsssjsssssjsssw",
            "xfjffxsssjppppppjppp",
            "xzszzxsssjsssssssssw",
            "ssjppppppjsssjsssssw",
            "ssssssssspssssssjjsw",
            "ssjstsjsspssjsssjmsm",
            "ssssssssspsssssssbbb",
            "stssjjsssjppppjssbtt",
            "sssssfbbbssssspsjbss",
            "sstsssbbbbbbbbnbbbss",
            "sssssfbbbssssmpmssjs",
            "ssssjjssssjssmpmssss",
            "stsssssssssssmpmssss",
            "ssjssssjssjsssjssssj",
            "ssssmsmsmsmsmspsmsms",
            "sssjpppjppppppjppppp",
            "mffsmsmsmsmsmsjsmsmj",
            "bbfsssssjsssssjsssss",
            "bbfssssssttsssjtssss"];

        var initWild1Joints = function () {
            for (var row = 0; row < wild1Joints.length; row++) {
                for (var col = 0; col < wild1Joints[row].length; col++) {
                    switch (wild1Joints[row][col]) {
                    case 'j':
                        joints.push(new jointObj(col, row));
                        break;
                    default:
                        break;
                    }
                }
            }
        };
        initWild1Joints();

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
                    case 'n':
                        tiles.push(new floor(col * 20, row * 20, "bridge"));
                        break;
                    case 'm':
                        tiles.push(new floor(col * 20, row * 20, "short_grass"));
                        tiles.push(new floor(col * 20, row * 20, "tree"));
                        break;
                    case 't':
                        tiles.push(new floor(col * 20, row * 20, "tall_grass"));
                        break;
                    case 'j':
                        dots.push(new dotObj(col, row));
                        break;
                    default:
                        break;
                    }
                }
            }
        };

        var checkCollisions = function (row, col, tilemap) {
            if (tilemap[col][row] === 'w' || tilemap[col][row] === 'b' || tilemap[col][row] === 'h' || tilemap[col][row] === 'z' || tilemap[col][row] === 'x' || tilemap[col][row] === 'm' || tilemap[col][row] === 'a' || tilemap[col][row] === 'c') {
                return 1;
            }
            for (var index = 0; index < villagers.length; index++) {
                if (cam.x / 20 === villagers[index].x && cam.y / 20 === villagers[index].y) {
                    return 1;
                }
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

        var enemyNpc = function (type, x, y) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.alive = 1;
            this.speed = 1;
            this.direction = 1;
        };

        enemyNpc.prototype.atJoint = function () {
            var j = 0;
            for (var i = 0; i < joints.length; i++) {
                if ((this.x === joints[i].x) && (this.y === joints[i].y)) {
                    j = 1;
                }
            }

            return j;
        };
        enemyNpc.prototype.collide = function (tilemap) {
            if (this.x > 19 || this.x < 0 || this.y > 19 || this.y < 0) {
                return 1;
            }
            if (tilemap[this.y][this.x] === 'w' || tilemap[this.y][this.x] === 'b' || tilemap[this.y][this.x] === 'h' || tilemap[this.y][this.x] === 'z' || tilemap[this.y][this.x] === 'x' || tilemap[this.y][this.x] === 'm') {

                return 1;
            }
            return 0;
        };

        enemyNpc.prototype.move = function () {
            if (frameCount % 30 === 0) {
                if ((this.atJoint() === 1) && (random(0, 10) < 5)) {
                    this.direction = Math.floor(random(1, 5));
                }
                switch (this.direction) {
                case 1: //right
                    this.x += this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.x -= this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                case 2: //left
                    this.x -= this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.x += this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                case 3: //down
                    this.y += this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.y -= this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                case 4: //up
                    this.y -= this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.y += this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                }
            }
        };

        var moveWild1Enemies = function () {
            for (var index = 0; index < wild1Enemies.length; index++) {
                if (wild1Enemies[index].alive === 1) {
                    wild1Enemies[index].move();
                }
            }
        };

        wild1Enemies.push(new enemyNpc("Orc", 2, 14));
        wild1Enemies.push(new enemyNpc("Orc", 13, 6));

        var camera = function () {
            this.x = 180;
            this.y = 200;
            this.inRange = 0;
            this.talking = -1;
        };

        camera.prototype.draw = function () {
            image(knight, this.x, this.y, 20, 20);
        };

        cam = new camera();

        var villager = function (x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.direction = Math.floor(random(1, 5));
            this.speed = 1;
        };

        villager.prototype.collide = function () {
            if (townTilemap[this.y][this.x] === 'w' || townTilemap[this.y][this.x] === 'b' || townTilemap[this.y][this.x] === 'h' || townTilemap[this.y][this.x] === 'z' || townTilemap[this.y][this.x] === 'x' || townTilemap[this.y][this.x] === 'm' || townTilemap[this.y][this.x] === 'a' || townTilemap[this.y][this.x] === 'c') {
                return 1;
            }
            if (cam.x / 20 === this.x && cam.y / 20 === this.y) {
                return 1;
            }
            return 0;
        };

        villager.prototype.move = function () {
            if (frameCount % 60 === 0) {
                switch (this.direction) {
                case 1: //right
                    this.x += this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.x -= this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                case 2: //left
                    this.x -= this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.x += this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                case 3: //down
                    this.y += this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.y -= this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                case 4: //up
                    this.y -= this.speed;
                    if (this.collide(wild1Tilemap) === 1) {
                        this.y += this.speed;
                        this.direction = Math.floor(random(1, 5));
                    }
                    break;
                }
            }
        };

        villager.prototype.draw = function () {
            if (this.type === "blacksmith") {

                image(blacksmith, this.x * 20, this.y * 20, 20, 20);
            } else if (this.type === "apothecary") {
                image(apothecary, this.x * 20, this.y * 20, 20, 20);
            } else if (this.type === "kid") {
                image(kid, this.x * 20, this.y * 20, 20, 20);
            } else if (this.type === "horse") {
                image(horse, this.x * 20, this.y * 20 - 5, 30, 30);
            }
        };

        villagers.push(new villager(3, 16, "blacksmith"));
        villagers.push(new villager(6, 5, "apothecary"));
        villagers.push(new villager(14, 16, "kid"));
        villagers.push(new villager(15, 3, "horse"));

        var drawVillagers = function () {
            for (var index = 0; index < villagers.length; index++) {
                villagers[index].draw();
                villagers[index].move();
            }
        };

        var equipmentObj = function (name, classType, type, damage, equip) {
            this.name = name;
            this.classType = classType;
            this.type = type;
            this.damage = damage;
            this.equip = equip;
        };

        var item = function (name, quantity, description, price) {
            this.name = name;
            this.quantity = quantity;
            this.description = description;
            this.price = price || -1;
        };

        items.push(new item("Health Potion", 4, "Restores 40 points of health."));
        items.push(new item("Mana Potion", 2, "Restores 25 points of mana."));

        equipment.push(new equipmentObj("Rusty Sword", "Knight", "Weapon", 10, "Knight"));
        equipment.push(new equipmentObj("Chipped Mail", "Knight", "Armor", 10, "Knight"));
        equipment.push(new equipmentObj("Basic Staff", "Mage", "Weapon", 8, "Mage"));
        equipment.push(new equipmentObj("Novice Robes", "Mage", "Armor", 4, "Mage"));
        equipment.push(new equipmentObj("Dagger", "Rogue", "Weapon", 6, "Rogue"));
        equipment.push(new equipmentObj("Leather Armor", "Rogue", "Armor", 6, "Rogue"));
        equipment.push(new equipmentObj("Fists", "Monk", "Weapon", 8, "Monk"));
        equipment.push(new equipmentObj("Basic Gi", "Monk", "Armor", 12, "Monk"));

        characters.push(new character(100, -1, "Rusty Sword", "Tarnished Mail")); //knight
        characters.push(new character(100, 50, "Basic Staff", "Novice Robes")); //mage
        characters.push(new character(100, -1, "Dagger", "Leather Armor")); //rogue
        characters.push(new character(100, 30, "Fists", "Basic Gi")); //monk

        equipmentForSale.push(new equipmentObj("Lava Sword", "Knight", "Weapon", 17, 100));
        equipmentForSale.push(new equipmentObj("Brass Knuckles", "Monk", "Weapon", 14, 40));
        equipmentForSale.push(new equipmentObj("Master Robes", "Mage", "Armor", 16, 80));

        itemsForSale.push(new item("Health Potion", 6, "Restores 40 health", 7));
        itemsForSale.push(new item("Mana Potion", 4, "Restores 25 mana", 4));
        itemsForSale.push(new item("Feather of Phoenix", 2, "Revive a fallen member", 15));
        itemsForSale.push(new item("Smoke Bomb", 4, "Escape from battle", 7));

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
                        if (sound === 1) {
                            select_sound.play();
                        }
                        startScreen = 0;
                        nameScreen = 1;
                    } else if (startMenuSelect === 1) {
                        if (sound === 1) {
                            select_sound.play();
                        }
                        startScreen = 0;
                        instructionsScreen = 1;
                    } else if (startMenuSelect === 2) {
                        if (sound === 1) {
                            select_sound.play();
                        }
                        startScreen = 0;
                        optionsScreen = 1;
                    }
                }
            }
        };

        var mouseClicked = function () {
            if (startScreen === 1) {
                if (mouseX > 60 && mouseX < 100 && mouseY > 340 && mouseY < 390) {
                    if (animateMage === 0) {
                        animateMage = -1;
                        if (sound === 1) {
                            spell.play();
                        }
                        clickedOnNPC = 1;
                    }
                } else if (mouseX > 10 && mouseX < 50 && mouseY > 340 && mouseY < 390) {
                    if (animateKnight === 0) {
                        animateKnight = -1;
                        if (sound === 1) {
                            sword.play();
                        }
                        clickedOnNPC = 1;
                    }
                } else if (mouseX > 158 && mouseX < 198 && mouseY > 353 && mouseY < 393) {
                    if (animateMonk === 0) {
                        animateMonk = -1;
                        if (sound === 1) {
                            punch.play();
                        }
                        clickedOnNPC = 1;
                    }
                } else if (mouseX > 110 && mouseX < 160 && mouseY > 340 && mouseY < 390) {
                    if (animateRogue === 0) {
                        animateRogue = -1;
                        if (sound === 1) {
                            sword.play();
                        }
                        clickedOnNPC = 1;
                    }
                } else if (mouseX > 250 && mouseX < 290 && mouseY > 350 && mouseY < 390) {
                    small_orc.play();
                    clickedOnNPC = 1;
                } else if (mouseX > 290 && mouseX < 360 && mouseY > 320 && mouseY < 390) {
                    large_orc.play();
                    clickedOnNPC = 1;
                } else if (mouseX > 350 && mouseX < 390 && mouseY > 350 && mouseY < 390) {
                    small_orc.play();
                    clickedOnNPC = 1;
                }
            } else if (optionsScreen === 1) {
                if (remapKey() === 0) {
                    if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 50) {
                        if (sound === 1) {
                            select_sound.play();
                        }
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
                    if (sound === 1) {
                        select_sound.play();
                    }
                    instructionsScreen = 0;
                    startScreen = 1;
                }
            } else if (nameScreen === 1) {
                if (rename === -1) {
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
                        if (sound === 1) {
                            select_sound.play();
                        }
                        setDefaultNamesIfNecessary();
                        nameScreen = 0;
                        townScreen = 1;
                    }
                }
            } else if (inventoryScreen === 1) {
                if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 50) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    inventoryScreen = 0;
                    if (returnFromInventory === 0) {
                        townScreen = 1;
                        returnFromInventory = -1;
                    } else if (returnFromInventory === 1) {
                        wild1Screen = 1;
                        returnFromInventory = -1;
                    }
                } else if (mouseX > 280 && mouseY > 360) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    inventoryScreen = 0;
                    equipmentScreen = 1;
                } else if (mouseX < 100 && mouseY > 360) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    inventoryScreen = 0;
                    itemScreen = 1;
                }
            } else if (equipmentScreen === 1) {
                if (mouseX < 100 && mouseY < 50) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    inventoryScreen = 1;
                    equipmentScreen = 0;
                    equipIndex = -1;
                }
            } else if (itemScreen === 1) {
                if (mouseX < 100 && mouseY < 50) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    inventoryScreen = 1;
                    itemScreen = 0;
                }
            } else if (equipmentShopScreen === 1) {
                if (mouseX < 100 && mouseY < 50) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    buyYes = 0;
                    buyNo = 0;
                    equipmentShopScreen = 0;
                    townScreen = 1;
                }
            } else if (itemShopScreen === 1) {
                if (mouseX < 100 && mouseY < 50) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    buyYes = 0;
                    buyNo = 0;
                    itemShopScreen = 0;
                    townScreen = 1;
                }
            }
        };

        var battleEnemy = function (type, health) {
            this.type = type;
            this.health = health;
        };

        var battleEnemies = [];
        var turns = [];
        var battleOptionIndex = 0;
        var turnIndex = 0;
        var battleItemIndex = -1;
        var attackIndex = -1;

        var addBattleEnemies = function () {
            battleEnemies = [];
            turns.push(characters[0].name);
            turns.push(characters[1].name);
            turns.push(characters[2].name);
            turns.push(characters[3].name);
			battleOptionIndex = 0;
            turnIndex = 0;
			battleItemIndex = -1;
			attackIndex = -1;
            if (battleScreen == 1) {
                battleEnemies.push(new battleEnemy("orc", 60));
                battleEnemies.push(new battleEnemy("orc", 60));
                turns.push("Orc 1");
                turns.push("Orc 2");
            }
        };

        var drawBattleCharacters = function () {
            textFont(createFont("fantasy"), 11);
            if (characters[0].health > 0) {
                fill(255, 255, 255);
                text("Health: " + characters[0].health + "/100", 140, 220);
                image(knight, 175, 200, 30, 30);
            }
            if (characters[1].health > 0) {
                text("Health: " + characters[1].health + "/100", 140, 250);
                text("Mana: " + characters[1].mana + "/50", 135, 265);
                image(mage, 175, 235, 30, 35);
            }
            if (characters[2].health > 0) {
                text("Health: " + characters[2].health + "/100", 140, 290);
                image(rogue, 175, 265, 30, 35);
            }
            if (characters[3].health > 0) {
                text("Health: " + characters[3].health + "/100", 140, 315);
                text("Mana: " + characters[1].mana + "/50", 140, 330);
                image(monk, 175, 305, 30, 30);
            }
        };

        var drawBattleOptions = function () {
            textFont(createFont("fantasy"), 15);
			fill(255, 255, 255);
			text("Turn: " + turns[turnIndex], 40, 220);
			if(turnIndex > 3)
			{
				if((turnIndex === 4 && battleEnemies[0].health > 0) ||(turnIndex === 5 && battleEnemies[1].health > 0))
				{
				attackIndex = -1;
				battleItemIndex = -1;
				fill(0);
				text("Orc attacking!", 200, 200);
				var attack = Math.floor(random(0, 4));
				characters[attack].health -= 15;
				}
				turnIndex++;
				if(turnIndex === 6)
				{
					turnIndex = 0;
				}
			}
            if (attackIndex > -1) {
				fill(255, 255, 255);
				text("Back", 305, 340);
				if(attackIndex === 0)
				{
					triangle(265, 240, 273, 245, 265, 250);
				}				
				else if(attackIndex === 1)
				{
					triangle(265, 290, 273, 295, 265, 300);
				}
				else if(attackIndex === 2)
				{
					triangle(265, 335, 273, 340, 265, 345);
				}
			}
            else if (battleItemIndex > -1) {

			}
            else {
				fill(255, 255, 255);
                text("Attack", 60, 250);
                text("Item", 60, 280);
                text("Run", 60, 310);
                if (battleOptionIndex == 0) {
                    triangle(30, 245, 38, 250, 30, 255);
                } else if (battleOptionIndex == 1) {
                    triangle(30, 275, 38, 280, 30, 285);
                } else if (battleOptionIndex == 2) {
                    triangle(30, 305, 38, 310, 30, 315);
                }
            }
        };

        var drawBattleEnemies = function () {
            height = 220
                for (var index = 0; index < battleEnemies.length; index++) {
                    if (battleEnemies[index].type == "orc") {
                        image(orc, 280, height, 40, 40);
                        text("Health: " + battleEnemies[index].health + "/60", 355, height + 25);
                        height += 50;
                    }
                }
        };

        var updateFocus = function (map) {
            if (keyArray[keyMap[0]] === 1) {
                if (cam.y === 0 && cam.x === 180 && wild1Screen === 1) {
                    if (sound === 1) {
                        door_sound.play();
                    }
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
                    if (sound === 1) {
                        door_sound.play();
                    }
                    townScreen = 0;
                    wild1Screen = 1;
                    cam.y = 0;
                    for (var index = 0; index < wild1Enemies; index++) {
                        wild1Enemies[index].alive = 1;
                    }
                    wild1Enemies[0].x = 2;
                    wild1Enemies[0].y = 14;
                    wild1Enemies[1].x = 13;
                    wild1Enemies[1].y = 6;
					wild1Enemies[0].alive = 1;
					wild1Enemies[1].alive = 1;

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
            } else if (keyArray[keyMap[4]] === 1 && cam.inRange > 0) {
                if (cam.inRange === 1) {
                    townScreen = 0;
                    equipmentShopScreen = 1;
                } else if (cam.inRange === 2) {
                    townScreen = 0;
                    itemShopScreen = 1;
                }
                keyArray[keyMap[4]] = 0;
            } else if (keyArray[keyMap[5]] === 1) {
                if (townScreen === 1) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    townScreen = 0;
                    inventoryScreen = 1;
                    returnFromInventory = 0;
                } else if (wild1Screen === 1) {
                    if (sound === 1) {
                        select_sound.play();
                    }
                    wild1Screen = 0;
                    inventoryScreen = 1;
                    returnFromInventory = 1;
                }
            }

        }

        var animateTitleNPC = function () {
            if (animateKnight === 1 || animateKnight === -1) {
                knightY += animateKnight;
                if (knightY === 280) {
                    animateKnight = 1;
                } else if (knightY === 340) {
                    animateKnight = 0;
                }
            }
            if (animateMage === 1 || animateMage === -1) {
                mageY += animateMage;
                if (mageY === 280) {
                    animateMage = 1;
                } else if (mageY === 340) {
                    animateMage = 0;
                }
            }
            if (animateRogue === 1 || animateRogue === -1) {
                rogueY += animateRogue;
                if (rogueY === 280) {
                    animateRogue = 1;
                } else if (rogueY === 340) {
                    animateRogue = 0;
                }
            }
            if (animateMonk === 1 || animateMonk === -1) {
                monkY += animateMonk;
                if (monkY === 293) {
                    animateMonk = 1;
                } else if (monkY === 353) {
                    animateMonk = 0;
                }
            }
        };
		var inAFight = 0;
        var updateCursor = function () {
            if (equipmentScreen === 1) {
                if (keyArray[keyMap[1]] === 1) {
                    if (equipIndex > -1) {
                        equipIndex = 1;
                    } else {
                        if (equipmentIndex < equipment.length - 1) {
                            equipmentIndex++;
                        }
                    }
                    keyArray[keyMap[1]] = 0;
                } else if (keyArray[keyMap[0]] === 1) {
                    if (equipIndex > -1) {
                        equipIndex = 0;
                    } else {
                        if (equipmentIndex > 0) {
                            equipmentIndex--;
                        }
                    }
                    keyArray[keyMap[0]] = 0;
                } else if (keyArray[keyMap[4]] === 1) {
                    if (equipIndex === -1 && equipment[equipmentIndex].equip === "") {
                        equipIndex = 0;
                    } else if (equipIndex === 0) {
                        var unequipItemName = "";
                        var temp = equipment[equipmentIndex];
                        if (temp.classType === "Knight") {
                            temp.equip = "Knight";
                            if (temp.type === "Weapon") {
                                unequipItemName = characters[0].weapon;
                                characters[0].weapon = temp.name;
                            } else if (temp.type === "Armor") {
                                unequipItemName = characters[0].armor;
                                characters[0].armor = temp.name;
                            }
                        } else if (temp.classType === "Mage") {
                            temp.equip = "Mage";
                            if (temp.type === "Weapon") {
                                unequipItemName = characters[1].weapon;
                                characters[1].weapon = temp.name;
                            } else if (temp.type === "Armor") {
                                unequipItemName = characters[1].armor;
                                characters[1].armor = temp.name;
                            }
                        } else if (temp.classType === "Rogue") {
                            temp.equip = "Rogue";
                            if (temp.type === "Weapon") {
                                unequipItemName = characters[2].weapon;
                                characters[2].weapon = temp.name;
                            } else if (temp.type === "Armor") {
                                unequipItemName = characters[2].armor;
                                characters[2].armor = temp.name;
                            }
                        } else if (temp.classType === "Monk") {
                            temp.equip = "Monk";
                            if (temp.type === "Weapon") {
                                unequipItemName = characters[3].weapon;
                                characters[3].weapon = temp.name;
                            } else if (temp.type === "Armor") {
                                unequipItemName = characters[3].armor;
                                characters[3].armor = temp.name;
                            }
                        }
                        for (var index = 0; index < equipment.length; index++) {
                            if (unequipItemName === equipment[index].name) {
                                equipment[index].equip = "";
                            }
                        }
                        equipIndex = -1;
                    } else if (equipIndex === 1) {
                        equipIndex = -1;
                    }
                    keyArray[keyMap[4]] = 0;
                }
            } else if (itemScreen === 1) {
                if (keyArray[keyMap[1]] === 1) {
                    if (itemIndex < items.length - 1) {
                        itemIndex++;
                    }
                    keyArray[keyMap[1]] = 0;
                } else if (keyArray[keyMap[0]] === 1) {
                    if (itemIndex > 0) {
                        itemIndex--;
                    }
                    keyArray[keyMap[0]] = 0;
                }
            } else if (equipmentShopScreen === 1) {
                if (keyArray[keyMap[1]] === 1) {
                    if (buyNo === 1) {}
                    else if (buyYes === 1) {
                        buyYes = 0;
                        buyNo = 1;
                    } else {
                        if (equipmentShopIndex < equipmentForSale.length - 1) {
                            equipmentShopIndex++;
                        }
                    }
                    keyArray[keyMap[1]] = 0;
                } else if (keyArray[keyMap[0]] === 1) {
                    if (buyNo === 1) {
                        buyYes = 1;
                        buyNo = 0;
                    } else if (buyYes === 1) {}
                    else {
                        if (equipmentShopIndex > 0) {
                            equipmentShopIndex--;
                        }
                    }
                    keyArray[keyMap[0]] = 0;
                } else if (keyArray[keyMap[4]] === 1) {
                    keyArray[keyMap[4]] = 0;
                    if (buyNo === 1) {
                        buyNo = 0;
                    } else if (buyYes === 1) {
                        if (equipmentForSale[equipmentShopIndex].equip < characters[0].coin) {
                            var temp = equipmentForSale[equipmentShopIndex];
                            characters[0].coin -= temp.equip;
                            temp.equip = "";
                            equipment.push(temp);
                            equipmentForSale.splice(equipmentShopIndex, 1);
                            buyYes = 0;
                        }
                    } else {
                        buyYes = 1;
                    }
                }
            } else if (itemShopScreen === 1) {
                if (keyArray[keyMap[1]] === 1) {
                    if (buyNo === 1) {}
                    else if (buyYes === 1) {
                        buyYes = 0;
                        buyNo = 1;
                    } else {
                        if (itemShopIndex < itemsForSale.length - 1) {
                            itemShopIndex++;
                        }
                    }
                    keyArray[keyMap[1]] = 0;
                } else if (keyArray[keyMap[0]] === 1) {
                    if (buyNo === 1) {
                        buyYes = 1;
                        buyNo = 0;
                    } else if (buyYes === 1) {}
                    else {
                        if (itemShopIndex > 0) {
                            itemShopIndex--;
                        }
                    }
                    keyArray[keyMap[0]] = 0;
                } else if (keyArray[keyMap[4]] === 1) {
                    keyArray[keyMap[4]] = 0;
                    if (buyNo === 1) {
                        buyNo = 0;
                    } else if (buyYes === 1) {
                        if (itemsForSale[itemShopIndex].price < characters[0].coin) {
                            var exists = 0;
                            var temp = itemsForSale[itemShopIndex];
                            for (var index = 0; index < items.length; index++) {
                                if (items[index].name === temp.name) {
                                    items[index].quantity++;
                                    exists = 1;
                                }
                            }
                            if (exists === 0) {
                                items.push(temp);
                            }
                            itemsForSale[itemShopIndex].quantity--;
                            characters[0].coin -= temp.price;
                            if (itemsForSale[itemShopIndex].quantity === 0) {
                                itemsForSale.splice(itemShopIndex, 1);
                                buyYes = 0;
                            }
                        }
                    } else {
                        buyYes = 1;
                    }
                }
            } else if (battleScreen > 0) {
                if (keyArray[keyMap[1]] === 1) {
					if(attackIndex > -1)
					{
						if(attackIndex < 2)
						{
							if(battleEnemies.length === 1)
							{
								attackIndex += 2;
							}
							else
							{
								attackIndex++;
							}
						}
					}
					else if(battleItemIndex > -1)
					{
					}
					else
					{
                    if (battleOptionIndex < 2) {
                        battleOptionIndex++;
                    }
					}
                    keyArray[keyMap[1]] = 0;
                } else if (keyArray[keyMap[0]] === 1) {
					if(attackIndex > -1)
					{
						if(attackIndex > 0)
						{
							if(battleEnemies.length === 1)
							{
								attackIndex -= 2;
							}
							else
							{
								attackIndex--;
							}
						}
					}
					else if(battleItemIndex > -1)
					{
					}
					else
					{
                    if (battleOptionIndex > 0) {
                        battleOptionIndex--;
                    }
					}
                    keyArray[keyMap[0]] = 0;
                } else if (keyArray[keyMap[4]] === 1) {
					if(attackIndex > -1)
					{
						if(attackIndex === 2)
						{
							attackIndex = -1;
						}
						else
						{
							var damage = 0;
							var weaponName = characters[turnIndex].weapon;
							for(var index = 0; index < equipment.length; index++)
							{
								if(equipment[index].name == weaponName)
								{
									damage = equipment[index].damage;
								}
							}
							battleEnemies[attackIndex].health -= damage;
							if(battleEnemies[attackIndex].health < 0)
							{
								battleEnemies[attackIndex].health = 0;
							}
							if(battleEnemies[0].health === 0 && battleEnemies[1].health === 0)
							{
								if(battleScreen === 1)
								{
									characters[0].coin += 25;
								}
								if(inAFight === 0)
								{
									
									wild1Enemies[0].alive = 0;
								}
								else
								{
									wild1Enemies[1].alive = 0;
								}
								battleScreen = 0;
								wild1Screen += 1;
							}
							attackIndex = -1;
							battleItemIndex = -1;
							turnIndex++;
						}
					}
					else
					{
                    if (battleOptionIndex === 2) {
                        if (random(0, 11) > 5) {
                            cam.x = 180;
                            cam.y = 0;
                            battleScreen = 0;
                            wild1Screen = 1;
                        }
                        turnIndex++;
                    }
                     else if (battleOptionIndex === 0) {
                        attackIndex = 0;
                    }
					}
                    keyArray[keyMap[4]] = 0;
                }
            }
        };

        var drawEnemyNpcs = function () {
            for (var index = 0; index < wild1Enemies.length; index++) {
                if (wild1Enemies[index].alive === 1) {
                    image(orc, wild1Enemies[index].x * 20, wild1Enemies[index].y * 20, 20, 20);
                }
            }
        };

        var promptDialogue = function () {
            textFont(createFont("fantasy"), 15);
            for (var index = 0; index < villagers.length; index++) {
                if (dist(cam.x, cam.y, villagers[index].x * 20, villagers[index].y * 20) < 40) {
                    fill(0);
                    textSize(15);
                    textAlign(CENTER, CENTER);
                    if (index === 0) {
                        text("Hey! Press Select to buy my weapons and armor.", 200, 30);
                        cam.inRange = 1;
                    } else if (index === 1) {
                        text("I can sell you some items if you press Select.", 200, 30);
                        cam.inRange = 2;
                    } else if (index === 2) {
                        text("Stranger Danger!!!", 200, 30);
                        cam.inRange = 0;
                    }
                    return;
                }
            }
            cam.inRange = 0;
        };

        var startBattle = function () {
            for (var check = 0; check < wild1Enemies.length; check++) {
                if (wild1Enemies[check].x === cam.x / 20 && wild1Enemies[check].y === cam.y / 20 && wild1Enemies[check].alive === 1) {
					wild1Screen = 0;
					inAFight = check;
                    battleScreen = 1;
                    addBattleEnemies();
					break;
                }
            }
        };

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
                drawMenu();
                textSize(10);
                if (clickedOnNPC === 0) {
                    text("Click on the characters (sound on)", 200, 330);
                }
                image(knight, 10, knightY, 40, 50);
                image(mage, 60, mageY, 40, 50);
                image(rogue, 110, rogueY, 40, 50);
                image(monk, 158, monkY, 40, 40);
                image(orc, 250, 350, 40, 40);
                image(big_orc, 290, 320, 70, 70);
                image(orc, 350, 350, 40, 40);
                updateSelect();
                updateDay();
                animateTitleNPC();
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
                text("While outside of the starting town, there will be", 10, 170);
                text("enemies that will trigger combat when touched.", 10, 200);
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
                drawVillagers();
                updateFocus(townTilemap);
                promptDialogue();
            } else if (wild1Screen === 1) {
                background(0, 0, 0);
                drawTilemap(wild1);
                cam.draw();
                drawEnemyNpcs();
                updateFocus(wild1Tilemap);
                moveWild1Enemies();
                startBattle();
            } else if (inventoryScreen === 1) {
                background(0, 0, 0);
                fill(108, 108, 108);
                rect(0, 0, 100, 50, 30);
                fill(0, 0, 0);
                textFont(createFont("fantasy"), 30);
                textAlign(CENTER, CENTER);
                text("Back", 50, 25);
                fill(255, 255, 255);
                textSize(20);
                text("Equipment->", 340, 380);
                text("<-Items", 35, 380);
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
            } else if (equipmentScreen === 1) {
                background(0, 0, 0);
                textFont(createFont("fantasy"), 30);
                fill(108, 108, 108);
                rect(0, 0, 100, 50, 30);
                fill(0, 0, 0);
                text("Back", 50, 25);
                fill(255, 255, 255);
                text("Equipment", 200, 20);
                textSize(15);
                textAlign(LEFT, LEFT);
                text("Name", 30, 70);
                text("Class", 120, 70);
                text("Type", 195, 70);
                text("Rating", 275, 70);
                text("In Use", 345, 70);
                stroke(255, 255, 255);
                line(5, 80, 395, 80);
                noStroke();
                var height = 100;
                for (var index = 0; index < equipment.length; index++) {
                    text(equipment[index].name, 15, height);
                    text(equipment[index].classType, 120, height);
                    text(equipment[index].type, 190, height);
                    text(equipment[index].damage, 285, height);
                    text(equipment[index].equip, 345, height);
                    height += 30;
                }
                fill(255, 255, 255);
                triangle(2, 90 + (equipmentIndex * 30), 10, 95 + (equipmentIndex * 30), 2, 100 + (equipmentIndex * 30));
                updateCursor();
                if (equipIndex > -1) {
                    fill(255, 255, 255);
                    rect(150, 150, 100, 100);
                    fill(0);
                    textSize(20);
                    textAlign(CENTER, CENTER);
                    text("Equip", 200, 170);
                    text("Yes", 200, 200);
                    text("No", 200, 230);
                    if (equipIndex === 0) {
                        triangle(170, 195, 178, 200, 170, 205);
                    } else {
                        triangle(170, 225, 178, 230, 170, 235);
                    }
                }
            } else if (itemScreen === 1) {
                background(0, 0, 0);
                textFont(createFont("fantasy"), 30);
                fill(108, 108, 108);
                rect(0, 0, 100, 50, 30);
                fill(0, 0, 0);
                text("Back", 50, 25);
                fill(255, 255, 255);
                text("Items", 200, 20);
                textSize(20);
                textAlign(LEFT, LEFT);
                text("Name", 20, 70);
                text("Quantity", 100, 70);
                text("Description", 235, 70);
                stroke(255, 255, 255);
                line(5, 80, 395, 80);
                noStroke();
                textSize(15);
                var height = 100;
                for (var index = 0; index < items.length; index++) {
                    text(items[index].name, 10, height);
                    text(items[index].quantity, 130, height);
                    text(items[index].description, 200, height);
                    height += 30;
                }
                triangle(2, 90 + (itemIndex * 30), 10, 95 + (itemIndex * 30), 2, 100 + (itemIndex * 30));
                updateCursor();
            } else if (equipmentShopScreen === 1) {
                background(0);
                textFont(createFont("fantasy"), 30);
                fill(108, 108, 108);
                rect(0, 0, 100, 50, 30);
                fill(0, 0, 0);
                text("Back", 50, 25);
                fill(255, 255, 255);
                text("Mr T's Smithery", 210, 25);
                image(coin, 330, 5, 30, 30);
                textSize(20);
                text(characters[0].coin, 375, 25);
                textSize(15);
                textAlign(LEFT, LEFT);
                text("Name", 30, 70);
                text("Class", 120, 70);
                text("Type", 195, 70);
                text("Rating", 275, 70);
                text("Price", 345, 70);
                stroke(255, 255, 255);
                line(5, 80, 395, 80);
                noStroke();
                var height = 100;
                for (var index = 0; index < equipmentForSale.length; index++) {
                    text(equipmentForSale[index].name, 15, height);
                    text(equipmentForSale[index].classType, 120, height);
                    text(equipmentForSale[index].type, 190, height);
                    text(equipmentForSale[index].damage, 285, height);
                    text(equipmentForSale[index].equip, 345, height);
                    height += 30;
                }
                triangle(2, 90 + (equipmentShopIndex * 30), 10, 95 + (equipmentShopIndex * 30), 2, 100 + (equipmentShopIndex * 30));
                updateCursor();
                if (buyYes === 1) {
                    text("Buy: Yes", 200, 350);
                    text("No", 230, 370);
                    fill(255, 0, 0);
                    triangle(190, 340, 198, 345, 190, 350);
                } else if (buyNo === 1) {
                    text("Buy: Yes", 200, 350);
                    text("No", 230, 370);
                    fill(255, 0, 0);
                    triangle(190, 360, 198, 365, 190, 370);
                }
            } else if (itemShopScreen === 1) {
                background(0);
                textFont(createFont("fantasy"), 30);
                fill(108, 108, 108);
                rect(0, 0, 100, 50, 30);
                fill(0, 0, 0);
                text("Back", 50, 25);
                fill(255, 255, 255);
                text("Granny Smith's", 220, 25);
                text("Apothecary", 220, 55);
                textSize(18);
                textAlign(LEFT, LEFT);
                image(coin, 330, 5, 30, 30);
                text(characters[0].coin, 365, 30);
                text("Name", 20, 90);
                text("Quantity", 100, 90);
                text("Price", 180, 90);
                text("Description", 265, 90);
                stroke(255, 255, 255);
                line(5, 100, 395, 100);
                noStroke();
                textSize(15);
                var height = 115;
                for (var index = 0; index < itemsForSale.length; index++) {
                    text(itemsForSale[index].name, 10, height);
                    text(itemsForSale[index].quantity, 130, height);
                    text(itemsForSale[index].price, 195, height);
                    text(itemsForSale[index].description, 245, height);
                    height += 30;
                }
                triangle(2, 105 + (itemShopIndex * 30), 10, 110 + (itemShopIndex * 30), 2, 115 + (itemShopIndex * 30));
                updateCursor();
                if (buyYes === 1) {
                    text("Buy: Yes", 200, 350);
                    text("No", 230, 370);
                    fill(255, 0, 0);
                    triangle(190, 340, 198, 345, 190, 350);
                } else if (buyNo === 1) {
                    text("Buy: Yes", 200, 350);
                    text("No", 230, 370);
                    fill(255, 0, 0);
                    triangle(190, 360, 198, 365, 190, 370);
                }
            } else if (battleScreen > 0) {
                background(0);
                drawSky();
				sunX = 300;
                drawSun();
                fill(0, 100, 0);
                rect(0, 180, 400, 220);
                drawBattleCharacters();
                drawBattleEnemies();
                drawBattleOptions();
                updateCursor();
            }
        };

        draw = function () {
            drawScreen();
        };

    }
};
