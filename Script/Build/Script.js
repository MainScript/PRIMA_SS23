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
            sonic.stop();
            if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.A, fudge.KEYBOARD_CODE.ARROW_LEFT])) {
                sonic.move(Script.Direction.LEFT);
            }
            else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.D, fudge.KEYBOARD_CODE.ARROW_RIGHT])) {
                sonic.move(Script.Direction.RIGHT);
            }
            if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.W, fudge.KEYBOARD_CODE.ARROW_UP])) {
                sonic.jump();
            }
            sonic.update();
        }
        // if space is pressed, stop the loop
        if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.SPACE])) {
            fudge.Loop.removeEventListener("loopFrame" /* fudge.EVENT.LOOP_FRAME */, update);
            console.log("Loop stopped");
        }
        viewport.draw();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    class BoundingBox {
        x;
        y;
        width;
        height;
        _origin;
        constructor(_x, _y, _width, _height, _origin) {
            this.x = _x;
            this.y = _y;
            this.width = _width;
            this.height = _height;
            this._origin = _origin;
        }
        get top() {
            switch (this._origin & 0x30) {
                case 0x00: return this.y;
                case 0x10: return this.y + this.height / 2;
                case 0x20: return this.y + this.height;
            }
        }
        get bottom() {
            switch (this._origin & 0x30) {
                case 0x00: return this.y - this.height;
                case 0x10: return this.y - this.height / 2;
                case 0x20: return this.y;
            }
        }
        get left() {
            switch (this._origin & 0x03) {
                case 0x00: return this.x;
                case 0x01: return this.x - this.width / 2;
                case 0x02: return this.x - this.width;
            }
        }
        get right() {
            switch (this._origin & 0x03) {
                case 0x00: return this.x + this.width;
                case 0x01: return this.x + this.width / 2;
                case 0x02: return this.x;
            }
        }
    }
    Script.BoundingBox = BoundingBox;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class CollisionChecker {
        checkCollision(a, b) {
            let rectA = this.getRectFromObject(a);
            let rectB = this.getRectFromObject(b);
            let intersection = this.getIntersection(rectA, rectB);
            if (this.objectIsTile(a) && intersection) {
                if (intersection.y < a.definition.XYMapping(intersection.x)) {
                    intersection = null;
                }
            }
            else if (this.objectIsTile(b) && intersection) {
                if (intersection.y < b.definition.XYMapping(intersection.x)) {
                    intersection = null;
                }
            }
            return intersection;
        }
        getRectFromObject(object) {
            return new Script.BoundingBox(object.cmp.cmpTransform.mtxLocal.translation.x, object.cmp.cmpTransform.mtxLocal.translation.y, object.definition.width, object.definition.height, object.definition.origin);
        }
        objectIsTile(object) {
            return object.definition.XYMapping !== undefined;
        }
        getIntersection(a, b) {
            let x = Math.max(a.left, b.left);
            let right = Math.min(a.right, b.right);
            let width = Math.abs(right - x);
            let y = Math.max(a.bottom, b.bottom);
            let top = Math.min(a.top, b.top);
            let height = Math.abs(top - y);
            if (width > 0 && height > 0) {
                return new Script.BoundingBox(x, y, width, height, FudgeCore.ORIGIN2D.BOTTOMLEFT);
            }
            return null;
        }
    }
    Script.CollisionChecker = CollisionChecker;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Character {
        _acceleration = FudgeCore.Vector2.ZERO();
        _cmp;
        _definition;
        _position;
        _velocity = FudgeCore.Vector2.ZERO();
        _viewport;
        _intersection = null;
        constructor(_definition, viewport) {
            this._definition = _definition;
            this._cmp = viewport.getBranch().getChildrenByName(_definition.name)[0];
            this._position = this._cmp.cmpTransform.mtxLocal.translation;
            this._viewport = viewport;
        }
        set acceleration(_acceleration) {
            this._acceleration = _acceleration;
        }
        get acceleration() {
            return this._acceleration;
        }
        get collision() {
            return this._intersection !== null;
        }
        applyGravity() {
            if (this._intersection) {
                this._acceleration.y = 0;
                return;
            }
            this._acceleration.y = Script.GRAVITY;
        }
        get velocity() {
            return this._velocity;
        }
        updateVelocity() {
            if (this._intersection) {
                this._velocity.y = Math.max(this._velocity.y, 0);
            }
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
            if (this._intersection) {
                this._position.y += this._intersection.height;
            }
            this._cmp.mtxLocal.translation = this._position;
        }
        applyForce(_force) {
            this._acceleration.add(_force);
        }
        applyImpulse(_impulse) {
            this._velocity.add(_impulse);
        }
        checkCollision() {
            const collisionChecker = new Script.CollisionChecker();
            Script.collidables.map((def) => {
                return this._viewport.getBranch().getChildrenByName("Terrain")[0].getChildrenByName(def.name).map((node) => ({ cmp: node, definition: def }));
            }).reduce((a, b) => a.concat(b), []).map((floor) => {
                return collisionChecker.checkCollision({ cmp: this._cmp, definition: this._definition }, floor);
            }).filter((intersection) => {
                return intersection !== null;
            }).some((intersection) => {
                this._intersection = intersection;
                return true;
            });
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
            this._character.checkCollision();
            this._character.applyGravity();
            this._character.updateVelocity();
            this._character.updatePosition();
        }
        jump() {
            if (this._character.collision) {
                this._character.applyImpulse(new FudgeCore.Vector2(0, Script.defSonic.jumpImpulse));
            }
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
        terminalVelocity: new FudgeCore.Vector2(0.05, 0.15),
        width: 1,
        jumpImpulse: 0.25,
        moveForce: 0.0025,
        framesToStop: 20,
        origin: FudgeCore.ORIGIN2D.BOTTOMCENTER
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
    Script.GRAVITY = -0.005;
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.defFloorStraight4x1 = {
        name: "FloorStraight4x1a",
        width: 4,
        height: 1,
        XYMapping: (x) => x,
        origin: FudgeCore.ORIGIN2D.TOPLEFT
    };
    Script.defRampUpFull = {
        name: "RampUpFull",
        width: 2.5,
        height: 2,
        XYMapping: (x) => 2 / 2.5 * x,
        origin: FudgeCore.ORIGIN2D.BOTTOMRIGHT
    };
    Script.collidables = [
        Script.defFloorStraight4x1,
        // defRampUpFull
    ];
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map