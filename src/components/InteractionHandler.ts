import GridEngine, { Direction } from "grid-engine";
import { ObjectCollection } from "./ObjectCollection";
import { SceneEventHandler } from "./SceneEventManager";

export class InteractionHandler {

  constructor(
    private scene: Phaser.Scene,
    private gridEngine: GridEngine,
    private collectionHandler: ObjectCollection,
    private eventHandler: SceneEventHandler
  ) {
  }

  private npcCollection!: Phaser.Types.Tilemaps.TiledObject[];
  private controllable = true
  private current_action: 'interact' | 'afirm' = 'interact';
  private current_object_event!: Phaser.Types.Tilemaps.TiledObject;
  private messageCount!: string[];
  private currentMessageIndex = 0;
  private MaxMessageIndex = 0;


  get getControllStatus() {
    return this.controllable
  }

  set setNpcCollection(newNpcCollection: Phaser.Types.Tilemaps.TiledObject[]) {
    this.npcCollection = newNpcCollection;
  }

  toggleInteractable(): void {
    this.scene.events.addListener('on-controlls', () => {
      this.controllable = true
      console.log('controlls turned on')
    })

    this.scene.events.addListener('off-controlls', () => {
      this.controllable = false
      console.log('controlls turned off')
    })
  }

  interactCallback = () => {
    const InitObjectResponse = (object: Phaser.Types.Tilemaps.TiledObject) => {
      if (object.properties) {

        if (object.type === 'npc') {
          this.gridEngine.turnTowards(object.name, this.faceCharacterPosition(this.gridEngine.getFacingDirection('player')))
        }

        object.properties.forEach((prop: { name: string; value: string; }) => {
          if (prop.name === 'message') {
            this.messageCount = prop.value.split('::');
            this.MaxMessageIndex = this.messageCount.length - 1;
            this.controllable = false;
            this.scene.scene.launch('messageBox', { message: this.messageCount[this.currentMessageIndex] }).bringToTop('messageBox')
          }
        })
      } else {
        this.controllable = false;
        this.messageCount = ['no info'];
        this.MaxMessageIndex = 0;
        this.scene.scene.launch('messageBox', { message: this.messageCount[0] }).bringToTop('messageBox')
      }
    }

    const handleInteraction = () => {
      this.collectionHandler.getCollectionOf('mail').forEach((object: Phaser.Types.Tilemaps.TiledObject) => {
        if (
          this.gridEngine.getFacingPosition('player').x === object.x &&
          this.gridEngine.getFacingPosition('player').y === object.y &&
          this.gridEngine.getFacingDirection('player') === Direction.UP
        ) {
          this.current_object_event = object;
          this.current_action = 'afirm'
          InitObjectResponse(this.current_object_event);
        }
      })

      this.npcCollection.forEach((npc: Phaser.Types.Tilemaps.TiledObject) => {
        if (
          this.gridEngine.getFacingPosition('player').x === npc.x &&
          this.gridEngine.getFacingPosition('player').y === npc.y &&
          this.gridEngine.isMoving(npc.name) === false
        ) {
          this.current_object_event = npc;
          this.gridEngine.stopMovement(npc.name)
          this.current_action = 'afirm';
          InitObjectResponse(this.current_object_event)

          this.handleNpcInteractEvents(npc)

        }
      })
    }

    const onObjectResponse = () => {
      if (this.currentMessageIndex !== this.MaxMessageIndex) {
        this.currentMessageIndex += 1
        this.scene.scene.launch('messageBox', { message: this.messageCount[this.currentMessageIndex] }).bringToTop('messageBox')
        return;
      }

      this.current_action = 'interact';
      this.currentMessageIndex = 0;
      this.MaxMessageIndex = 0;
      this.controllable = true;
      this.scene.scene.stop('messageBox')

      if (this.current_object_event.type === 'npc') {
        this.gridEngine.moveRandomly(this.current_object_event.name, 2000, 5)
      }
    }

    const hanndleAfirm = () => {
      onObjectResponse();
    }

    switch (this.current_action) {
      case 'interact': {
        console.log('interacting')
        handleInteraction()
        break;
      }

      case 'afirm': {
        console.log('afirming')
        hanndleAfirm()
        break;
      }
    }
  }

  faceCharacterPosition(facingDriection: Direction): Direction {
    switch (facingDriection) {
      case Direction.UP: {
        return Direction.DOWN
      }
      case Direction.DOWN: {
        return Direction.UP
      }
      case Direction.LEFT: {
        return Direction.RIGHT
      }
      case Direction.RIGHT: {
        return Direction.LEFT
      }
      default: {
        return Direction.NONE
      }
    }
  }

  handleNpcInteractEvents(npc: Phaser.Types.Tilemaps.TiledObject): void {
    switch (npc.name) {
      case 'Oak': {
        if (this.collectionHandler.flagMap.get(this.collectionHandler.referenceEventNametoId('go-back-2'))) {
          this.eventHandler.updateEventTrigger('go-back-2', false, 'npc')
          this.eventHandler.updateEventTrigger('go-back-1', false, 'position')
        }

        break
      }

    }
  }
}
