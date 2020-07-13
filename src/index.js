import $ from 'jquery';
import Tone from 'tone';

export default class Player{

    constructor(url, loadCallback) {
        this.loaded = false;
        this.current = 0;
        this.startTime = -1;
        // this.player = new Tone.Player(url, this.loaded.bind(this)).toMaster();
        this.player = new Tone.Player(url, this.loadDone.bind(this)).toMaster();
        this.loadCallback = loadCallback;
        // this.player.onstop = ()=> {
        //     console.log('reach stop!!!');
        // }
        //console.log(this.player);
        //this.previous = 0;
    }
    
    loadDone() {
        //console.log('loaded');
        this.loaded = true;
        this.duration = this.player.buffer.duration;
        if (this.loadCallback) this.loadCallback();
    }
    
    play(from=this.current) {
        if (!this.loaded) return;
        this.current = from;
        this.startTime = Date.now();
        //console.log('play', this.player);
        this.player.start(0, from);
        //this.player.start(0, 10);
    }

    pause() {
        if (!this.loaded) return;
        this.current += (Date.now() - this.startTime)/1000;
        //this.previous = 
        this.player.stop();
    }
}

export class PlayerUI {
    //<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    //<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    constructor(id, parentId, getTime, config) {
        this.id = id;
        this.parent = $(`#${parentId}`);
        this.configFill(config);
        this.callback = this.config.callback;
        if (getTime) this.getTime = getTime;
        this.createUI();
        this.offsetTime = 0;
    }

    configFill(config) {
        let temp = {
            songname: false,
            second: true,
            range: true,
            callback: null,
            usePlay: true
        }
        //console.log(config);
        this.config = {...temp, ...config};
        //console.log(this.config);
    }

    createUI() {
        let content = `<i id="${this.id}" class="fa fa-play song player-button" state="play"></i>`;
        if (this.config.songname) content += `<span for="${this.id}" class="player-songname"> ${this.config.songname} </span>`;
        if (this.config.second) content += `<span id="${this.id}-sec" class="player-second"> 00:00 </span>`;
        if (this.config.range) content += `<input id="${this.id}-range" type="range" class="custom-range player-range" value="0">`;

        this.parent.append(`<div>${content}</div>`);
        if (this.config.range) {
            this.range = $(`#${this.id}-range`);
            this.range.on('input', this.rangeInput.bind(this));
            this.range.change(this.rangeChange.bind(this));
        }
        if (this.config.second) this.sec = $(`#${this.id}-sec`);
        this.btn = $(`#${this.id}`);
        this.setClick();
        this.restart();
    }

    play(from = this.offsetTime) {
        
        this.offsetTime = from;
        //console.log('play', this.offsetTime, from);
        this.startTime = Date.now();
        this.btn.removeClass('fa-play');
        this.btn.addClass('fa-pause');
        this.btn.attr('state', 'pause');
        this.activeInterval();
    }

    pause() {
        //console.log('pause');
        this.offsetTime += (Date.now() - this.startTime)/1000;
        this.btn.removeClass('fa-pause');
        this.btn.addClass('fa-play');
        this.btn.attr('state', 'play');
        this.disableInterval(); 
    }

    restart() {
        this.pause();
        this.offsetTime = 0;
        this.range.val(0);
        this.sec.html('00:00');
        this.btn.attr('player-disable', false);
    }

    setMax(duration) {
        this.range.attr('max', duration);
    }

    activeStart() {
        this.btn.attr('player-disable', false);
        this.btn.attr('style', 'color: black');
        //this.btn.removeClass('player-disable');
    }
    
    inactiveStart() {
        //$('#'+id).prop("disabled", false);
        this.btn.attr('player-disable', true);
        this.btn.attr('style', 'color: gray');
        //this.btn.addClass('player-disable');
    }

    activeInterval() {
        this.interval = setInterval(this.setRangewithAudio.bind(this), 1000);
    }

    disableInterval() {
        if(this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
    }

    setClick() {
        this.btn.click(this.clickTrigger.bind(this));
    }
      
    clickTrigger() {
        
        if (this.btn.attr('player-disable') == 'true') return;
        //console.log('click!'); 
        let state = this.btn.attr('state');
        let now = this.range.val();
        
        if (this.callback) this.callback({id:this.id, state:state, now:now});

        if (this.config.usePlay) {
            //console.log('click state', state);
            if (state == 'play') this.play();
            else if (state == 'pause') this.pause();
        }
        //console.log({id:this.id, state:state, now:now});
        
    }

    setRangewithAudio() {
        let t = this.getTime();
        if (t > this.range.attr('max')) {
            this.restart();
            return;
        }
        this.range.val(t);
        this.sec.html(this.formatTime(Math.floor(t)));
    }

    getTime() {
        return (Date.now() - this.startTime)/1000 + this.offsetTime;
    }

    formatTime(seconds) {
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return [m > 9 ? m : '0' + m,  s > 9 ? s : '0' + s]
            .join(':')
    }

    rangeChange() {
        this.offsetTime = parseInt(this.range.val());
        if (this.btn.attr('state') == "pause") { //playing
            //this.play(parseInt(this.range.val()));
            if (this.config.usePlay) this.play();
            if (this.callback) this.callback({id:this.id, state:"play", now:parseInt(this.range.val())});
        }
    }
      
    rangeInput() {
        this.disableInterval();
        this.sec.html(this.formatTime(this.range.val()));
    }
}