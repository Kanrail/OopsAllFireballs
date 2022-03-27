/** @type {Phaser.Scene} */
class Field1 extends Phaser.Scene{
    constructor(){
        super("Field1");
        this.player = null;
        this.playerHealth = 100;
        this.playerIdle = 0;
        this.playerCurrency = 0;
        this.playerX = null;
        this.playerY = null;
        playerDeath = null;

        this.fireballRadius = 100;
        this.fireballDamage = 100;
        this.fireballSpeed = 10;

        this.playfield = null;
        this.enemies = [];
        this.souls = [];
        this.fieldNum = 0;

        this.fireballCooldown = 500;
        this.lastFireball = Date.now();
    }
    preload(){
        this.load.image('playfield','Assets/Environment/Environment_Grass_13.png');
        this.load.image('tree1','Assets/Environment/Tree_1.png');
        this.load.image('tree2','Assets/Environment/Tree_2.png');
        this.load.image('rock1','Assets/Environment/Rock_1.png');
        this.load.image('rock2','Assets/Environment/Rock_2.png');
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
        });
        this.load.spritesheet('currency','Assets/Currency/soul_currency_spritesheet.png',{
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
    damagePlayer(monsterType,damage){
        this.playerHealth -= damage;
        this.player.anims.play('player_hurt');
        if(this.playerHealth <= 0){
            //Player dies
            playerDeath = monsterType;
            this.scene.start("DeathScreen");
            this.scene.stop("Field1");
        }
    }
    createSoul(x,y){
        var soul = this.physics.add.sprite(x,y,'currency').setScale(.5);
        this.time.addEvent({
            delay: 500,
            callback: ()=>{
                soul.body.setSize(45,30);
                soul.body.offset.y = 50;
                soul.body.offset.x = 35;
            },
            callbackScope: this,
            loop: false
        });
        soul.anims.play('soul');
        this.physics.add.collider(this.player,soul,()=>{
            this.playerCurrency += 1;
            soul.destroy()
        });
        this.souls.push(soul);
    }

    createRandomRocks(){
        
    }

    create(){
        this.playfield = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'playfield').setScale(2);

        //Field check and enemy creation
        if(this.fieldNum == 0){
            //Player initialize
            this.player = this.physics.add.sprite(400,300,'player').setScale(.5);
            this.player.setFriction(1,1)
            this.time.addEvent({
                delay: 500,
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
                    delay: 500,
                    callback: ()=>{
                        newSmallSlime.entity.body.setSize(60,38);
                        newSmallSlime.entity.body.offset.y = 60;
                    },
                    callbackScope: this,
                    loop: false
                });
                
                this.physics.add.collider(this.player,newSmallSlime.entity,()=>{
                    this.damagePlayer('smallSlime',newSmallSlime.attackDamage);
                    this.player.setVelocity(0,0);
                    let angle = Phaser.Math.Angle.BetweenPoints(this.player, newSmallSlime.entity);
                    newSmallSlime.entity.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
                })
                this.enemies.push(newSmallSlime);
            }
        }

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
                        var explosion = this.add.circle(fireball.x,fireball.y,this.fireballRadius,0xFF0000);
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
                        if(Phaser.Math.Distance.Between(this.player.x,this.player.y,touchX,touchY) < this.fireballRadius){
                            this.damagePlayer('fireball',this.fireballDamage);
                        }
                        for(var i = 0; i < this.enemies.length; i++){
                            var enemy = this.enemies[i];
                            if(Phaser.Math.Distance.Between(enemy.entity.x,enemy.entity.y,touchX,touchY) < this.fireballRadius){
                                enemy.health -= this.fireballDamage;
                            }
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
            if(enemy.health <= 0){
                this.createSoul(enemy.x,enemy.y);
                enemy.entity.destroy();
                this.enemies.pop(enemy);
            }
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