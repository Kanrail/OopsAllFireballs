/** @type {Phaser.Scene} */
class Field1 extends Phaser.Scene{
    constructor(){
        super("Field1");
        this.player = null;
        this.playfield = null;

        this.fireballCooldown = 500;
        this.lastFireball = Date.now();
    }
    preload(){
        this.load.image('playfield','Assets/Environment/PlayField.png');
        this.load.image('player','Assets/Player/Player_Idle_1.png');
        this.load.spritesheet('fireball','Assets/Player/FireBall_Attack.png',{
            frameWidth:100,
            frameHeight:100
        })
    }

    create(){
        this.playfield = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'playfield');

        //Player movement
        this.player = this.physics.add.sprite(400,300,'player');
        this.player.setScale(.5);

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

        //Player Attack
        this.anims.create({
            key:"fireball",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("fireball",{start:0,end:3}),
            repeat:-1
        });

        this.input.on('pointerdown', (pointer)=>{
            var touchX = pointer.x;
            var touchY = pointer.y;
            var angleFromPlayer = Phaser.Math.Angle.Between(touchX,touchY,this.player.x, this.player.y);

            console.log(angleFromPlayer);
            if(this.lastFireball + this.fireballCooldown < Date.now()){
                this.lastFireball = Date.now();
                var fireball = this.physics.add.sprite(this.player.x,this.player.y,'fireballSet')
                fireball.setScale(.5);
                fireball.setAngle(Phaser.Math.RadToDeg(angleFromPlayer));
                this.physics.moveTo(fireball,touchX,touchY,100);
                fireball.anims.play('fireball');

                let fInterval = setInterval(()=>{
                    if(Math.abs(fireball.x - touchX) <= 20 && Math.abs(fireball.y - touchY) <= 200){
                        var explosion = this.add.circle(fireball.x,fireball.y,80,0xFF0000);
                        this.tweens.add({
                            targets:explosion,
                            duration: 1000,
                            delay:0,
                            alpha:0,
                            repeat:0,
                            yoyo:false,
                            onComplete: ()=>{
                                explosion.destroy();
                            }
                        })
                        fireball.destroy();
                        fInterval = clearInterval(fInterval);
                    }
                    console.log('Still going');
                },50)


            }
            else{
                console.log('Not Firing')
            }
        })
    }

    update(){
        
    }
}