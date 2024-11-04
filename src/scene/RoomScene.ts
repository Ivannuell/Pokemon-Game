// /* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseScene } from "./BaseScene";
import { Map } from "../components/Map";
import GridEngine, { Direction } from "grid-engine";
import { PlayerControls } from "../components/PlayerControls";
import { InteractionHandler } from "../components/InteractionHandler";
import { ObjectCollection } from "../components/ObjectCollection";
import { ObjectHandler } from "../components/ObjectsHandler";
import { SceneEventHandler } from "../components/SceneEventManager";


export class RoomScene extends BaseScene {
  map!: Map
  gridEngine!: GridEngine
  controls!: PlayerControls
  interact!: InteractionHandler
  objectList!: object[];
  collection!: ObjectCollection
  objectHandler!: ObjectHandler
  eventHandler!: SceneEventHandler
  room!: string

  constructor() {
    super('RoomScene')
  }

  start() {
    this.gridEngine.turnTowards('player', Direction.UP)
  }

  init(data: {room: string}) {
    this.room = data.room
  }

  create() {
    this.InitCharacter(5,9,Direction.UP)
    this.map = new Map(this, this.room)
    this.map.addTilesetImages()
    this.map.createTilelayers()
    this.objectList = this.map.getObjectsAtObjectLayers()
    this.gridEngine.create(this.map.map, { characters: [this.mainCharacter.addMainCharacter()] })

    this.controls = new PlayerControls(this)
    this.collection = new ObjectCollection(this.objectList, this.gridEngine)
    this.objectHandler = new ObjectHandler(this, this.gridEngine)
    this.eventHandler = new SceneEventHandler(this, this.gridEngine, this.collection)
    this.interact = new InteractionHandler(this, this.gridEngine, this.collection, this.eventHandler)

    this.eventHandler.handleDoorEvent_Inside(this.collection.getCollectionOf('door-inside'))
    

    // this.interact.setNpcCollection(this.collection.getNpcCollection())
    // this.interact.setSignCollection(this.collection.getSignCollection())

    // this.objectHandler.addNPCtoMap(this.collection.getNpcCollection()).forEach(npc => {
    //   this.gridEngine.addCharacter(npc)
    // })
    
    this.input.keyboard!.on('keydown', (e: { key: string; }) => {
      if (e.key == ' ' && !this.wait) {
        this.interact.interactCallback()   
      }
    })

    this.events.on('wake', () => {
      this.gridEngine.turnTowards('player', Direction.UP)
    })
    
  }

  update() {
    
    this.controls.movementInput(this.gridEngine, this.interact.controllable)
    // this.interact.setNpcCollection(this.collection.updatedNpcCollectionPositions())
  }
} 