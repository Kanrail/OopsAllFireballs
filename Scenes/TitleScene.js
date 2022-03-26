class TitleScene extends Phaser.Scene{
  constructor(){
    super("TitleScene");
    this.startbutton = null;
    this.background = null;
}
  preload(){
    this.load.image('background','Assets/StartScreen.png');
    this.load.image('startButton','Assets/StartButton.png');
  }
  create(){

  }
  update(){

  }
}
