/** @type {Phaser.Scene} */
class Field1 extends Phaser.Scene{
    constructor(){
        super("Field1");
        this.player = null;
        this.playerHealth = 100;
        this.playerIdle = 0;
        this.playerX = null;
        this.playerY = null;

        this.fireballRadius = 100;
        this.fireballDamage = 10;
        this.fireballSpeed = 

        this.playfield = null;
        this.enemies = [];
        this.fieldNum = 0;

        this.fireballCooldown = 500;
        this.lastFireball = Date.now();
    }
    preload(){
        this.load.image('playfield','Assets/Environment/PlayField.png');
        this.load.spritesheet('player','Assets/Player/player_spritesheet.png',{
            frameWidth:102,
            frameHeight:102
        });
        this.load.spritesheet('fireball','Assets/Player/FireBall_Attack.png',{
            frameWidth:100,
            frameHeight:100
        });
        this.load.spritesheet('smallSlime','Assets/EnemySlime/small_slime_spritesheet.png',{
            frameWidth: 100,
            frameHeight: 100
        })
    }

    getRandomInt(max){
        return Math.floor(Math.random() * max);
    }
    getRandomDirection(){
        return Math.random() * 2*Math.PI;
    }
    randomLocationAwayFromPlayer(){
        console.log(this.cameras.main.width)
        var locX = this.getRandomInt(this.cameras.main.width);
        var locY = this.getRandomInt(this.cameras.main.height);
        var pixelsFromPlayer = 100;

        while(Math.abs(this.player.x - locX) < pixelsFromPlayer && Math.abs(this.player.y - locY) < pixelsFromPlayer){
            locX = this.getRandomInt(this.cameras.main.width);
            locY = this.getRandomInt(this.cameras.main.height);
        }
        return [locX,locY];
    }
    damagePlayer(monsterType){
        if(this.playerHealth <= 0){

        }
    }

    create(){
        this.playfield = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'playfield');

        //Field check and enemy creation
        if(this.fieldNum == 0){
            //Player initialize
            this.player = this.physics.add.sprite(400,300,'player').setScale(.5);
            this.player.setFriction(1,1)
            this.time.addEvent({
                delay: 1000,
                callback: ()=>{
                    this.player.setSize(50,90);
                },
                callbackScope: this,
                loop: false
            });

            var smallSlimeNum = 1 //Math.random(1,12);
            for(var i = 0; i < smallSlimeNum; i++){
                var spawnLoc = this.randomLocationAwayFromPlayer();
                var newSmallSlime = {
                    entity:this.physics.add.sprite(spawnLoc[0],spawnLoc[1],'smallSlime').setScale(.5),
                    x:spawnLoc[0],
                    y:spawnLoc[1],
                    health:40,
                    speed:15,
                    aggroRadius:80,
                    timeSinceLastAction:0,
                    attackType:'contact',
                    attackDamage:5,
                    enemyType:'smallSlime'
                }

                this.time.addEvent({
                    delay: 1000,
                    callback: ()=>{
                        newSmallSlime.entity.body.setSize(60,38);
                        newSmallSlime.entity.body.offset.y = 60;
                    },
                    callbackScope: this,
                    loop: false
                });
                
                this.physics.add.collider(this.player,newSmallSlime.entity,()=>{
                    this.playerHealth -= newSmallSlime.attackDamage;
                    this.player.setVelocity(0,0);
                    this.player.anims.play('player_hurt')
                    let angle = Phaser.Math.Angle.BetweenPoints(this.player, newSmallSlime.entity);
                    newSmallSlime.entity.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
                })
                this.enemies.push(newSmallSlime);
            }
        }

        //Enemy Animations
        this.anims.create({
            key:"smallSlime_left",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("smallSlime",{frames:[9,10,11,10,9]}),
            repeat:-1
        });
        this.anims.create({
            key:"smallSlime_right",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("smallSlime",{frames:[0,1,2,1,0]}),
            repeat:-1
        });
        this.anims.create({
            key:"smallSlime_left_hurt",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("smallSlime",{frames:[14,15,14]}),
            repeat:-1
        });
        this.anims.create({
            key:"smallSlime_right_hurt",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("smallSlime",{frames:[6,7,6]}),
            repeat:-1
        });

