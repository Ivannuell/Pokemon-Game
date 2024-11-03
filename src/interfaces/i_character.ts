import { CharacterData} from "grid-engine"

export interface iCharacter {
  sprite: Phaser.GameObjects.Sprite
  addMainCharacter(): CharacterData
}