import { CharacterData } from "grid-engine";

export enum characterMappings {
  'Blue',
  'Oak',
  'Red',
  'Green'
}

export class MainCharacter {
  sprite: Phaser.GameObjects.Sprite
  constructor(
    private scene: Phaser.Scene,
    private spriteKey: string,
    private characterConfig: CharacterData
  ) {
    this.sprite = this.scene.add.sprite(0, 0, this.spriteKey)
    this.scene.cameras.main.startFollow(this.sprite).setZoom(2)
  }

  addMainCharacter(): CharacterData {
    return {...this.characterConfig, sprite: this.sprite}
  }


}