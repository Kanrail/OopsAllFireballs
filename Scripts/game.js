/** @type {Phaser.Core.Config} */
//Application Name: Oops All Fireballs
//Authors: Daniel Bowen, Cat, Gabriel Bentley
//Creation Date: 3/27/2022
//Engine: Phaser 3
//Music: Itro and Tobu - Cloud 9 [NCS Release] (https://www.youtube.com/watch?v=VtKbiyyVZks)
//       Noah Giesler - sky demon boss theme (https://www.youtube.com/watch?v=gawSMbm5_2I)
//Assets: All art assets custom made
//        SFX: https://www.zapsplat.com/music/cartoon-slime-bubble-5/
//             https://www.zapsplat.com/music/8bit-medium-explosion-bomb-boom-or-blast-cannon-retro-old-school-classic-cartoon/
//Description:Simple top-down adventure game where you're trying to kill slimes to power up enough to defeat the boss.

const config = {
  width:800,
  height:600,
  scene:[TitleScene,
    Animations,
    Field1,
    DeathScreen
  ],dom: {
  createContainer: true
},
  parent:"html-holder",
  physics:{
    default:'arcade',
    arcade:{
      //debug:true
    }
  }
}

let game = new Phaser.Game(config);
let playerDeath = null;

