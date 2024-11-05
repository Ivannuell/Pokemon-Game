/* eslint-disable @typescript-eslint/no-explicit-any */
import GridEngine from "grid-engine";
import '../MyArrayFunc'


export class ObjectCollection {

  constructor(
    private objectList: any[],
    private gridEngine: GridEngine
  ) {

  }

  bushSprites: Phaser.GameObjects.Sprite[] = []

  private flagMap = new Map<string, boolean>
  private eventList = [
    {eventName: 'go-back-2', initValue: false }
  ]

  get getEventList() {
    return this.eventList
  }

  get getFlagMap() {
    return this.flagMap
  }

  setPositionEventsToFlagMap() {
    this.getCollectionOf('event-trigger').forEach(event => {
      this.flagMap.set(event.properties.getGameObjProperty('event_id'), event.properties.getGameObjProperty('active'))
    })
  }

  setNpcEventsToFlagMap() {
    this.eventList.forEach(event => {
      this.flagMap.set(event.eventName, event.initValue)
    })
  }


  //FlagMap Abstractions
  getEventFlagStatus(eventName: string): boolean {
    return this.flagMap.get(eventName) ?? false
  }

  updateEventFlagStatus(eventName: string, newVal: boolean) {
    this.flagMap.set(eventName, newVal)
  }

  getAllFlagMapKeys() {
    return [...this.flagMap.keys()]
  }

  

  getCollectionOf(key: string) {
    return this.objectList.filter(obj => {
      return obj.type === key
    }).map(obj => {
      return { ...obj, x: obj.x / 16, y: obj.y / 16 }
    })
  }

  getAllNpcNames(): string[] {
    return this.getCollectionOf('npc').map(npc => {
      return npc.name
    })
  }

  updatedNpcCollectionPositions(npcCollection: Phaser.Types.Tilemaps.TiledObject[]) {
    return npcCollection.map((npc: Phaser.Types.Tilemaps.TiledObject) => {
      return { ...npc, x: this.gridEngine.getPosition(npc.name).x, y: this.gridEngine.getPosition(npc.name).y }
    })
  }

  // updateNpcCollectionMessages() {
  //   return this.getCollectionOf('npc').map(npc => {
  //     return {}
  //   })
  // }

  getEventsById(): any[] {
    return this.getCollectionOf('event-trigger').filter(event => {
      return [...this.flagMap.keys()].map(key => {
        return event.id === key
      })
    })
  }
}

