class Game extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image(
      "tiles",
      "../assets/tilesets/tuxmon-sample-32px-extruded.png"
    );
    this.load.tilemapTiledJSON(
      "map",
      "../assets/tilemaps/tuxemon-town-Zee.json"
    );
    this.load.spritesheet("dude", "../assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    //==================================================== MAP ====================================================
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);

    //=================================================== PLAYER ===================================================
    player = this.physics.add.sprite(200, 350, "dude");
    this.physics.add.collider(player, worldLayer);
    cursors = this.input.keyboard.createCursorKeys();

    const anims = this.anims;
    anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    anims.create({
      key: "right",
      frames: anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    //=================================================== CAMERA ===================================================
    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;
    camera.setBounds(0, 0, 1024, 2048);
    camera.startFollow(player);
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //============================================== OVERLAY & DEBUG ==============================================
    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, 'Arrow keys to move\nPress "M" to show hitboxes', {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0)
      .setDepth(30);

    // Debug graphics
    this.input.keyboard.once("keydown_M", (event) => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
      worldLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    });
  }

  update(time, delta) {
    //=============================================== MOVE BY CURSER ===============================================
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) {
      player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (cursors.up.isDown) {
      player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
      player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    //============================================== CHANGE ANIMATION ==============================================
    if (cursors.left.isDown) {
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.anims.play("right", true);
    } else if (cursors.up.isDown) {
      player.anims.play("right", true);
    } else if (cursors.down.isDown) {
      player.anims.play("left", true);
    } else {
      player.anims.stop();
    }
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
      gravity: { y: 0 },
    },
  },
  scene: [Game],
};

const game = new Phaser.Game(config);

let cursors;
let player;
let showDebug = false;
