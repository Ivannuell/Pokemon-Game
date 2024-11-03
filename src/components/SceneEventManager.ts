/* eslint-disable @typescript-eslint/no-explicit-any */
import GridEngine, { Direction } from "grid-engine";
import { Scene } from "phaser";
import { ModalMessageHandler } from "./ModalMessageHandler";
import { ObjectCollection } from "./ObjectCollection";

Array.prototype.getGameObjProperty = function (propertyName: string): any {
  const props = ['name', 'value', 'type']
  if (!this.every(properties => {
    return props.every(prop => prop in properties)
  })) {
    throw new Error('This is not an array of game object properties.')
  }

  let propVal: any;
  this.forEach(prop => {
    if (prop.name === propertyName) {
      propVal = prop.value
      return
    }
  })
  return propVal
}

export class SceneEventHandler {
  constructor(
    private scene: Scene,
    private gridEngine: GridEngine,
    private collectionHandler: ObjectCollection
  ) {

  }
  


  handleDoorEvent_Outside(doorCollection: any[]) {
    doorCollection.forEach(door => {
      this.gridEngine.steppedOn(['player'], [{ x: door.x, y: door.y }])
        .subscribe(() => {
          this.scene.scene.switch('RoomScene', { room: door.properties.getGameObjProperty('room') })
          this.gridEngine.turnTowards('player', Direction.UP)
        })
    })
  }


  handleDoorEvent_Inside(doorCollection: any[]) {
    doorCollection.forEach(door => {
      this.gridEngine.steppedOn(['player'], [{ x: door.x, y: door.y }])
        .subscribe(() => {
          this.scene.scene.switch('WorldScene')
        })
    })
  }

  checkPositionEvent(eventPosCollection: any[], modal: ModalMessageHandler) {
    eventPosCollection.forEach(pos => {
      if (
        this.gridEngine.getPosition('player').x === pos.x &&
        this.gridEngine.getPosition('player').y === pos.y 
      ) {
        console.log(pos)

        this.activateEvent(pos.properties.getGameObjProperty('event_id'), modal)
      }
    })
  }

  animateBushPosition(bushCollection: any[]) {
    bushCollection.forEach(bush => {
      if (
        this.gridEngine.getPosition('player').x === bush.x &&
        this.gridEngine.getPosition('player').y === bush.y
      ) {
        console.log('stepping on bush')
        this.collectionHandler.bushSprites.filter(bushd => {
          return bush.x === bushd.x / 16 && bush.y === bushd.y / 16
        })[0].anims.play('stepped-bush-2')

      }
    })
  }

  checkBushPosition(bushCollection: any[]) {
    bushCollection.forEach(bush => {
      if (
        this.gridEngine.getPosition('player').x === bush.x &&
        this.gridEngine.getPosition('player').y === bush.y
      ) {
        console.log('stepping on bush')
        console.log(this.collectionHandler.bushSprites.filter(bushd => {
          return bush.x === bushd.x / 16 && bush.y === bushd.y / 16
        })[0].anims.play('stepped-bush'))

      }
    })
  }

  updateEventTrigger(eventId: string, newVal: boolean) {
    this.collectionHandler.getCollectionOf('event-trigger')
    .filterCollectionByProperty('event_id', eventId)
    .forEach((event: { id: number; }) => {
      this.collectionHandler.flagMap.set(event.id, newVal)
    })
  }

  activateEvent(eventId: string, modal: ModalMessageHandler) {
    switch (eventId) {
      case 'go-back-1': {
        modal.showModalMessage('You can\'t go there its dangerous::Go see prof oak for assitance')
        this.gridEngine.moveTo('player', { x: 28, y: 18 })
        this.updateEventTrigger('go-back-2', true)
        break;
      }

      case 'go-back-2': {
        modal.showModalMessage('You can now go outside::Happy adventuring')
        this.updateEventTrigger('go-back-1', false)
        this.updateEventTrigger('go-back-2', false)
      }
    }

    console.log(this.collectionHandler.flagMap)
  }









}

