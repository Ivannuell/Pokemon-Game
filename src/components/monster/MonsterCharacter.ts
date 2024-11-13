import GridEngine, { CharacterData } from "grid-engine";


export class Monster{
  constructor(
    public scene: Phaser.Scene,
    protected gridEngine: GridEngine,
    protected textureKey: string
  ) {
    // this.setMonsterData(textureKey)
    // this.addMonster()
  }

  private MonsterGeData!: CharacterData

  setMonsterData() {
    this.MonsterGeData = {
      id: this.textureKey,
      startPosition: {x: 11, y: 15},
      sprite: this.scene.add.sprite(0,0,this.textureKey),
      walkingAnimationMapping: 0,
      // speed: 5
    }
    
  }

  addMonster() {
    this.gridEngine.addCharacter(this.MonsterGeData)
    this.gridEngine.setCollisionGroups(this.textureKey, ['monster', 'nonPlayerGroup'])
  }

  startFollowingCharacter() {
    this.gridEngine.follow(this.textureKey, 'player', {
      // considerCosts: true,
      algorithm: "BFS",
      distance: 0,
      ignoreLayers: true,
      // distance: 1sssssss
    })
  }




}