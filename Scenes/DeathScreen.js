/** @type {Phaser.Scene} */
class DeathScreen extends Phaser.Scene{
    constructor(){
        super("DeathScreen");
        this.background = null;
    }
    preload(){
        this.load.image('fireballDeath','Assets/Endings&Extras/Gameover_Own_Fireball.png');
        this.load.image('smallSlimeDeath','Assets/Endings&Extras/Gameover_Slime_Pink.png')
    }
    create(){
        if(playerDeath === 'fireball'){
            this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'fireballDeath');
        }
        else if(playerDeath === 'smallSlime'){
            this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'smallSlimeDeath');
        }
        this.background.setScale(2.8);
    }
    update(){

    }
}