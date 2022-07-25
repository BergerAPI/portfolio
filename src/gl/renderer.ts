import * as twgl from 'twgl.js';
import mouse from '../mouse';
import basicFS from './shader/basic.frag';
import basicVS from './shader/basic.vert';

export default class Renderer {

	private gl: WebGLRenderingContext;
	private canvas: HTMLCanvasElement;

	private basicProgram: twgl.ProgramInfo;
	private fullscreenBuffer: twgl.BufferInfo;

	private props: {
		[key: string]: any;
	} = {
			time: 0.0,
			lastUpdate: Date.now(),
		};

	/**
	 * Initialize renderer
	 */
	constructor() {
		this.canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
		this.gl = this.canvas.getContext('webgl2') as WebGLRenderingContext;

		this.render = this.render.bind(this);

		this.basicProgram = twgl.createProgramInfo(this.gl, [basicVS.toString(), basicFS.toString()], ['vin_position']);
		this.fullscreenBuffer = twgl.createBufferInfoFromArrays(this.gl, {
			vin_position: {
				numComponents: 2,
				data: [
					-1, 3,
					3, -1,
					-1, -1,
				],
			},
		});

		requestAnimationFrame(this.render);
	}

	/**
	 * Render frame
	 */
	private render() {
		if (Date.now() - this.props.lastUpdate > 10) {
			this.props.time += 1.0;
			this.props.lastUpdate = Date.now();
		}

		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.gl.clearColor(1, 0, 1, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.gl.useProgram(this.basicProgram.program);
		const w = this.canvas.width;
		const h = this.canvas.height;

		const dpr = window.devicePixelRatio || 1;
		const screenSize = [w, h, 1.0 / w, 1.0 / h];
		const screenRatio = [dpr, 1.0 / dpr, w / h, h / w];

		twgl.setUniforms(this.basicProgram, {
			"u_screen_size": screenSize,
			'u_screen_ratio': screenRatio,
			"time": this.props.time,
			"speed": .008,
			"saturation": 3,

			// Colors
			"color0": [0.0666, 0.0666, 0.0666],
			"color1": [0.4, 0.415, 0.6],
			"color2": [0.686, 0.368, 0.439],

			// Position
			"x1": -.6,
			"y1": -.6,
			"x2": -1.4,
			"y2": -1.4,

			// Sizes
			"size1": 0.9,
			"size2": 0.8,

			// Mouse
			"mouse": [mouse.x, mouse.y],
			"mouseVelocity": [mouse.speedX, mouse.speedY],
		});

		twgl.setBuffersAndAttributes(this.gl, this.basicProgram, this.fullscreenBuffer);
		twgl.drawBufferInfo(this.gl, this.fullscreenBuffer);

		requestAnimationFrame(this.render);
	}

}
