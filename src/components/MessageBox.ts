/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import webFontLoader from 'webfontloader';

export class MessageBox extends Phaser.Scene {
  label!: Phaser.GameObjects.Text;
  message_modal!: Phaser.GameObjects.Image;
  time_event!: Phaser.Time.TimerEvent;
  BaseScene!: any;
  message!: string
  wait: boolean = false
  ran: boolean = false;

  constructor() {
    super('messageBox')
  }

  init(data: { message: string; }) {
    this.message = data.message;
  }

  create() {
    if (!this.message) return

    this.message_modal = this.add.image(100, 0, 'message-box-1').setOrigin(0).setScale(1.8)

    // this.label = this.add.bitmapText(150, 450, 'dialog-pokemon', '', 20);
    this.label = this.add.text(150, 450, '',
      {
        fontSize: '30px',
        color: '#000',
        fontFamily: 'Pokemon Solid',
        wordWrap: {
          width: 500
        }
      }
    );

    this.typewriteText(this.message)

    webFontLoader.load({
      custom: {
        families: ['"Pokemon Solid"']
      },
      active: () => {
        this.label.setFontFamily("Pokemon Solid").setColor('#000000')
      }
    })
  }

  typewriteText(text: string) {
    const length = text.length
    let i = 0
    this.time_event = this.time.addEvent({
      callback: () => {
        this.label.text += text[i]
        ++i
      },
      repeat: length - 1,
      delay: 20,

    })

    this.BaseScene = this.game.scene.getScenes(true)[0]
  }

  // typewriteTextWrapped(text: string) {
  //   const lines = this.label.getWrappedText(text);
  //   const wrappedText = lines.join('\n')

  //   this.typewriteText(wrappedText)
  // }

  update() {
    // console.log(this.time_event.getOverallProgress());
    if (this.time_event.getOverallProgress() === 1 && !this.ran) {
      this.ran = true
      this.BaseScene.resumeAfirm();
    } else if (this.time_event.getOverallProgress() !== 1) {
      this.ran = false
      this.BaseScene.pauseAfirm();
    }
  }
}