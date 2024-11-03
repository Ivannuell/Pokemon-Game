import { GridEngine } from "grid-engine";
// import * as AnimatedTiles from 'phaser-animated-tiles'
import Phaser from "phaser";
import { WorldScene } from "./scene/WorldScene";
import { preloader } from "./scene/preloader";
import { MessageBox } from "./components/MessageBox";
import { RoomScene } from "./scene/RoomScene";


const config = {
    title: "RPG MonsterTamer",
    pixelArt: true,
    type: Phaser.AUTO,
    plugins: {
        scene: [
            {
                key: "gridEngine",
                plugin: GridEngine,
                mapping: "gridEngine",
            },
            // {
            //   key: "animatedTiles",
            //   Plugin: AnimatedTiles,
            //   mapping: "animatedTiles"
            // }
        ],
    },
    scale: {
        width: 800,
        height: 600
    },
    scene: [
      preloader,
      MessageBox,
      WorldScene,
      RoomScene

    ],
    parent: "game",
    backgroundColor: "#000",
    input: {
        mouse: {
            preventDefaultWheel: false
        },
        touch: {
            capture: false
        }
    }
};

export const game = new Phaser.Game(config)

