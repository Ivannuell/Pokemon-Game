/* eslint-disable @typescript-eslint/no-explicit-any */
import GridEngine, { Direction } from "grid-engine";
// import { ObjectCollection } from "./ObjectCollection";


export class PlayerControls  {
  keyBindings!: {
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
    INTERACT: number
  }
  keys!: any;

  constructor(
    private scene: Phaser.Scene,
  ) {
    this.init();
  }

  init() {
    this.keyBindings = {
      UP: Phaser.Input.Keyboard.KeyCodes.W,
      DOWN: Phaser.Input.Keyboard.KeyCodes.S,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
      LEFT: Phaser.Input.Keyboard.KeyCodes.A,
      INTERACT: Phaser.Input.Keyboard.KeyCodes.SPACE
    }

    this.keys = this.scene.input.keyboard!.addKeys(this.keyBindings)

  }

  movementInput(gridEngine: GridEngine, controllable: boolean) {
    if (this.keys.DOWN.isDown && controllable && !gridEngine.isMoving('player')) {
      gridEngine.move('player', Direction.DOWN)
    }
    
    if (this.keys.UP.isDown && controllable && !gridEngine.isMoving('player')) {
      gridEngine.move('player', Direction.UP)
    }

    if (this.keys.LEFT.isDown && controllable && !gridEngine.isMoving('player')) {
      gridEngine.move('player', Direction.LEFT)
    }
    
    if (this.keys.RIGHT.isDown && controllable && !gridEngine.isMoving('player')) {
      gridEngine.move('player', Direction.RIGHT)
    }
  }


}






