import Renderer from './gl/renderer'
import { initializeMouseListeners } from './mouse';
import anime from 'animejs';

export function init() {
	initializeMouseListeners();

	new Renderer();
}