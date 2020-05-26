function FSM(initialState) {
	const NOSTATE = 'none';
	let currentState = NOSTATE;
	const states = {};
	const transitions = [];

	this.addState = function(name, enterFunc, updateFunc, exitFunc) {
		states[name] = {
			enter: enterFunc,
			update: updateFunc,
			exit: exitFunc,
		};
	};

	this.addTransition = function(stateFrom, stateTo, conditionFunc) {
		transitions.push({
			from: stateFrom,
			to: stateTo,
			cond: conditionFunc,
		});
	};

	this.update = function(deltaTime) {
		if (currentState == NOSTATE) {
			currentState = initialState;
			states[currentState].enter(deltaTime);
		}
		states[currentState].update(deltaTime);
		for (i=0; i<transitions.length; i++) {
			let transition = transitions[i];
			if (transition.from == currentState && transition.cond()) {
				states[currentState].exit(deltaTime);
				currentState = transition.to;
				states[currentState].enter(deltaTime);
				break;
			}
		}
	};
}
