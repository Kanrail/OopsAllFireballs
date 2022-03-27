class Animations extends Phaser.Scene{
    constructor(){
        super("Animations");
    }
    preload(){
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
    }
    create(){
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
        //Player Attack
        this.anims.create({
            key:"fireball",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("fireball",{start:0,end:3}),
            repeat:-1
        });

        //Soul Animation
        this.anims.create({
            key:"soul",
            frameRate: 10,
            frames:this.anims.generateFrameNumbers("currency",{start:0,end:5}),
            repeat:-1
        });

        this.scene.start("Field1");
    }
    update(){

    }
}