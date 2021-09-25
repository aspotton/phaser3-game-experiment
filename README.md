# phaser3-game-experiment

Small experiment using the Phaser 3 game engine to build a single-player platformer game as described here:
https://mozdevs.github.io/html5-games-workshop/en/guides/platformer/start-here/

## Notable Differences

* Upgraded the tutorial from Phaser v2.6.2 to Phaser v3.55.2
* I didn't like the idea of using invisible walls in the level just to make an enemy turn around and walk the other way. Added some experimental code that uses regular physics `group` for the ground tiles so I can use collision data to know when an enemy should turn around.
* Use built in Phaser scaling mode to automatically use the maximum amount of screen space but maintain aspect ratio.
* Multiple controls: Arrow keys, W/A/S/D and Spacebar

## Run Locally

Run container and expose the HTTP and UI ports:

* http://localhost:8001 (HTTP server)
* http://localhost:3001 (Browser Sync UI)

```
docker run -it -p 8001:8001 -p 3001:3001 -v $(pwd):/usr/src/app adam:game
```

## Build

```
docker build -t adam:game .
```

### Assets License

As stated in the Mozilla walkthrough, the included game asset files (audio, images) are licensed under a CC0 license.
