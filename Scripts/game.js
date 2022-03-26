//Application Name: Prism Prison
//Author: Daniel Bowen
//Creation Date: 3/21/2021
//Engine: Phaser 3
//Music: Kontinuum - Aware [NCS Release] (https://www.youtube.com/watch?v=BWdZjZV6bEk)
//Assets: Some custom made, others available copyright free on itch.io Game Assets
//Description:Light refraction puzzle game where object is to get the light beam from starting emitter to the receiving 
//            crystal on the opposite side of the level.

const config = {
  width:640,
  height:480,
  scene:[TitleScene
  ],dom: {
  createContainer: true
},
  parent:"html-holder",
  physics: {
    default: 'matter',
    matter:{
      gravity:{
        
      }
    }
  }
}

let game = new Phaser.Game(config);

