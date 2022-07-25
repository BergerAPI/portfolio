export type Mouse = {
	x: number;
	y: number;

	speedX: number;
	speedY: number;
}

/**
 * Global mouse object
 */
let mouse: Mouse = {
	x: 0,
	y: 0,

	speedX: 0,
	speedY: 0,
};

/**
 * The last time the mouse was updated
 */
let lastTime: number = 0;

export function initializeMouseListeners() {
	document.addEventListener('mousemove', (e) => {
		if (lastTime === 0)
			lastTime = Date.now();

		// speed = distance / time
		// acceleration = speed / time
		const time = Date.now() - lastTime;
		const speed = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)) / time;
		const acceleration = speed / time;

		mouse.x = e.screenX;
		mouse.y = e.screenY;

		mouse.speedX = acceleration;
		mouse.speedY = acceleration;

		lastTime = Date.now();
	});
}

export default mouse;