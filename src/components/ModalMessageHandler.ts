

export class ModalMessageHandler {
  constructor(
    private scene: Phaser.Scene
  ) {

  }
  
  
  modalActive!: boolean;
  lineCounts!: string[];
  lineMax: number = 0
  current: number = 0

  showModalMessage(message: string) {
    this.modalActive = true;
    this.lineCounts = message.split('::');
    this.lineMax = this.lineCounts.length - 1;
    this.scene.events.emit('off-controlls')
    this.scene.scene.launch('messageBox', {message: this.lineCounts[this.current]}).bringToTop('messageBox')
  }

  afrimModalMessage() {
    if (this.current !== this.lineMax) {
      this.current += 1;
      this.scene.scene.launch('messageBox', {message: this.lineCounts[this.current]})
      return 
    }

    this.modalActive = false
    this.lineCounts = []
    this.lineMax = 0
    this.current = 0
    this.scene.events.emit('on-controlls')
    this.scene.scene.stop('messageBox')
  }
}