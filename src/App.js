import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import * as React from "react";
import Snake from "./Snake";
import Flappy from "./Flappy";

const App = () => {
	return (
		<>
			<Snake />
			<Flappy />
		</>
	);
};

export default App;
