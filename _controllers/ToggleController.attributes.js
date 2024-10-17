const ToggleControllerAttributes = {
	// toggle controller
	toggle: { type: String, reflect: true }, // 'true', 'false'
	toggleOn: { type: String, reflect: true, attribute: 'toggle-on' }, // 'click'
	toggleOff: { type: String, reflect: true, attribute: 'toggle-off' }, // 'self'
	toggleAnim: { type: String, reflect: true, attribute: 'toggle-anim' }, //
	toggleOverlay: { type: String, reflect: true, attribute: 'toggle-overlay' }, // 'true'
	toggleDest: { type: String, reflect: true, attribute: 'toggle-dest' }, // <selector>
	toggleIcon: { type: String, reflect: true, attribute: 'toggle-icon' }, // 'triplebar', '&#9660;'
	toggleText: { type: String, reflect: true, attribute: 'toggle-text' }, // 'Click Me'
	toggleLabel: { type: String, reflect: true, attribute: 'toggle-label' }, // 'Primary Navigation', 'Switch Language', Table Of Contents'
	toggleState: { type: String, reflect: true, attribute: 'toggle-state' }, // 'on', 'off''
	toggleCondition: { type: String, reflect: true, attribute: 'toggle-condition' }, // 'on', 'off''
}

export default ToggleControllerAttributes