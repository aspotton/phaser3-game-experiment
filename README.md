# phaser3-game-experiment

Small experiment using the Phaser 3 game engine to build a single-player platformer game as described here:
https://mozdevs.github.io/html5-games-workshop/en/guides/platformer/start-here/

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