        //Player Animations
        this.anims.create({
            key:"player_walk_south",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("player",{frames:[14,15,16,15,14]}),
            repeat:-1
        });
        this.anims.create({
            key:"player_walk_north",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("player",{frames:[17,18,19,20]}),
            repeat:-1
        });
        this.anims.create({
            key:"player_walk_east",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("player",{frames:[2,3,4,3,2,1,0,1,2]}),
            repeat:-1
        });
        this.anims.create({
            key:"player_walk_west",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("player",{frames:[23,24,25,24,23,22,21,22,23]}),
            repeat:-1
        });
        this.anims.create({
            key:"player_attack_left",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("player",{frames:[6,7,6]}),
            repeat:0
        });
        this.anims.create({
            key:"player_attack_right",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("player",{frames:[8,9,8]}),
            repeat:0
        });
        this.anims.create({
            key:"player_hurt",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("player",{frames:[10,11,12,13,12,11,10]}),
            repeat:0
        })
        this.player.anims.play('player_walk_south');

        //Player Input Events
        this.input.keyboard.on('keydown-W',()=>{
            this.player.setVelocityY(-60);
            if(this.player.anims.currentAnim.key!=='player_walk_north'){
                this.player.anims.play('player_walk_north');
            }
        })
        this.input.keyboard.on('keyup-W',()=>{
            this.player.setVelocityY(0);
        })
        this.input.keyboard.on('keydown-A',()=>{
            this.player.setVelocityX(-60);
            if(this.player.anims.currentAnim.key!=='player_walk_west'){
                this.player.anims.play('player_walk_west');
            }
        })
        this.input.keyboard.on('keyup-A',()=>{
            this.player.setVelocityX(0);
        })
        this.input.keyboard.on('keydown-S',()=>{
            this.player.setVelocityY(60);
            if(this.player.anims.currentAnim.key!=='player_walk_south'){
                this.player.anims.play('player_walk_south');
            }
        })
        this.input.keyboard.on('keyup-S',()=>{
            this.player.setVelocityY(0);
        })
        this.input.keyboard.on('keydown-D',()=>{
            this.player.setVelocityX(60);
            if(this.player.anims.currentAnim.key!=='player_walk_east'){
                this.player.anims.play('player_walk_east');
            }
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

                //player attack animation (direction dependent)
                if(this.player.x >= touchX){
                    //attack left
                    this.player.anims.play('player_attack_left');
                    this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY+'player_attack_left',()=>{
                        //may try to use later
                    })
                }else{
                    //attack right
                    this.player.anims.play('player_attack_right');
                }

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
                        if(Phaser.Math.Distance.Between(this.player.x,this.player.y,touchX,touchY)){

                        }
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
        //Check Player Idle
        if(this.playerX == this.player.x && this.playerY == this.player.y){
            this.playerIdle+=1;
            if(this.playerIdle == 50){
                this.player.anims.play('player_walk_south');
                this.playerIdle = 0;
            }
        }else{
            this.playerX = this.player.x;
            this.playerY = this.player.y;
        }

        //Cycle enemy actions
        for(var i = 0; i < this.enemies.length; i++){
            var enemy = this.enemies[i];
            enemy.x = enemy.entity.x;
            enemy.y = enemy.entity.y;
            var moveToPlayer = false;
            if(Phaser.Math.Distance.BetweenPoints(this.player, enemy.entity) < enemy.aggroRadius){
                moveToPlayer = true;
            }
            if(enemy.enemyType == 'smallSlime'){
                if(moveToPlayer){
                    enemy.timeSinceLastAction = 0;
                    this.physics.accelerateTo(enemy.entity,this.player.x,this.player.y,enemy.speed);
                    enemy.entity.body.setMaxSpeed(enemy.speed);
                    if(this.player.x >= enemy.x){
                        enemy.entity.anims.play('smallSlime_left')
                    }else{
                        enemy.entity.anims.play('smallSlime_right')
                    }
                }else{
                    if(enemy.timeSinceLastAction >= 100){
                        //move in random direction
                        var xDirection = Math.cos(this.getRandomDirection());
                        if(xDirection >= 0){
                            enemy.entity.anims.play('smallSlime_right');
                        }else{
                            enemy.entity.anims.play('smallSlime_left');
                        }
                        enemy.entity.setVelocityX(xDirection*enemy.speed);
                        enemy.entity.setVelocityY(Math.sin(this.getRandomDirection())*enemy.speed);
                        enemy.timeSinceLastAction = 0;
                    }
                    else if(enemy.timeSinceLastAction == 50){
                        enemy.entity.setVelocityX(0);
                        enemy.entity.setVelocityY(0);
                        enemy.timeSinceLastAction+=1;
                    }
                    else{
                        enemy.timeSinceLastAction+=1;
                    }
                }
            }
        }
    }
}