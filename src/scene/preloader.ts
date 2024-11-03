import Phaser from "phaser";

export class preloader extends Phaser.Scene {

  constructor() {
    super('Preload')
  }

  preload() {
    this.load.setPath("public/tiled/")

    //Tilemaps
    this.load.tilemapTiledJSON('town-1', 'maps/town-1.json');
    this.load.tilemapTiledJSON('room-1', 'rooms/room-1.json');

    // Tilesets
    this.load.image('building-tileset')
    this.load.image('outdoor-tileset')
    this.load.image('collision_tileset')
    this.load.image('indoor-tileset-npc-1')
    this.load.image('bush-half')
    this.load.image('tall_grass')
    this.load.image('unused_grass')
    this.load.image('waves')

    // Sprites
    this.load.spritesheet('characters', 'characters.png', { frameWidth: 16, frameHeight: 21 })
    this.load.spritesheet('grass_tall', 'tall_grass.png', {frameWidth: 16, frameHeight: 16})
    this.load.spritesheet('grass_tall_2', 'unused_grass.png', {frameWidth: 16, frameHeight: 16})

    // Components
    this.load.image('top-decors', 'maps/town-1-top-deco.png')
    this.load.image('message-box-1', 'Components/message-box-1.png')
  }

  create() {
    // this.scene.start('RoomScene')
    this.scene.start('WorldScene')
  }
}