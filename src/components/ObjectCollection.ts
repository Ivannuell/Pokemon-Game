/* eslint-disable @typescript-eslint/no-explicit-any */
import GridEngine from "grid-engine";



export class ObjectCollection {

  constructor(
    private objectList: any[],
    private gridEngine: GridEngine
  ) {

  }

  flagMap: Map<number, boolean> = new Map<number, boolean>
  bushSprites: Phaser.GameObjects.Sprite[] = []

  getAllKeys() {
    const array: string[] = []
    this.objectList.forEach(obj => {
      array.push(obj.type)
    })
    return array
  }

  getCollectionOf(key: string) {
    return this.objectList.filter(obj => {
      return obj.type === key
    }).map(obj => {
      return { ...obj, x: obj.x / 16, y: obj.y / 16 }
    })
  }

  updatedNpcCollectionPositions() {
    return this.getCollectionOf('npc').map((npc: { name: string; }) => {
      return { ...npc, x: this.gridEngine.getPosition(npc.name).x, y: this.gridEngine.getPosition(npc.name).y }
    })
  }

  setPositionEventsToFlagMap() {
    this.getCollectionOf('event-trigger').forEach(event => {
      this.flagMap.set(event.id, event.properties.getGameObjProperty('active'))
    })

    console.log(this.flagMap)
  }

  getEventsById(): any[] {
    return this.getCollectionOf('event-trigger').filter(event => {
      return [...this.flagMap.keys()].map(key => {
        return event.id === key
      })
    })
  }
}

