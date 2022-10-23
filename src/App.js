import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import * as React from "react";

const PIPE_GAP = 120;
let highScore = 0;
let k;

function producePipes(k) {
	const offset = k.rand(-50, 50);

	k.add([
		k.sprite("pipe"),
		k.pos(k.width(), k.height() / 2 + offset + PIPE_GAP / 2),
		"pipe",
		k.area(),
		{ passed: false },
	]);

	k.add([
		k.sprite("pipe", { flipY: true }),
		k.pos(k.width(), k.height() / 2 + offset - PIPE_GAP / 2),
		k.origin("botleft"),
		"pipe",
		k.area(),
	]);
}

const LoadGame = (k) => {
	k.loadSprite(
		"birdy",
		"https://res.cloudinary.com/sample1105/image/upload/v1664856634/flappy-bird/birdy.png"
	);
	k.loadSprite(
		"bg",
		"https://res.cloudinary.com/sample1105/image/upload/v1664856634/flappy-bird/bg.png"
	);
	k.loadSprite(
		"pipe",
		"https://res.cloudinary.com/sample1105/image/upload/v1664856634/flappy-bird/pipe.png"
	);
	k.loadSound(
		"wooosh",
		"https://res.cloudinary.com/sample1105/video/upload/v1664856634/flappy-bird/wooosh.mp3"
	);

	k.scene("start", () => {
		k.add([
			k.text("Click to start"),
			k.pos(k.vec2(500, 100)),
			k.origin("center"),
			k.color(1, 0, 0),
		]);
		k.onClick(() => k.go("game"));
	});

	k.scene("game", () => {
		k.add([k.sprite("bg", { width: k.width(), height: k.height() })]);
		const player = k.add([
			// list of components
			k.sprite("birdy"),
			k.scale(2),
			k.pos(80, 40),
			k.area(),
			k.body(),
		]);

		k.onKeyPress("space", () => {
			k.play("wooosh");
			player.jump(400);
		});

		k.onUpdate("pipe", (pipe) => {
			pipe.move(-160, 0);

			if (pipe.passed === false && pipe.pos.x < player.pos.x) {
				pipe.passed = true;
				score += 1;
				scoreText.text = score;
			}
		});
		k.loop(1.5, () => {
			producePipes(k);
		});

		let score = 0;
		const scoreText = k.add([k.text(score, { size: 50 })]);

		player.collides("pipe", () => {
			k.go("gameover", score);
		});

		player.onUpdate(() => {
			if (player.pos.y > k.height() + 30 || player.pos.y < -30) {
				k.go("gameover", score);
			}
		});
	});

	k.scene("gameover", (score) => {
		if (score > highScore) {
			highScore = score;
		}

		k.add([
			k.text("gameover!\n" + "score: " + score + "\nhigh score: " + highScore, {
				size: 45,
			}),
		]);

		k.onKeyPress("space", () => {
			k.go("game");
		});
		k.onClick(() => k.go("game"));
	});

	k.go("start");
};

const App = () => {
	// just make sure this is only run once on mount so your game state is not messed up
	React.useEffect(() => {
		k = kaboom({
			// if you don't want to import to the global namespace
			width: window.innerWidth, // width of canvas
			height: window.innerHeight - 5,
			global: false,
			// if you don't want kaboom to create a canvas and insert under document.body
		});
		// write all your kaboom code here
		LoadGame(k);
	}, []);
	return;
};

export default App;
