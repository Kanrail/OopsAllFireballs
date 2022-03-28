/** @type {Phaser.Scene} */
class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, angle){
        super(scene, x, y, angle, 'bullet');
    }

    fire(x, y, angle){
        this.body.reset(x,y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocity(Math.cos(angle)*100,Math.sin(angle)*100);
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        if(this.y <= -10 || this.y >= 610 || this.x <= -10 || this.x >= 810){
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
class Bullets extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 13,
            key: 'bossBullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet(x, y, angle){
        let bullet = this.getFirstDead(false);

        if(bullet){
            bullet.fire(x, y, angle);
        }
    }
}
class Field1 extends Phaser.Scene{
    constructor(){
        super("Field1");
        this.player = null;
        this.playerHealth = 100;
        this.playerHealthNamePlate = null;
        this.playerIdle = 0;
        this.playerCurrency = 0;
        this.playerX = null;
        this.playerY = null;
        this.playerDamageQueue = [];
        playerDeath = null;
        this.buyMenu = null;

        this.fireballRadius = 100;
        this.fireballDamage = 10;
        this.fireballSpeed = 10;
        this.fireballExplosion = null;

        this.playfield = null;
        this.backgroundMusic = null;
        this.tubaman = null;
        this.tubaman_blurb = null;
        this.enemies = [];
        this.boss = null;
        this.slimeGroup = null;
        this.souls = [];
        this.terrain = [];
        this.fieldNum = 0;
        this.fieldEntryDirection = null;

        this.fireballCooldown = 500;
        this.lastFireball = Date.now();

        this.debug = null;
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
        });
        this.load.spritesheet('tubaman','Assets/EnemyTuba/tubaman_spritesheet.png',{
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('cube','Assets/EnemySlime/cube_spritesheet.png',{
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('boss','Assets/Boss/boss_spritesheet.png',{
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.image('bossBullet','Assets/Fireball_Start_Button.png',{

        });
        this.load.image('buyMenuBox',"Assets/buyMenu.png");
        this.load.image('buyButton',"Assets/buyButton.png");

        //Load sounds
        this.load.audio('slimeAttack','Assets/SFX/Enemy_Slime/zapsplat_cartoon_slime_bubble_005_48933.mp3')
        this.load.audio('explosion','Assets/SFX/FireBall/esm_8bit_explosion_medium_bomb_boom_blast_cannon_retro_old_school_classic_cartoon.mp3')
        this.load.audio('bossTheme', 'Assets/SFX/Music/sky_demon_boss_theme.mp3');
        this.load.audio('backgroundMusic','Assets/SFX/Music/itro_tobu_cloud_9_ncs_release.mp3');
    }
    //This method from a tutorial (https://phaser.io/examples/v3/view/game-objects/text/speech-bubble)
    createSpeechBubble(x, y, width ,height ,quote){
        var bubbleWidth = width;
        var bubbleHeight = height;
        var bubblePadding = 10;
        var arrowHeight = bubbleHeight / 4;
    
        var bubble = this.add.graphics({ x: x, y: y });
    
        //  Bubble shadow
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);
    
        //  Bubble color
        bubble.fillStyle(0xffffff, 1);
    
        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);
    
        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    
        //  Calculate arrow coordinates
        var point1X = Math.floor(bubbleWidth / 7);
        var point1Y = bubbleHeight;
        var point2X = Math.floor((bubbleWidth / 7) * 2);
        var point2Y = bubbleHeight;
        var point3X = Math.floor(bubbleWidth / 7);
        var point3Y = Math.floor(bubbleHeight + arrowHeight);
    
        //  Bubble arrow shadow
        bubble.lineStyle(4, 0x222222, 0.5);
        bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);
    
        //  Bubble arrow fill
        bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        bubble.lineStyle(2, 0x565656, 1);
        bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        bubble.lineBetween(point1X, point1Y, point3X, point3Y);
    
        var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } }).setScale(.8);
    
        var b = content.getBounds();
    
        content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
        return[bubble,content];
    }
    getRandomInt(max){
        return Math.floor(Math.random() * max);
    }
    getRandomDirection(){
        return Math.random() * 2*Math.PI;
    }
    randomLocationAwayFromPlayer(){
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
        if(this.playerDamageQueue.length == 0){
            this.playerDamageQueue.push("occupied");
            // console.log('Player took '+damage+' damage')
            // console.log('Player is at '+this.playerHealth + ' health')
            // console.log('Player is at ('+this.player.x+", "+this.player.y+")")
            this.playerHealth -= damage;
            this.player.anims.play('player_hurt');
            if(this.playerHealth <= 0){
                //Player dies
                playerDeath = monsterType;
                this.scene.start("DeathScreen");
                this.scene.stop("Field1");
            }
            this.playerDamageQueue.pop();
        }
    }
    setPlayerHealthString(){
        var phString = this.playerHealth.toString();
        var digits = this.playerHealth.toString().length;
        for(var i = 0; i < digits-3; i++){
            spaces += " ";
        }
        if(this.playerHealthNamePlate == null){
            this.playerHealthNamePlate = this.add.text(this.player.x-30,this.player.y-50,
                " Eyeris \n("+phString+" HP)").setScale(.7);
        }else{
            this.playerHealthNamePlate.setText(" Eyeris \n("+phString+" HP)").setPosition(this.player.x-30,this.player.y-50);
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
        this.physics.add.overlap(this.player,soul,()=>{
            this.playerCurrency += 1;
            soul.destroy();
        });
        this.souls.push(soul);
    }

    createRandomRocks(num){
        for(var i = 0; i < num; i++){
            var rockType = this.getRandomInt(2)+1;
            rockType = rockType == 3 ? 2 : rockType;
            var loc = this.randomLocationAwayFromPlayer();
            var rock = this.physics.add.sprite(loc[0],loc[1],'rock'+rockType)
            .setScale(Math.random())
            .setBounce(0)
            .setImmovable(true);
            this.terrain.push(rock);
        }
    }
    createRandomTrees(num){
        for(var i = 0; i < num; i++){
            var treeType = this.getRandomInt(2)+1;
            treeType = treeType == 3 ? 2 : treeType;
            var loc = this.randomLocationAwayFromPlayer();
            var tree = this.physics.add.sprite(loc[0],loc[1],'tree'+treeType)
            .setScale(Math.random())
            .setBounce(0)
            .setImmovable(true);
            this.terrain.push(tree);
        }
    }
    createSmallSlime(i){
        var spawnLoc = this.randomLocationAwayFromPlayer();
        var newSmallSlime = {
            entity:this.physics.add.sprite(spawnLoc[0],spawnLoc[1],'smallSlime').setScale(.5),
            name:"smallSlime"+i,
            x:spawnLoc[0],
            y:spawnLoc[1],
            health:40,
            speed:15,
            aggroRadius:80,
            timeSinceLastAction:0,
            attackType:'contact',
            attackDamage:5,
            attackSound: this.sound.add("slimeAttack"),
            enemyType:'smallSlime'
        }
        
        this.physics.add.collider(this.player,newSmallSlime.entity,()=>{
            this.damagePlayer('smallSlime',newSmallSlime.attackDamage);
            newSmallSlime.attackSound.play();
            this.player.setVelocity(0,0);
            let angle = Phaser.Math.Angle.BetweenPoints(this.player, newSmallSlime.entity);
            newSmallSlime.entity.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
        })
        newSmallSlime.entity.setCollideWorldBounds(true);
        this.enemies.push(newSmallSlime);

        this.time.addEvent({
            delay: 500,
            callback: ()=>{
                newSmallSlime.entity.body.setSize(60,38);
                newSmallSlime.entity.body.offset.y = 60;
                
            },
            callbackScope: this,
            loop: false
        });
    }
    createCubeSlime(i){
        var spawnLoc = this.randomLocationAwayFromPlayer();
        var newCubeSlime = {
            entity:this.physics.add.sprite(spawnLoc[0],spawnLoc[1],'cube').setScale(.8),
            name:"cube"+i,
            x:spawnLoc[0],
            y:spawnLoc[1],
            health:120,
            speed:20,
            aggroRadius:160,
            timeSinceLastAction:0,
            attackType:'contact',
            attackDamage:10,
            attackSound: this.sound.add("slimeAttack"),
            enemyType:'cube'
        }
        console.log('spawn cube')
        this.physics.add.collider(this.player,newCubeSlime.entity,()=>{
            this.damagePlayer('cube',newCubeSlime.attackDamage);
            newCubeSlime.attackSound.play();
            this.player.setVelocity(0,0);
            let angle = Phaser.Math.Angle.BetweenPoints(this.player, newCubeSlime.entity);
            newCubeSlime.entity.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
        })
        newCubeSlime.entity.anims.play('cube_idle');
        newCubeSlime.entity.setCollideWorldBounds(true);
        this.enemies.push(newCubeSlime);

        this.time.addEvent({
            delay: 500,
            callback: ()=>{
                // newCubeSlime.entity.body.setSize(60,38);
                // newCubeSlime.entity.body.offset.y = 60;
                
            },
            callbackScope: this,
            loop: false
        });
    }
    buildStartingZone(){
        //Setup summoning stones
        this.terrain.push(this.physics.add.sprite(400,283,'rock1'));
        this.terrain.push(this.physics.add.sprite(273,400,'rock1'));
        this.terrain.push(this.physics.add.sprite(527,400,'rock1'));
        this.terrain.push(this.physics.add.sprite(320,525,'rock1'));
        this.terrain.push(this.physics.add.sprite(480,525,'rock1'));
        
        //Setup tuba summoner
        this.tubaman = this.physics.add.sprite(400,320,'tubaman').setScale(.6);
        this.tubaman.anims.play('tubaman_idle');

        this.tubaman_blurb = this.createSpeechBubble(350,130,350,140,"Welcome, I have summoned you here to aid this world. "+
        "Please help us mighty wizard!\n[Movement Controls:'W','A','S','D']\n"+
        "[Shoot Fireball: 'L-Mouse Click;]\n [Open Upgrade Menu: 'B']");
    }

    buildBossArena(){
        //Setup summoning stones
        this.terrain.push(this.physics.add.sprite(400,83,'rock1'));
        this.terrain.push(this.physics.add.sprite(273,200,'rock1'));
        this.terrain.push(this.physics.add.sprite(527,200,'rock1'));
        this.terrain.push(this.physics.add.sprite(320,325,'rock1'));
        this.terrain.push(this.physics.add.sprite(480,325,'rock1'));

        //Setup boss
        this.boss = {
            entity:this.physics.add.sprite(400,200,'boss'),
            health: 300,
            bossBullets: [],
            timeSinceLastAction: 0,
            name:"boss",
            x:400,
            y:200,
            speed:20,
            aggroRadius:900,
            attackType:'bullet',
            attackDamage:10,
            enemyType:'boss',
            themeMusic: this.sound.add('bossTheme',{volume:.2,loop:true})
        };
        this.enemies.push(this.boss);
        this.boss.entity.anims.play('boss_idle');

        this.backgroundMusic.stop();
        this.boss.themeMusic.play()
        this.boss.bossBullets = new Bullets(this);
        this.boss.bossBullets.children.iterateLocal('setScale',.5);
        this.boss.bossBullets.children.iterateLocal('setSize',50,50,25);

        this.physics.add.overlap(this.player, this.boss.bossBullets, ()=>{
            this.damagePlayer('boss',5);
        })
    }
    advanceArea(){
        if(this.fieldNum === 0){
            this.buildStartingZone();
        }
        else if(this.fieldNum < 3 && this.fieldNum > 0){
            //Generate Terrain
            var rockNum = this.getRandomInt(6)+6;
            this.createRandomRocks(rockNum);

            var treeNum = this.getRandomInt(4)+4;
            this.createRandomTrees(treeNum);

            //Generate Enemies
            var smallSlimeNum = this.getRandomInt(7)+5;
            for(var i = 0; i < smallSlimeNum; i++){
                this.createSmallSlime(i);
            }
            var cubeNum = this.getRandomInt(6);
            for(var i = 0; i < cubeNum; i++){
                this.createCubeSlime(i);
            }
        }else{
            this.buildBossArena();
        }
    }
    cleanupArea(){
        //Cleanup terrain
        for(var i = 0; i < this.terrain.length; i++){
            try{
                this.terrain[i].destroy();
            }catch{

            }
        }
        this.terrain = [];

        //Cleanup enemies
        for(var i = 0; i < this.enemies.length; i++){
            try{
                this.enemies[i].entity.destroy();
            }catch{
                
            }
        }
        this.enemies = [];

        //Cleanup souls
        for(var i = 0; i < this.souls.length; i++){
            try{
                this.souls[i].destroy();
            }catch{
                
            }
        }
        this.souls = [];

        //Cleanup tubaman
        try{
            this.tubaman.destroy();
            this.tubaman_blurb[0].destroy();
            this.tubaman_blurb[1].destroy();
        }catch{

        }
    }

    openBuyMenu(){
        var border = this.add.image(640,515,'buyMenuBox');
        border.setInteractive();
        var title = this.add.text(600,445,"Buy Menu",{color:'#000'});
        var currentRadius = this.add.text(500,470,"Current Radius: "+this.fireballRadius,{color:'#000'});
        var currentDamage = this.add.text(500,490,"Current Damage: "+this.fireballDamage,{color:'#000'});
        var currentSpeed = this.add.text(500,510, "Current Speed : "+this.fireballSpeed,{color:'#000'});
        var currentSouls = this.add.text(695,470,"Souls:"+this.playerCurrency,{color:'#000'});
        var damageAndRadIncreaseButton = this.add.image(617,560,'buyButton').setScale(.4);
        damageAndRadIncreaseButton.setInteractive();
        var damageRadIncrease = this.add.text(500,550,"+ Damage & Rad\n  Cost: 3",{color:'#000'}).setScale(.65);
        var radiusDecreaseButton = this.add.image(760,560,'buyButton').setScale(.4);
        radiusDecreaseButton.setInteractive();
        var radDecrease = this.add.text(675,550,"- Radius\n  Cost: 9",{color:'#000'}).setScale(.65);

        damageAndRadIncreaseButton.on('pointerdown',()=>{
            if(this.playerCurrency >= 3){
                this.playerCurrency -= 3;
                this.fireballDamage += 5;
                this.fireballRadius += 10;
                this.updateBuyMenu();
            }
        });
        radiusDecreaseButton.on('pointerdown',()=>{
            if(this.playerCurrency >= 9){
                this.playerCurrency -= 9;
                this.fireballRadius -= 10;
                this.updateBuyMenu();
            }
        })

        this.buyMenu = [border,title,currentRadius,currentDamage,currentSpeed,currentSouls,damageAndRadIncreaseButton,
                        damageRadIncrease,radiusDecreaseButton,radDecrease,title];

    }

    updateBuyMenu(){
        if(this.buyMenu != null){
            this.buyMenu[2].setText("Current Radius: "+this.fireballRadius);
            this.buyMenu[3].setText("Current Damage: "+this.fireballDamage);
            this.buyMenu[5].setText("Souls: "+this.playerCurrency);
            this.buyMenu[4].setText("Current Speed : "+this.fireballSpeed);
        }
    }

    closeBuyMenu(){
        if(this.buyMenu != null){
            for(var i = 0; i < this.buyMenu.length; i++){
                this.buyMenu[i].destroy();
            }
            this.buyMenu = null;
        }
    }

    create(){
        this.playfield = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,'playfield').setScale(2);

        //Sounds Initalize
        this.fireballExplosion = this.sound.add('explosion',{volume:.5});
        this.backgroundMusic = this.sound.add('backgroundMusic',{volume:.01,loop:true});
        this.backgroundMusic.play();
        //Player initialize
        this.player = this.physics.add.sprite(400,470,'player').setScale(.5);
        this.player.setFriction(1,1)
        this.time.addEvent({
            delay: 500,
            callback: ()=>{
                this.player.setSize(50,90);
            },
            callbackScope: this,
            loop: false
        });
        this.setPlayerHealthString();

        //Setup world collide and area advancement
        this.player.setCollideWorldBounds(true);

        //Place player in starting zone
        this.buildStartingZone();

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

        //Buy menu
        this.input.keyboard.on('keydown-B',()=>{
            if(this.buyMenu == null){
                this.openBuyMenu();
            }else{
                this.closeBuyMenu();
            }
        })

        this.input.on('pointerdown', (pointer)=>{
            var touchX = pointer.x;
            var touchY = pointer.y;
            //console.log(touchX+", "+touchY);
            var angleFromPlayer = Phaser.Math.Angle.Between(touchX,touchY,this.player.x, this.player.y);

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
                    if(Math.abs(fireball.x - touchX) <= 20 && Math.abs(fireball.y - touchY) <= 20){
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
                        this.fireballExplosion.play();
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
                },50)


            }
            else{

            }
        })
    }

    update(){
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }
        this.updateBuyMenu();
        //Check Player Idle
        if(this.playerX == this.player.x && this.playerY == this.player.y){
            this.playerIdle+=1;
            if(this.playerIdle == 150){
                this.player.anims.play('player_walk_south');
                this.playerIdle = 0;
            }
        }else{
            this.playerX = this.player.x;
            this.playerY = this.player.y;
        }
        //Check player at top border, advance if so
        if(this.boss == null){
            if(this.player.y === 22.5){
                this.fieldNum += 1;
                this.player.setPosition(this.player.x,550);
                this.cleanupArea();
                this.advanceArea();
            }
            if(this.player.y === 577.5 && this.fieldNum > 0){
                this.fieldNum -= 1;
                this.player.setPosition(this.player.x,100);
                this.cleanupArea();
                this.advanceArea();
            }
        }

        //Cycle enemy actions
        for(var i = 0; i < this.enemies.length; i++){
            var enemy = this.enemies[i];
            enemy.x = enemy.entity.x;
            enemy.y = enemy.entity.y;
            var moveToPlayer = false;
            if(enemy.health <= 0){
                this.createSoul(enemy.x,enemy.y);
                if(enemy.enemyType == 'cube'){
                    for(var j = 0; j < 4; j++){
                        this.createSoul(enemy.x,enemy.y);
                    }
                }
                enemy.entity.destroy();
                this.enemies.splice(i,1);
                continue;
            }
            if(Phaser.Math.Distance.BetweenPoints(this.player, enemy.entity) < enemy.aggroRadius){
                moveToPlayer = true;
            }
            if(enemy.enemyType == 'smallSlime' || enemy.enemyType == 'cube'){
                if(moveToPlayer){
                    enemy.timeSinceLastAction = 0;
                    this.physics.accelerateTo(enemy.entity,this.player.x,this.player.y,enemy.speed);
                    enemy.entity.body.setMaxSpeed(enemy.speed);
                    if(this.player.x >= enemy.x){
                        if(enemy.enemyType == 'smallSlime'){
                            enemy.entity.anims.play('smallSlime_left');
                        }
                    }else{
                        if(enemy.enemyType == 'smallSlime'){
                            enemy.entity.anims.play('smallSlime_right');
                        }
                    }
                }else{
                    if(enemy.timeSinceLastAction >= 100){
                        //move in random direction
                        var xDirection = Math.cos(this.getRandomDirection());
                        if(xDirection >= 0){
                            if(enemy.enemyType == 'smallSlime'){
                                enemy.entity.anims.play('smallSlime_right');
                            }
                        }else{
                            if(enemy.enemyType == 'smallSlime'){
                                enemy.entity.anims.play('smallSlime_left');
                            }
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
        if(this.boss != null){
            if(this.boss.health <= 0){
                //player wins
                console.log('player win');
                this.boss.themeMusic.stop();
                this.backgroundMusic.play();
                this.scene.start("DeathScreen");
                this.scene.stop("Field1");
            }else{
                if(this.boss.timeSinceLastAction == 10){
                    this.boss.timeSinceLastAction = 0;
                    var angleToPlayer = Phaser.Math.Angle.Between(this.boss.entity.x, this.boss.entity.y,
                                                                    this.player.x, this.player.y,);
                    this.boss.bossBullets.fireBullet(this.boss.entity.x,this.boss.entity.y,angleToPlayer);
                }else{
                    this.boss.timeSinceLastAction += 1;
                }
            }
        }
        this.setPlayerHealthString();
    }
}