class TitleScene extends Phaser.Scene{
  constructor(){
    super("TitleScene");
    this.startbutton = null;
    this.background = null;
}
  preload(){
    this.load.image('background','Assets/OopsAllFireballs_Splash_Screen.png');
    this.load.image('startButton','Assets/Fireball_Start_Button.png');
  }
  create(){
    this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'background');
    //this.background.setScale(this.cameras.main.width,this.cameras.main.height);
    this.background.displayWidth = this.cameras.main.width;
    this.background.displayHeight = this.cameras.main.height;

    this.startButton = this.add.image(400,300,'startButton').setScale(1.4);
    this.startButton.setInteractive();
    this.startButton.on('pointerdown',()=>{
      game.scene.start('Animations');
      game.scene.remove('TitleScene');
    });
  }
  update(){
    this.startButton.rotation += .03;
  }
}
