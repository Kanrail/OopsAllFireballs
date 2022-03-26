class Field1 extends Phaser.Scene{
    constructor(){
        super("Field1");
        this.player = null;
        this.background = null;
    }
    preload(){
        this.load.image('background','Assets/Environment/PlayField.png');
        this.load.image('player','Assets/Player/Player_Idle_1.png')
    }

    create(){
        this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'background');

        this.player = this.physics.add.sprite(400,300,'player');
        
        this.input.keyboard.on('keydown-W',()=>{
            this.player.setVelocityY(-60);
        })
        this.input.keyboard.on('keyup-W',()=>{
            this.player.setVelocityY(0);
        })
        this.input.keyboard.on('keydown-A',()=>{
            this.player.setVelocityX(-60);
        })
        this.input.keyboard.on('keyup-A',()=>{
            this.player.setVelocityX(0);
        })
        this.input.keyboard.on('keydown-S',()=>{
            this.player.setVelocityY(60);
        })
        this.input.keyboard.on('keyup-S',()=>{
            this.player.setVelocityY(0);
        })
        this.input.keyboard.on('keydown-D',()=>{
            this.player.setVelocityX(60);
        })
        this.input.keyboard.on('keyup-D',()=>{
            this.player.setVelocityX(0);
        })
    }

    update(){

    }
}