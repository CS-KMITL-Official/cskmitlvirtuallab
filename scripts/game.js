class Game extends Phaser.Scene
{
    
    constructor ()
    {
        super();
    }

    preload ()
    {
      this.load.image("tiles"   , "../assets/tilesets/tuxmon-sample-32px-extruded.png");
      this.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town-Zee.json");
    }

    create ()
    {
      const map = this.make.tilemap({ key: "map" });

      // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
      // Phaser's cache (i.e. the name you used in preload)
      const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
      // Parameters: layer name (or index) from Tiled, tileset, x, y
      const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
      const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
      const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);
      
      worldLayer.setCollisionByProperty({ collides: true });
      
      // By default, everything gets depth sorted on the screen in the order we created things. Here, we
      // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
      // Higher depths will sit on top of lower depth objects.
      aboveLayer.setDepth(10);

      // Phaser supports multiple cameras, but you can access the default camera like this:
      const camera = this.cameras.main;

      // Set up the arrows to control the camera
      const cursors = this.input.keyboard.createCursorKeys();
      controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera: camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
      });

      // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      this.add
      .text(16, 16, "Arrow keys to scroll", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#6b6",
      })
      .setScrollFactor(0)
      .setDepth(30);

    }

    update(time, delta) {
      // Apply the controls to the camera each update tick of the game
      controls.update(delta);
    }

}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [Game],
};

const game = new Phaser.Game(config);

let controls;
let player;