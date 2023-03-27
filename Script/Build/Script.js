"use strict";
var Script;
(function (Script) {
    var fudge = FudgeCore;
    class Camera {
        cmp;
        constructor(x, y, z, viewport) {
            this.cmp = viewport.getBranch().getComponent(fudge.ComponentCamera);
            this.cmp.mtxPivot.translate(new fudge.Vector3(x, y, z));
            this.cmp.mtxPivot.rotateY(180);
        }
    }
    Script.Camera = Camera;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var fudge = FudgeCore;
    fudge.Debug.info("Main Program Template running!");
    let viewport;
    let sonic;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        let cmpCamera = new Script.Camera(3, 1, 6, viewport);
        viewport.camera = cmpCamera.cmp;
        sonic = new Script.Sonic(viewport);
        fudge.Loop.addEventListener("loopFrame" /* fudge.EVENT.LOOP_FRAME */, update);
        fudge.Loop.start();
    }
    function update(_event) {
        if (sonic) {
            if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.A, fudge.KEYBOARD_CODE.ARROW_LEFT])) {
                sonic.move(Script.Direction.LEFT);
            }
            else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.D, fudge.KEYBOARD_CODE.ARROW_RIGHT])) {
                sonic.move(Script.Direction.RIGHT);
            }
            else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.W, fudge.KEYBOARD_CODE.ARROW_UP])) {
                sonic.jump();
            }
            else {
                sonic.stop();
            }
            sonic.update();
        }
        viewport.draw();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Character {
        _acceleration = FudgeCore.Vector2.ZERO();
        _cmp;
        _definition;
        _position;
        _velocity = FudgeCore.Vector2.ZERO();
        constructor(_definition, viewport) {
            this._definition = _definition;
            this._cmp = viewport.getBranch().getChildrenByName(_definition.name)[0];
            this._position = this._cmp.mtxLocal.translation;
        }
        set acceleration(_acceleration) {
            this._acceleration = _acceleration;
        }
        applyGravity() {
            this._acceleration.y = Script.GRAVITY;
        }
        get velocity() {
            return this._velocity;
        }
        updateVelocity() {
            this._velocity.add(this._acceleration);
            this._acceleration = FudgeCore.Vector2.ZERO();
            if (this._velocity.x > this._definition.terminalVelocity.x) {
                this._velocity.x = this._definition.terminalVelocity.x;
            }
            else if (this._velocity.x < -this._definition.terminalVelocity.x) {
                this._velocity.x = -this._definition.terminalVelocity.x;
            }
            if (this._velocity.y > this._definition.terminalVelocity.y) {
                this._velocity.y = this._definition.terminalVelocity.y;
            }
            else if (this._velocity.y < -this._definition.terminalVelocity.y) {
                this._velocity.y = -this._definition.terminalVelocity.y;
            }
        }
        updatePosition() {
            this._position.add(this._velocity.toVector3());
            this._cmp.mtxLocal.translation = this._position;
        }
        applyForce(_force) {
            this._acceleration.add(_force);
        }
        applyImpulse(_impulse) {
            this._velocity.add(_impulse);
        }
    }
    Script.Character = Character;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Sonic {
        _character;
        constructor(viewport) {
            this._character = new Script.Character(Script.defSonic, viewport);
        }
        update() {
            this._character.applyGravity();
            this._character.updateVelocity();
            this._character.updatePosition();
        }
        jump() {
            this._character.applyImpulse(new FudgeCore.Vector2(0, Script.defSonic.jumpImpulse));
        }
        move(_direction) {
            this._character.applyForce(new FudgeCore.Vector2(_direction * Script.defSonic.moveForce, 0));
        }
        stop() {
            this._character.applyForce(new FudgeCore.Vector2(-this._character.velocity.x / Script.defSonic.framesToStop, 0));
        }
    }
    Script.Sonic = Sonic;
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.defSonic = {
        name: "Sonic",
        height: 1,
        terminalVelocity: new FudgeCore.Vector2(0.05, 0.1),
        width: 1,
        jumpImpulse: 0.1,
        moveForce: 0.0025,
        framesToStop: 20
    };
})(Script || (Script = {}));
var Script;
(function (Script) {
    let Direction;
    (function (Direction) {
        Direction[Direction["LEFT"] = -1] = "LEFT";
        Direction[Direction["RIGHT"] = 1] = "RIGHT";
    })(Direction = Script.Direction || (Script.Direction = {}));
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.GRAVITY = -0.00;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map