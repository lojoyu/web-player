# Player

This is a player using Tone.js.

(Still in Development)


## How to use

### Pre-Install

The package use `jquery` and `tone.js`.

```shell
npm install --save jquery
```

```shell
npm install --save tone
```

### Import

```javascript
import Player, {PlayerUI} from '@zonesouncreative/web-player'
```

### Usage

First, new an instance of Player with soundfile url and loaded callback function(optional).

```js
let loadCallback = ()=> {
    console.log('load!');
}

let player = new Player(url, loadCallback);
```

**PLAY**
play the soundfile

```js
//play the sound
player.play();

//or play the sound from specific offset(e.g. from 10sec)
player.play(10);
```

**PAUSE**

```js
player.pause();
```