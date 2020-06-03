function FSM(initial) {
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

	this.addTransition = function(statesFrom, stateTo, conditionFunc) {
		transitions.push({
			from: statesFrom,
			to: stateTo,
			cond: conditionFunc,
		});
	};

	this.update = function(deltaTime) {
		if (currentState == NOSTATE) {
			currentState = initial;
			states[currentState].enter(deltaTime);
		}
		states[currentState].update(deltaTime);
		for (let transition of transitions) {
			for (let fromState of transition.from) {
				if (fromState == currentState && transition.cond()) {
					states[currentState].exit(deltaTime);
					currentState = transition.to;
					states[currentState].enter(deltaTime);
					return;
				}
			}
		}
	};
	this.noop = function() {};
}
