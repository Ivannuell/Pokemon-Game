// /* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseScene } from "./BaseScene";
import { Map } from "../components/Map";
import GridEngine, { Direction } from "grid-engine";
import { PlayerControls } from "../components/PlayerControls";
import { InteractionHandler } from "../components/InteractionHandler";
import { ObjectCollection } from "../components/ObjectCollection";
import { ObjectHandler } from "../components/ObjectsHandler";
import { SceneEventHandler } from "../components/SceneEventManager";
import { ModalMessageHandler } from "../components/ModalMessageHandler";
import { Monster } from "../components/monster/MonsterCharacter";

export class WorldScene extends BaseScene {
  map!: Map
  gridEngine!: GridEngine
  controls!: PlayerControls
  interact!: InteractionHandler
  objectList!: Phaser.Types.Tilemaps.TiledObject[];
  collection!: ObjectCollection
  objectHandler!: ObjectHandler
  eventHandler!: SceneEventHandler
  modal!: ModalMessageHandler
  myMonster!: Monster 

  constructor() {
    super('WorldScene')
  }

  create() {
    this.InitCharacter(12, 15)
    this.map = new Map(this, 'town-1')
    this.map.addTilesetImages()
    this.map.createTilelayers()
    this.objectList = this.map.getObjectsAtObjectLayers()
    this.gridEngine.create(this.map.map, { characters: [this.mainCharacter.addMainCharacter()] })


    this.anims.create({
      key: 'stepped-bush-2',
      frames: this.anims.generateFrameNumbers('grass_tall_2', { start: 0, end: 8 }),
      duration: 500,
      // yoyo: true
    })

    this.anims.create({
      key: 'ocean-waves',
      frames: this.anims.generateFrameNumbers('waves', { start: 0, end: 6 }),
      repeat: -1,
      duration: 1500
    })


    this.myMonster = new Monster(this, this.gridEngine, 'Bulbasuar')
    this.myMonster.setMonsterData()
    this.myMonster.addMonster()
    this.myMonster.startFollowingCharacter()

    this.collection = new ObjectCollection(this.objectList, this.gridEngine)
    this.collection.setPositionEventsToFlagMap()
    this.collection.setNpcEventsToFlagMap()

    // this.controls = new PlayerControls(this, this.collection)
    this.controls = new PlayerControls(this)
    this.modal = new ModalMessageHandler(this)
    this.objectHandler = new ObjectHandler(this, this.gridEngine)
    this.eventHandler = new SceneEventHandler(this, this.gridEngine, this.collection)
    this.interact = new InteractionHandler(this, this.gridEngine, this.collection)


    this.eventHandler.handleDoorEvent_Outside(this.collection.getCollectionOf('door-outside'))

    this.objectHandler.addNPCtoMap(this.collection.getCollectionOf('npc'))
      .forEach(npc => {
        this.gridEngine.addCharacter(npc)
        this.gridEngine.setCollisionGroups(npc.id, ['npcGroup', 'nonPlayerGroup'])
      })

    this.gridEngine.setCollisionGroups('player', ['playerGroup', 'npcGroup'])

    this.objectHandler.moveNpcRandomly(this.collection.getCollectionOf('npc'))

    this.collection.getCollectionOf('bush').forEach(bush => {
      this.collection.bushSprites.push(this.add.sprite(bush.x! * 16, bush.y! * 16, 'grass_tall_2', 8).setOrigin(0).setDepth(3))
    })


    this.collection.getCollectionOf('ocean-tile').forEach(oceanTiles => {
      this.add.sprite(oceanTiles.x! * 16, oceanTiles.y! * 16, 'waves').setOrigin(0).setDepth(3).anims.play('ocean-waves')
    })


    this.input.keyboard!.on('keydown', (e: { keyCode: number; }) => {
      if (e.keyCode === this.controls.keyBindings.INTERACT && !this.wait) {
        if (this.modal.modalActive) {
          this.modal.afrimModalMessage()
        } else {
          this.interact.interactCallback()
        }

      }
    })

    this.interact.toggleInteractable()

    this.events.on('wake', () => {
      this.gridEngine.turnTowards('player', Direction.DOWN)
    })

    // this.gridEngine.movementStarted().subscribe(({charId}) => {
    //   if (charId === 'player') {
    //   }
    // })

    this.gridEngine.movementStopped().subscribe(({ charId }) => {
      if (charId === 'player') {
        this.eventHandler.checkPositionEvent(this.collection.getCollectionOf('event-trigger').filterByPropertyUsingFlagMap(this.collection.getFlagMap), this.modal)
        this.eventHandler.animateBushPosition(this.collection.getCollectionOf('bush'))
      }

      this.collection.getAllNpcNames().forEach(npc => {
        if (charId === npc) {
          this.interact.setNpcCollection = this.collection.updatedNpcCollectionPositions(this.eventHandler.syncUpdatedNpcMsgEvents())
        }
      })
    })


  }


  update() {
    this.controls.movementInput(this.gridEngine, this.interact.getControllStatus)
  }

}

