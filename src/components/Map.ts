import Phaser from "phaser";

export class Map  {
  private _map!: Phaser.Tilemaps.Tilemap

  constructor(
    private scene: Phaser.Scene,
    private mapKey: string
  ) {
    this._map = this.scene.add.tilemap(this.mapKey);
  }

  get map(): Phaser.Tilemaps.Tilemap {
    return this._map
  }

  addTilesetImages(): void {
    this._map.tilesets.forEach((tileset) => {
      this._map.addTilesetImage(tileset.name)
    })
  }

  createTilelayers(): void {
    this._map.getTileLayerNames().forEach((layer) => {
      this._map.createLayer(layer, this._map.tilesets)!.setVisible(this._map.getLayer(layer)!.visible)
    })
  }

  getObjectsAtObjectLayers(): Phaser.Types.Tilemaps.TiledObject[] {
    const array: Phaser.Types.Tilemaps.TiledObject[] = []
    this._map.getObjectLayerNames().forEach((layer: string) => {
      this._map.getObjectLayer(layer)?.objects.forEach((object: Phaser.Types.Tilemaps.TiledObject) => {
        array.push(object)
      })
    })

    return array
  }

  

}