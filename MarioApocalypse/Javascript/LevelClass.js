var GameObjectData =
{
    PLAYER: 0,

    BULLET_RIGHT: 4,
    BULLET_LEFT: 12,

    BLOODY_WATER_1: 18,
    BLOODY_WATER_2: 19,
    //BLOODY_WATER_3: 20,

    TURTLE_ZOMBIE: 24,
    GROUND_ZOMBIE: 57,

	TUNNEL_TOP_1: 46,
	TUNNEL_TOP_2: 47,

    x: 0,
    y: 0,
    type: -1
};

var TileData =
{
    friction: 2,
    acceleration: 3,
    type: 4
};

var LevelClass =
{
    backgroundLayerName: "BackgroundLayer",
    //foregroundLayerName: "ForegroundLayer",
    objectsLayerName: "ObjectsLayer",

    //tile ids (0 based)
	AIR: 7,
    BRICK: 5,
	BLOODY_BRICK: 6,
	
	PLATFORM_1: 13,
	PLATFORM_2: 14,
	PLATFORM_3: 15,
	PLATFORM_4: 21,
	PLATFORM_5: 22,
	PLATFORM_6: 23,

	GROUND_LEFT_END: 29,
	GROUND: 30,
	GROUND_RIGHT_END: 31,
	
	BLOODY_BLOCK: 37,
	BLOCK: 38,
	
	POWERUP: 45,
	
	TUNNEL_3: 54,
	TUNNEL_4: 55,
	TUNNEL_5: 62,
	TUNNEL_6: 63,
	
    GRAVITY_Y: 800,
    tileSize: 64,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    tilesWide: 0,
    tilesHigh: 0,
    gravity: undefined,

    collisionRects: undefined,
    tiles: undefined,
    //foregroundTiles: undefined,
    gameObjects: undefined,
    tileSheet: undefined,

    init: function (tileSheet, x, y, width, height)
    {
        this.tileSheet = tileSheet;
        this.left = x;
        this.top = y;
        this.right = x + width;
        this.bottom = y + height;
        this.tilesWide = width / this.tileSize;
        this.tilesHigh = height / this.tileSize;
        this.sourceTilesWide = tileSheet.width / this.tileSize;
        this.tiles = new Array();
        //this.foregroundTiles = new Array();
        this.gameObjects = new Array();

        this.gravity = Object.create(VectorClass);
        this.gravity.x = 0;
        this.gravity.y = this.GRAVITY_Y;

        this.loadLevelData(loadXMLDoc("Assets/Levels/leveltest2_long.xml"));
    },

    isTileGameObject: function (gameObject)
    {
        if (gameObject == GameObjectData.TURTLE_ZOMBIE || gameObject == GameObjectData.TUNNEL_TOP_1 ||
            gameObject == GameObjectData.TUNNEL_TOP_2 || gameObject == GameObjectData.PLAYER ||
            gameObject == GameObjectData.BULLET_RIGHT || gameObject == GameObjectData.BULLET_LEFT ||
            gameObject == GameObjectData.BLOODY_WATER_1 || gameObject == GameObjectData.BLOODY_WATER_2 ||
            gameObject == GameObjectData.GROUND_ZOMBIE)
        {
            return true;
        }
        else
        {
            return false;
        }

    },

	isTileCollidable : function(type)
    {
        if(type == this.BRICK || type == this.BLOODY_BRICK || type == this.PLATFORM_1 || type == this.PLATFORM_2 ||
			type == this.PLATFORM_3 || type == this.PLATFORM_4 || type == this.PLATFORM_5 || type == this.PLATFORM_6 ||
			type == this.GROUND_LEFT_END || type == this.GROUND || type == this.GROUND_RIGHT_END || type == this.BLOODY_BLOCK ||
			type == this.BLOCK || type == this.POWERUP || type == this.TUNNEL_TOP_1 || type == this.TUNNEL_TOP_2 ||
			type == this.TUNNEL_3 || type == this.TUNNEL_4 || type == this.TUNNEL_5 || type == this.TUNNEL_6 ||
            type == this.BLOODY_WATER_1 || type == this.BLOODY_WATER_2)
        { 
            return true;
        }
        else 
        {
            return false;
        }
    },

    loadLevelData: function (levelFile)
    {
        var xmlDoc;
        var parser;
        if (window.DOMParser)
        {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(levelFile, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(levelFile);
        }
        var mapNode = xmlDoc.getElementsByTagName("map")[0];
        this.tilesWide = parseInt(mapNode.attributes.getNamedItem("width").value);
        this.tilesHigh = parseInt(mapNode.attributes.getNamedItem("height").value);
        this.tileSize = parseInt(mapNode.attributes.getNamedItem("tilewidth").value);

        var backgroundTilesNode;
        //var foregroundTilesNode;
        var objectTilesNode;

        for (var i = 0; i < xmlDoc.getElementsByTagName("layer").length; ++i)
        {
            var currLayer = xmlDoc.getElementsByTagName("layer")[i];
        /*    if (currLayer.attributes.getNamedItem("name").value == this.foregroundLayerName)
            {
                foregroundTilesNode = currLayer.childNodes[1];
            }
		
            else*/ if (currLayer.attributes.getNamedItem("name").value == this.backgroundLayerName)
            {
                backgroundTilesNode = currLayer.childNodes[1];
            }

            else if (currLayer.attributes.getNamedItem("name").value == this.objectsLayerName)
            {
                objectTilesNode = currLayer.childNodes[1];
            }
        }

		var index = 0;
        for (var row = 0; row < this.tilesHigh; ++row)
        {
            this.tiles.push(new Array());
            //this.foregroundTiles.push(new Array())
            for (var col = 0; col < this.tilesWide; ++col)
            {
				while (backgroundTilesNode.childNodes[index].nodeName != "tile")
                {
                    index++;
                }
                var newTile = Object.create(TileData);
                newTile.type = parseInt(backgroundTilesNode.childNodes[index].attributes.getNamedItem("gid").value) - 1;
                newTile.friction = this.getTileFriction(newTile.type);
                newTile.acceleration = this.getTileAcceleration(newTile.type);
                this.tiles[row].push(newTile); 

            /*    newTile = Object.create(TileData);
                newTile.type = parseInt(foregroundTilesNode.childNodes[row * this.tilesWide + col].attributes.getNamedItem("gid").value) - 1; 
                newTile.friction = this.getTileFriction(newTile.type);
                newTile.acceleration = this.getTileAcceleration(newTile.type);
                this.foregroundTiles[row].push(newTile);
			*/
                var object = parseInt(objectTilesNode.childNodes[index].attributes.getNamedItem("gid").value) - 1;
				index++;
                if (this.isTileGameObject(object))
                {
                    var gameObjectData = Object.create(GameObjectData);
                    gameObjectData.type = object;
                    gameObjectData.x = this.left + col * this.tileSize;
                    gameObjectData.y = this.top + row * this.tileSize;
                    this.gameObjects.push(gameObjectData);
                }
            }
        }

        this.collisionRects = new Array();
        for (var row = 0; row < this.tilesHigh; ++row)
        {
            for (var col = 0; col < this.tilesWide; ++col)
            {
                if (this.isTileCollidable(this.tiles[row][col].type) || this.isTileGameObject(object))
                {
                    //add collision rect
                    var collisionRect = Object.create(RectClass);
                    collisionRect.init(this.left + col * this.tileSize, this.top + row * this.tileSize, this.tileSize, this.tileSize);
                    this.collisionRects.push(collisionRect);

                }

            }
        }
    },

    getTileFriction: function(type)
    {
        if(type == this.GROUND_LEFT_END || type == this.GROUND || type == this.GROUND_RIGHT_END)
        {
            return 0.9;
        }
        else
        {
            return 0.98;
        }
    },

    getTileAcceleration: function(type)
    {
        if(type == this.GROUND_LEFT_END || type == this.GROUND || type == this.GROUND_RIGHT_END)
        {
            return 1.0;
        }
        else
        {
            return 0.25;
        }
    },

    getAcceleration : function(x,y)
    {
        var col = Math.floor((x - this.left) / this.tileSize);
        var row = Math.floor((y - this.top) / this.tileSize);

        return this.tiles[row][col].acceleration;
    },

    getFriction : function(x,y)
    {
        var col = Math.floor((x - this.left) / this.tileSize);
        var row = Math.floor((y - this.top) / this.tileSize);

        return this.tiles[row][col].friction;
    },

    render: function (currContext)
    {
        for (var row = 0; row < this.tilesHigh; ++row)
        {

            for (var col = 0; col < this.tilesWide; ++col)
            {
                currContext.save();
                currContext.translate(this.left + col * this.tileSize, this.top + row * this.tileSize);
                if (this.tiles[row][col].type >= 0)
                {
                    var srcX = Math.floor(this.tiles[row][col].type % this.sourceTilesWide) * this.tileSize;
                    var srcY = Math.floor(this.tiles[row][col].type / this.sourceTilesWide) * this.tileSize;
                    currContext.drawImage(this.tileSheet, srcX, srcY, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
                }

            /*    if (this.foregroundTiles[row][col].type >= 0)
                {
                    var srcX = (Math.floor(this.foregroundTiles[row][col].type % this.sourceTilesWide)) * this.tileSize;
                    var srcY = Math.floor(this.foregroundTiles[row][col].type / this.sourceTilesWide) * this.tileSize;
                    currContext.drawImage(this.tileSheet, srcX, srcY, this.tileSize, this.tileSize, this.left + col * this.tileSize, 
										this.top + row * this.tileSize, this.tileSize, this.tileSize);
                }
			*/
                currContext.restore();
            }
        }
    },

    getTileValue: function (x, y)
    {
        x -= this.left;
        y -= this.top;

        x /= this.tileSize;
        y /= this.tileSize;

        x = Math.floor(x);
        y = Math.floor(y);

        return this.tiles[y][x];
    },
};