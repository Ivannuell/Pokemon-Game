/* eslint-disable @typescript-eslint/no-explicit-any */
import GridEngine, { Direction } from "grid-engine";
import { Scene } from "phaser";
import { ModalMessageHandler } from "./ModalMessageHandler";
import { ObjectCollection } from "./ObjectCollection";
import '../MyArrayFunc'

export class SceneEventHandler {
  constructor(
    private scene: Scene,
    private gridEngine: GridEngine,
    private collectionHandler: ObjectCollection
  ) {
    this.updatedMsgEventsNpc = this.collectionHandler.getCollectionOf('npc')
  }

  private updatedMsgEventsNpc!: Phaser.Types.Tilemaps.TiledObject[];

  handleDoorEvent_Outside(doorCollection: Phaser.Types.Tilemaps.TiledObject[]) {
    doorCollection.forEach(door => {
      this.gridEngine.steppedOn(['player'], [{ x: door.x!, y: door.y! }])
        .subscribe(() => {
          this.scene.scene.switch('RoomScene', { room: door.properties.getGameObjProperty('room') })
          this.gridEngine.turnTowards('player', Direction.UP)
        })
    })
  }


  handleDoorEvent_Inside(doorCollection: Phaser.Types.Tilemaps.TiledObject[]) {
    doorCollection.forEach(door => {
      this.gridEngine.steppedOn(['player'], [{ x: door.x!, y: door.y! }])
        .subscribe(() => {
          this.scene.scene.switch('WorldScene')
        })
    })
  }

  checkPositionEvent(eventPosCollection: Phaser.Types.Tilemaps.TiledObject[], modal: ModalMessageHandler) {
    eventPosCollection.forEach(pos => {
      if (
        this.gridEngine.getPosition('player').x === pos.x &&
        this.gridEngine.getPosition('player').y === pos.y
      ) {
        this.activateEvent(pos.properties.getGameObjProperty('event_id'), modal)
      }
    })
  }

  animateBushPosition(bushCollection: Phaser.Types.Tilemaps.TiledObject[]) {
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

  checkBushPosition(bushCollection: Phaser.Types.Tilemaps.TiledObject[]) {
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


  activateEvent(eventId: string, modal: ModalMessageHandler) {
    switch (eventId) {
      case 'go-back-1': {
        modal.showModalMessage('You can\'t go there its dangerous::Go see prof oak for assitance')
        this.gridEngine.moveTo('player', { x: 28, y: 18 })

        this.collectionHandler.updateEventFlagStatus('go-back-2', true)

        this.updatedNpcMsgEvent(this.updatedMsgEventsNpc, 'Oak', 'Outside you start your adventure and::fullfil your dreams, Are you ready for that?::Well then go on and soar high')
        this.updatedNpcMsgEvent(this.updatedMsgEventsNpc, 'Blue', 'So you want to go on an adventure huh::Well good luck yo!')
        break;
      }
    }
  }

  updatedNpcMsgEvent(npcCollection: Phaser.Types.Tilemaps.TiledObject[], npc: string, msg: string) {
    this.updatedMsgEventsNpc = npcCollection.changeNpcMessageProperty(npc, msg)
  }

  syncUpdatedNpcMsgEvents() {
    return this.updatedMsgEventsNpc
  }
}

