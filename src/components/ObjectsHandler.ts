import GridEngine, { CharacterData } from "grid-engine";

const characterMappings = new Map<string, number>
characterMappings.set('Blue', 0)
characterMappings.set('Oak', 1)
characterMappings.set('Red', 2)
characterMappings.set('Green', 3)

export class ObjectHandler {

  constructor(
    private scene: Phaser.Scene,
    private gridEngine: GridEngine
    ) {
    
  }

  addNPCtoMap(npcCollection: Phaser.Types.Tilemaps.TiledObject[]) {
    const array: CharacterData[] = []

    npcCollection.forEach((npc: Phaser.Types.Tilemaps.TiledObject) => {
      array.push({
        id: npc.name,
        sprite: this.scene.add.sprite(0,0,'characters'),
        walkingAnimationMapping: characterMappings.get(npc.name),
        startPosition: {x: npc.x!, y: npc.y!},
      })
    })
    return array
  }

  moveNpcRandomly(npcCollection: Phaser.Types.Tilemaps.TiledObject[]) {
    npcCollection.forEach(npc => {
      this.gridEngine.moveRandomly(npc.name, 2000, 2)
    })
  }

  

}