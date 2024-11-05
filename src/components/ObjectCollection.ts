/* eslint-disable @typescript-eslint/no-explicit-any */
import GridEngine from "grid-engine";
import '../MyArrayFunc'


export class ObjectCollection {

  constructor(
    private objectList: any[],
    private gridEngine: GridEngine
  ) {

  }

  flagMap: Map<number, boolean> = new Map<number, boolean>
  bushSprites: Phaser.GameObjects.Sprite[] = []
  private eventList = [
    { eventId: 10001, eventName: 'go-back-2', initValue: false }
  ]

  get getEventList() {
    return this.eventList
  }

  //FlagMap Abstractions
  


  referenceIdtoEventName(id: number) {
    const obj: { eventId: number, eventName: string, initValue: any }[] =
      this.eventList.filter(e => {
        return id === e.eventId
      })

    // return obj.eventName
    return obj[0].eventName
  }

  referenceEventNametoId(eventName: string) {
    const obj: { eventId: number, eventName: string, initValue: any }[] =
      this.eventList.filter(e => {
        return eventName === e.eventName
      })

    return obj[0].eventId
  }

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

  setPositionEventsToFlagMap() {
    this.getCollectionOf('event-trigger').forEach(event => {
      this.flagMap.set(event.id, event.properties.getGameObjProperty('active'))
    })
  }

  setNpcEventsToFlagMap() {
    this.eventList.forEach(event => {
      this.flagMap.set(event.eventId, event.initValue)
    })
  }

  getEventsById(): any[] {
    return this.getCollectionOf('event-trigger').filter(event => {
      return [...this.flagMap.keys()].map(key => {
        return event.id === key
      })
    })
  }
}

