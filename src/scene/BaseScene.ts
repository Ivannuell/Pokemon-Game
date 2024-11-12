import Phaser from "phaser";
import {MainCharacter, characterMappings} from "../components/MainCharacter";
import {Direction} from "grid-engine";

export class BaseScene extends Phaser.Scene {

    protected mainCharacter!: MainCharacter
    wait: boolean = false;

    constructor(key: string) {
        super({key: key})

    }

    InitCharacter(posx: number, posy: number, facingDriection?: Direction) {
        this.mainCharacter = new MainCharacter(
            this,


            'characters', {
                id: 'player',
                walkingAnimationMapping: characterMappings.Red,
                startPosition: {x: posx, y: posy},
                facingDirection: facingDriection
            }
        )
    }

    pauseAfirm() {
        this.wait = true;
    }

    resumeAfirm() {
        this.time.addEvent({
            callback: () => {
                this.wait = false
            },
            delay: 400
        })
    }


}