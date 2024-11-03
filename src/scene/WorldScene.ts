/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import AnimatedTiles from 'phaser-animated-tiles'
Array.prototype.filterCollectionByProperty = function (property: string, value?: any) {
  if (!value) {
    console.log('no value call')
    return this.filter(obj => {
      return obj.properties.getGameObjProperty(property)
    })
  }

  return this.filter(obj => {
    return obj.properties.getGameObjProperty(property) === value
  })
}

Array.prototype.filterByIdUsingFlagMap = function (flagMap: any) {
  return this.filter(event => {
    return flagMap.get(event.id)
  })
}

export class WorldScene extends BaseScene {
  map!: Map
  gridEngine!: GridEngine
  controls!: PlayerControls
  interact!: InteractionHandler
  objectList!: object[];
  collection!: ObjectCollection
  objectHandler!: ObjectHandler
  eventHandler!: SceneEventHandler
  modal!: ModalMessageHandler
  // animatedTiles!: AnimatedTiles


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

    // this.animatedTiles.init(this.map.map)


    this.anims.create({
      key: 'stepped-bush',
      frames: this.anims.generateFrameNumbers('grass_tall', {start: 1, end: 4}),
      duration: 300,
      // yoyo: true
    })

    this.anims.create({
      key: 'stepped-bush-2',
      frames: this.anims.generateFrameNumbers('grass_tall_2', {start: 0, end: 8}),
      duration: 500,
      // yoyo: true
    })


    this.collection = new ObjectCollection(this.objectList, this.gridEngine)
    this.collection.setPositionEventsToFlagMap()

    // this.controls = new PlayerControls(this, this.collection)
    this.controls = new PlayerControls(this)
    this.objectHandler = new ObjectHandler(this, this.gridEngine)
    this.interact = new InteractionHandler(this, this.gridEngine)
    this.modal = new ModalMessageHandler(this)
    this.eventHandler = new SceneEventHandler(this, this.gridEngine, this.collection)

    this.interact.setNpcCollection(this.collection.getCollectionOf('npc'))
    this.interact.setSignCollection(this.collection.getCollectionOf('mail'))
    this.eventHandler.handleDoorEvent_Outside(this.collection.getCollectionOf('door-outside'))

    this.objectHandler.addNPCtoMap(this.collection.getCollectionOf('npc'))
      .forEach(npc => {
        this.gridEngine.addCharacter(npc)
      })

    this.objectHandler.moveNpcRandomly(this.collection.getCollectionOf('npc'))

    this.collection.getCollectionOf('bush').forEach(bush => {
      this.collection.bushSprites.push(this.add.sprite(bush.x * 16, bush.y * 16, 'grass_tall_2', 8).setOrigin(0).setDepth(3))
    })


    this.input.keyboard!.on('keydown', (e: { keyCode: number; }) => {
      if (e.keyCode === this.controls.keyBindings.INTERACT && !this.wait) {
        if (this.modal.modalActive) {
          this.modal.afrimModalMessage()
        } else {
          this.interact.interactCallback()
        }

        console.log(this.gridEngine.getPosition('player'))
      }
    })

    this.interact.toggleInteractable()

    this.events.on('wake', () => {
      this.gridEngine.turnTowards('player', Direction.DOWN)
    })

    console.log(this.collection.getEventsById().filterCollectionByProperty('active', true))

    this.events.addListener('checkPosition', () => {
      this.eventHandler.checkPositionEvent(this.collection.getCollectionOf('event-trigger').filterByIdUsingFlagMap(this.collection.flagMap), this.modal)

      this.eventHandler.checkBushPosition(this.collection.getCollectionOf('bush'))
      console.log(this.gridEngine.getMovement('player'))
    }, this)


    // this.gridEngine.movementStarted().subscribe(({charId}) => {
    //   if (charId === 'player') {
    //   }
    // })

    this.gridEngine.movementStopped().subscribe(({ charId }) => {
      if (charId === 'player') {
        this.eventHandler.checkPositionEvent(this.collection.getCollectionOf('event-trigger').filterByIdUsingFlagMap(this.collection.flagMap), this.modal)
        this.eventHandler.animateBushPosition(this.collection.getCollectionOf('bush'))
        
      }
    })
  }

  update() {
    // this.eventHandler.checkPositionEvent(this.collection.getCollectionOf('event-trigger').filterByIdUsingFlagMap(this.collection.flagMap), this.modal)

    this.controls.movementInput(this.gridEngine, this.interact.controllable)
    this.interact.setNpcCollection(this.collection.updatedNpcCollectionPositions())

  }
}

