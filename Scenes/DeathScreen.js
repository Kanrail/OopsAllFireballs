/** @type {Phaser.Scene} */
class DeathScreen extends Phaser.Scene{
    constructor(){
        super("DeathScreen");
        this.background = null;
        this.reloadOnNextClick = false;
    }
    preload(){
        this.load.image('fireballDeath','Assets/Endings&Extras/Gameover_Own_Fireball.png');
        this.load.image('smallSlimeDeath','Assets/Endings&Extras/Gameover_Slime_Pink.png')
        this.load.image('cubeDeath','Assets/Endings&Extras/Gameover_Slime_Green.png');
        this.load.image('win', 'Assets/Endings&Extras/You_Win.png');
        this.load.image('credits','Assets/credits.png')
    }
    create(){
        if(playerDeath === 'fireball'){
            this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'fireballDeath');
        }
        else if(playerDeath === 'smallSlime'){
            this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'smallSlimeDeath');
        }
        else if(playerDeath === null){
            this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'win');
        }
        else{
            this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'cubeDeath');
        }
        this.background.setScale(2.8);

        this.input.on('pointerdown',()=>{
            this.background = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'credits');
            if(this.reloadOnNextClick == false){
                this.reloadOnNextClick = true;
            }else{
                location.reload();
            }
        })
    }
    update(){

    }
}