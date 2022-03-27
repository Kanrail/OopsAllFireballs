/** @type {Phaser.Core.Config} */
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
      debug:true
    }
  }
}

let game = new Phaser.Game(config);
let playerDeath = null;

