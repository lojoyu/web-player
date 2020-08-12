//let Player = require("../dist/index.min.js");
//let Player = require("../src/index.js");
//import Player, {PlayerUI} from "../dist/index.min";
import Player, {PlayerUI} from "../src/index";
import audioFile from './test.mp3';
import ballFile from './ball.mp3';
import $ from 'jquery';
//import {Player} from 'tone';
console.log(audioFile);


// const p1 = new Player(ballFile).toMaster();
// p1.autostart = true;

let player = new Player(audioFile, ()=>{
    console.log('yo', player.duration, player.loaded);
    playerUI.setMax(player.duration);
    //player.play();
});

let changeState = (e) => {
    console.log('changeState', e);
    if (e.state == 'play')
        player.play(e.now);
    else player.pause();
};

let playerUI = new PlayerUI('player', 'container', null, {songname: 'test', second: true, range: true, callback: changeState});



