import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import * as React from "react";
import background from "./sprites/background.png";
import fenceBottom from "./sprites/fence-bottom.png";
import fenceLeft from "./sprites/fence-left.png";
import fenceRight from "./sprites/fence-right.png";
import fenceTop from "./sprites/fence-top.png";
import postBottomLeft from "./sprites/post-bottom-left.png";
import postBottomRight from "./sprites/post-bottom-right.png";
import postTopLeft from "./sprites/post-top-left.png";
import postTopRight from "./sprites/post-top-right.png";
import snakeSkin from "./sprites/snake-skin.png";

let k;
const block_size = 20;

const directions = {
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	RIGHT: "right",
};

let current_direction = directions.RIGHT;
let run_action = false;
let snake_length = 3;
let snake_body = [];
let food = null;

function respawn_food(k) {
	let new_pos = k.rand(k.vec2(1, 1), k.vec2(13, 13));
	new_pos.x = Math.floor(new_pos.x);
	new_pos.y = Math.floor(new_pos.y);
	new_pos = new_pos.scale(block_size);

	if (food) {
		k.destroy(food);
	}
	food = k.add([
		k.rect(block_size, block_size),
		k.color(0, 255, 0),
		k.pos(new_pos),
		k.area(),
		"food",
	]);
}

function respawn_snake(k) {
	k.destroyAll("snake");

	snake_body = [];
	snake_length = 3;

	for (let i = 1; i <= snake_length; i++) {
		snake_body.push(
			k.add([
				k.sprite("snake-skin"),
				k.pos(block_size, block_size * i),
				k.area(),
				"snake",
			])
		);
	}
	current_direction = directions.RIGHT;
}

function respawn_all(k) {
	run_action = false;
	k.wait(0.5, function () {
		respawn_snake(k);
		respawn_food(k);
		run_action = true;
	});
}

const LoadGame = (k) => {
	k.loadSprite("background", background);
	k.loadSprite("fence-bottom", fenceBottom);
	k.loadSprite("fence-left", fenceLeft);
	k.loadSprite("fence-right", fenceRight);
	k.loadSprite("fence-top", fenceTop);
	k.loadSprite("post-bottom-left", postBottomLeft);
	k.loadSprite("post-bottom-right", postBottomRight);
	k.loadSprite("post-top-left", postTopLeft);
	k.loadSprite("post-top-right", postTopRight);
	k.loadSprite("snake-skin", snakeSkin);

	const map = k.addLevel(
		[
			"1tttttttttttt2",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"l            r ",
			"3bbbbbbbbbbbb4",
		],
		{
			width: block_size,
			height: block_size,
			pos: k.vec2(0, 0),
			t: () => [k.sprite("fence-top"), k.area(), "wall"],
			b: () => [k.sprite("fence-bottom"), k.area(), "wall"],
			l: () => [k.sprite("fence-left"), k.area(), "wall"],
			r: () => [k.sprite("fence-right"), k.area(), "wall"],
			1: () => [k.sprite("post-top-left"), k.area(), "wall"],
			2: () => [k.sprite("post-top-right"), k.area(), "wall"],
			3: () => [k.sprite("post-bottom-left"), k.area(), "wall"],
			4: () => [k.sprite("post-bottom-right"), k.area(), "wall"],
		}
	);

	respawn_all(k);
	k.onKeyPress("up", () => {
		if (current_direction != directions.DOWN) {
			current_direction = directions.UP;
		}
	});

	k.onKeyPress("down", () => {
		if (current_direction != directions.UP) {
			current_direction = directions.DOWN;
		}
	});

	k.onKeyPress("left", () => {
		if (current_direction != directions.RIGHT) {
			current_direction = directions.LEFT;
		}
	});

	k.onKeyPress("right", () => {
		if (current_direction != directions.LEFT) {
			current_direction = directions.RIGHT;
		}
	});

	let move_delay = 0.2;
	let timer = 0;
	k.onUpdate(() => {
		if (!run_action) return;
		timer += k.dt();
		if (timer < move_delay) return;
		timer = 0;

		let move_x = 0;
		let move_y = 0;

		switch (current_direction) {
			case directions.DOWN:
				move_x = 0;
				move_y = block_size;
				break;
			case directions.UP:
				move_x = 0;
				move_y = -1 * block_size;
				break;
			case directions.LEFT:
				move_x = -1 * block_size;
				move_y = 0;
				break;
			case directions.RIGHT:
				move_x = block_size;
				move_y = 0;
				break;
		}

		// Get the last element (the snake head)
		let snake_head = snake_body[snake_body.length - 1];

		snake_body.push(
			k.add([
				k.sprite("snake-skin"),
				k.pos(snake_head.pos.x + move_x, snake_head.pos.y + move_y),
				k.area(),
				"snake",
			])
		);

		if (snake_body.length > snake_length) {
			let tail = snake_body.shift(); // Remove the last of the tail
			k.destroy(tail);
		}
	});

	k.onCollide("snake", "food", (s, f) => {
		snake_length++;
		respawn_food(k);
	});

	k.onCollide("snake", "wall", (s, w) => {
		run_action = false;
		k.shake(12);
		respawn_all(k);
	});

	k.onCollide("snake", "snake", (s, t) => {
		run_action = false;
		k.shake(12);
		respawn_all(k);
	});

	k.layers(["background", "game"], "game");

	k.add([k.sprite("background"), k.layer("background")]);
};

const Snake = () => {
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

export default Snake;
