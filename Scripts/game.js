/** @type {Phaser.Core.Config} */
const config = {
  width:800,
  height:600,
  scene:[TitleScene,
    Field1
  ],dom: {
  createContainer: true
},
  parent:"html-holder",
  physics:{
    default:'arcade'
  }
}

let game = new Phaser.Game(config);

