/* eslint-disable @typescript-eslint/no-explicit-any */
import GridEngine, { Direction } from "grid-engine";

export class InteractionHandler {

  constructor(
    private scene: Phaser.Scene,
    private gridEngine: GridEngine
  ) {

  }

  npcCollection!: any[];
  signCollection!: any[];

  lineCount = 0;
  lineShowed = 0;

  wait: boolean = false;
  current_action: any = 'interact';
  current_object_event!: Phaser.Types.Tilemaps.TiledObject;
  messageCount: any;
  currentMessageIndex: number = 0;
  MaxMessageIndex: number = 0;

  controllable: boolean = true


  toggleInteractable() {
    this.scene.events.addListener('on-controlls', () => {
      this.controllable = true
      console.log('controlls turned on')
    })
    
    this.scene.events.addListener('off-controlls', () => {
      this.controllable = false
      console.log('controlls turned off')
    })
  }

  interactCallback() {
    switch (this.current_action) {
      case 'interact': {
        console.log('interacting')
        this.handleInteraction()

        break;
      }

      case 'afirm': {
        console.log('afirming')
        this.hanndleAfirm()
        break;
      }
    }
  }

  handleInteraction = () => {
    this.signCollection.forEach((object: Phaser.Types.Tilemaps.TiledObject) => {
      if (
        this.gridEngine.getFacingPosition('player').x === object.x &&
        this.gridEngine.getFacingPosition('player').y === object.y &&
        this.gridEngine.getFacingDirection('player') === Direction.UP
      ) {
        this.current_object_event = object;
        this.current_action = 'afirm'
        this.InitObjectResponse(this.current_object_event);
      }
    })

    this.npcCollection.forEach((npc: any) => {
      if (
        this.gridEngine.getFacingPosition('player').x === npc.x &&
        this.gridEngine.getFacingPosition('player').y === npc.y &&
        this.gridEngine.isMoving(npc.name) === false
      ) {
        this.current_object_event = npc;
        this.gridEngine.stopMovement(npc.name)
        this.current_action = 'afirm';
        this.InitObjectResponse(this.current_object_event)
      }
    })
  }

  // This is called while interacting to an object
  hanndleAfirm = () => {
    this.onObjectResponse();
  }

  InitObjectResponse = (object: Phaser.Types.Tilemaps.TiledObject) => {
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

  onObjectResponse = () => {
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
    
    if (this.current_object_event.type === 'npc'){
      this.gridEngine.moveRandomly(this.current_object_event.name, 2000, 5)
    }
    
  }

  setNpcCollection(npcCOllection: any[]) {
    this.npcCollection = npcCOllection
  }

  setSignCollection(signCOllection: any[]) {
    this.signCollection = signCOllection
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
}
