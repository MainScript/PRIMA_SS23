"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = 'CustomComponentScript added to ';
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
/* eslint-disable no-inner-declarations */
var Script;
/* eslint-disable no-inner-declarations */
(function (Script) {
    var fudge = FudgeCore;
    fudge.Debug.info('Main Program Template running!');
    let viewport;
    let sonic;
    let viewCamera;
    let keyboardHandler;
    document.addEventListener('interactiveViewportStarted', start);
    function start(_event) {
        viewport = _event.detail;
        viewCamera = new Script.Camera(3, 1, 6, viewport);
        viewport.camera = viewCamera.cmp;
        sonic = new Script.Sonic(viewport);
        keyboardHandler = new Script.KeyboardHandler();
        fudge.Loop.addEventListener("loopFrame" /* fudge.EVENT.LOOP_FRAME */, update);
        fudge.Loop.start();
    }
    function update(_event) {
        const timeDeltaSeconds = fudge.Loop.timeFrameGame / 1000;
        if (sonic) {
            keyboardHandler.handleInputs(sonic, timeDeltaSeconds);
            sonic.update(timeDeltaSeconds);
            viewCamera.follow(sonic.character);
        }
        // if space is pressed, stop the loop
        // REMOVE THIS IN PRODUCTION
        if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.SEVEN])) {
            fudge.Loop.removeEventListener("loopFrame" /* fudge.EVENT.LOOP_FRAME */, update);
            console.log('Loop stopped');
        }
        viewport.draw();
    }
})(Script || (Script = {}));
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
        get position() {
            return this.cmp.mtxPivot.translation;
        }
        set position(_position) {
            this.cmp.mtxPivot.translation = _position;
        }
        follow(target) {
            const vector = new fudge.Vector3(target.position.x, target.position.y + 1, this.position.z);
            this.position = vector;
        }
    }
    Script.Camera = Camera;
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
        constructor(_definition, viewport) {
            this._definition = _definition;
            this._cmp = viewport.getBranch().getChildrenByName(_definition.name)[0];
            this._position = this._cmp.cmpTransform.mtxLocal.translation;
            this._viewport = viewport;
        }
        get position() {
            return this._position;
        }
        set acceleration(_acceleration) {
            this._acceleration = _acceleration;
        }
        get acceleration() {
            return this._acceleration;
        }
        set velocity(_velocity) {
            this._velocity = _velocity;
        }
        get velocity() {
            return this._velocity;
        }
        reset() {
            this._acceleration = FudgeCore.Vector2.ZERO();
            this._velocity = FudgeCore.Vector2.ZERO();
        }
        applyGravity(_timeDeltaSeconds, _intersection) {
            if (!_intersection) {
                this._acceleration.y = Script.GRAVITY * _timeDeltaSeconds;
            }
        }
        updateVelocity(_timeDeltaSeconds, _intersection) {
            this._velocity.add(this._acceleration);
            if (_intersection && this._position.y + this.velocity.y < _intersection.top) {
                this._velocity.y = Math.max(0, this._velocity.y);
            }
            this._acceleration = FudgeCore.Vector2.ZERO();
            if (this._velocity.x > this._definition.terminalVelocity.x * _timeDeltaSeconds) {
                this._velocity.x = this._definition.terminalVelocity.x * _timeDeltaSeconds;
            }
            else if (this._velocity.x < -this._definition.terminalVelocity.x * _timeDeltaSeconds) {
                this._velocity.x = -this._definition.terminalVelocity.x * _timeDeltaSeconds;
            }
            if (this._velocity.y > this._definition.terminalVelocity.y * _timeDeltaSeconds) {
                this._velocity.y = this._definition.terminalVelocity.y * _timeDeltaSeconds;
            }
            else if (this._velocity.y < -this._definition.terminalVelocity.y * _timeDeltaSeconds) {
                this._velocity.y = -this._definition.terminalVelocity.y * _timeDeltaSeconds;
            }
        }
        updatePosition(_intersection) {
            this._position.add(this._velocity.toVector3());
            if (_intersection && this._position.y + this.velocity.y < _intersection.top) {
                this._position.y = _intersection.top;
            }
            this._cmp.mtxLocal.translation = this._position;
        }
        applyForce(_force) {
            this._acceleration.add(_force);
        }
        applyImpulse(_impulse) {
            this._velocity.add(_impulse);
        }
        checkCollision(_char, _timeDeltaSeconds) {
            _char.applyGravity(_timeDeltaSeconds);
            _char.updateVelocity(_timeDeltaSeconds);
            _char.updatePosition();
            const collisionChecker = new Script.CollisionChecker();
            const tilesToCollideWith = Script.getAllMeshesInNode(this._viewport.getBranch().getChildrenByName('Terrain')[0])
                .filter((component) => Script.collidables.map((def) => def.name).includes(component.mesh.name))
                .map((component) => {
                return {
                    translation: component.mtxWorld.translation,
                    definition: Script.collidables.find((def) => def.name === component.mesh.name),
                };
            });
            return tilesToCollideWith
                .map((tile) => {
                return collisionChecker.checkCollision({
                    translation: _char.position,
                    definition: _char._definition,
                }, tile);
            })
                .filter((intersection) => intersection !== null)
                .sort((a, b) => {
                return this.compareDistances(a.position, b.position);
            })[0];
        }
        compareDistances(a, b) {
            const distanceA = (this._position.x - a.x) ** 2 + (this._position.y - a.y) ** 2;
            const distanceB = (this._position.x - b.x) ** 2 + (this._position.y - b.y) ** 2;
            return distanceA > distanceB ? 1 : -1;
        }
    }
    Script.Character = Character;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Sonic {
        _character;
        _collision;
        constructor(viewport) {
            this._character = new Script.Character(Script.defSonic, viewport);
        }
        get character() {
            return this._character;
        }
        update(_timeDeltaSeconds) {
            const _clone = Object.assign(Object.create(Object.getPrototypeOf(this.character)), this.character);
            _clone.reset();
            this._collision = _clone.checkCollision(_clone, _timeDeltaSeconds);
            this._character.applyGravity(_timeDeltaSeconds, this._collision);
            this._character.updateVelocity(_timeDeltaSeconds, this._collision);
            this._character.updatePosition(this._collision);
        }
        jump(_timeDeltaSeconds) {
            if (this._collision) {
                this._character.applyImpulse(new FudgeCore.Vector2(0, Script.defSonic.jumpImpulse * _timeDeltaSeconds));
            }
        }
        move(_direction, _timeDeltaSeconds) {
            this._character.applyForce(new FudgeCore.Vector2(_direction * Script.defSonic.moveAcceleration * _timeDeltaSeconds, 0));
        }
        stop() {
            this._character.applyForce(new FudgeCore.Vector2(-this._character.velocity.x / Script.defSonic.framesToStop, 0));
        }
    }
    Script.Sonic = Sonic;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class BoundingBox {
        x;
        y;
        width;
        height;
        _origin;
        constructor(_translation, _size, _origin) {
            // round every number to 3 decimal places
            this.x = Math.round(_translation.x * 1000) / 1000;
            this.y = Math.round(_translation.y * 1000) / 1000;
            this.width = Math.round(_size.x * 1000) / 1000;
            this.height = Math.round(_size.y * 1000) / 1000;
            this._origin = _origin;
        }
        isInside(_point) {
            return this.left <= _point.x && this.right >= _point.x && this.top >= _point.y && this.bottom <= _point.y;
        }
        get top() {
            switch (this._origin & 0x30) {
                case 0x00:
                    return this.y;
                case 0x10:
                    return this.y + this.height / 2;
                case 0x20:
                    return this.y + this.height;
                default:
                    return this.y;
            }
        }
        get bottom() {
            switch (this._origin & 0x30) {
                case 0x00:
                    return this.y - this.height;
                case 0x10:
                    return this.y - this.height / 2;
                case 0x20:
                    return this.y;
                default:
                    return this.y;
            }
        }
        get left() {
            switch (this._origin & 0x03) {
                case 0x00:
                    return this.x;
                case 0x01:
                    return this.x - this.width / 2;
                case 0x02:
                    return this.x - this.width;
                default:
                    return this.x;
            }
        }
        get right() {
            switch (this._origin & 0x03) {
                case 0x00:
                    return this.x + this.width;
                case 0x01:
                    return this.x + this.width / 2;
                case 0x02:
                    return this.x;
                default:
                    return this.x;
            }
        }
        getIntersection(other) {
            if (this.right < other.left ||
                this.left > other.right ||
                this.top < other.bottom ||
                this.bottom > other.top) {
                return null;
            }
            const x = Math.max(this.left, other.left);
            const right = Math.min(this.right, other.right);
            const width = Math.abs(right - x);
            const y = Math.max(this.bottom, other.bottom);
            const top = Math.min(this.top, other.top);
            const height = Math.abs(top - y);
            if (width > 0 && height > 0) {
                return new BoundingBox(new FudgeCore.Vector2(x, y), new FudgeCore.Vector2(width, height), FudgeCore.ORIGIN2D.CENTER);
            }
            return null;
        }
        get position() {
            return new FudgeCore.Vector2(this.x, this.y);
        }
    }
    Script.BoundingBox = BoundingBox;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class CollisionChecker {
        checkCollision(object1, object2) {
            const rect2 = this.getRectangle(object2.translation.toVector2(), new FudgeCore.Vector2(object2.definition.width, object2.definition.height), object2.definition.origin);
            const _t = rect2.isInside(object1.translation.toVector2());
            if (_t) {
                const intersection = rect2.getIntersection(new Script.BoundingBox(object1.translation.toVector2(), new FudgeCore.Vector2(object1.definition.width, object1.definition.height), object1.definition.origin));
                if (!intersection)
                    return null;
                let _returnHeight = intersection.height;
                if (this.objectIsTile(object2)) {
                    _returnHeight = this.mapXToAbsoluteYUsingSlope(object1.translation.x, object2);
                }
                if (object1.translation.y > rect2.bottom + _returnHeight) {
                    return null;
                }
                return this.getRectangle(new FudgeCore.Vector2(object1.translation.x, rect2.bottom), new FudgeCore.Vector2(intersection.width, _returnHeight), FudgeCore.ORIGIN2D.BOTTOMCENTER);
            }
            return null;
        }
        getRectangle(_translation, _scale, _origin) {
            return new Script.BoundingBox(_translation, _scale, _origin);
        }
        mapXToAbsoluteYUsingSlope(_absoluteX, _tile) {
            const tileRect = this.getRectangle(_tile.translation.toVector2(), new FudgeCore.Vector2(_tile.definition.width, _tile.definition.height), _tile.definition.origin);
            const y = _tile.definition.slopeMapping(this.getRelativeX(_absoluteX, tileRect));
            return y * _tile.definition.height;
        }
        getRelativeX(_absoluteX, _tileRect) {
            return (_absoluteX - _tileRect.left) / _tileRect.width;
        }
        objectIsTile(object) {
            return object.definition.slopeMapping !== undefined;
        }
    }
    Script.CollisionChecker = CollisionChecker;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class KeyboardHandler {
        controlsKeys;
        constructor() {
            this.controlsKeys = [
                FudgeCore.KEYBOARD_CODE.A,
                FudgeCore.KEYBOARD_CODE.ARROW_LEFT,
                FudgeCore.KEYBOARD_CODE.D,
                FudgeCore.KEYBOARD_CODE.ARROW_RIGHT,
                FudgeCore.KEYBOARD_CODE.W,
                FudgeCore.KEYBOARD_CODE.ARROW_UP,
            ];
        }
        handleInputs(_sonic, _timeDeltaSeconds) {
            // Yes, it is intentional that jumping doesn't stop Sonic
            // I think it's more fun to have a bhopping Sonic :D
            if (!FudgeCore.Keyboard.isPressedOne(this.controlsKeys)) {
                _sonic.stop();
            }
            // also hi
            if (FudgeCore.Keyboard.isPressedOne([FudgeCore.KEYBOARD_CODE.A, FudgeCore.KEYBOARD_CODE.ARROW_LEFT])) {
                _sonic.move(Script.Direction.LEFT, _timeDeltaSeconds);
            }
            else if (FudgeCore.Keyboard.isPressedOne([FudgeCore.KEYBOARD_CODE.D, FudgeCore.KEYBOARD_CODE.ARROW_RIGHT])) {
                _sonic.move(Script.Direction.RIGHT, _timeDeltaSeconds);
            }
            if (FudgeCore.Keyboard.isPressedOne([FudgeCore.KEYBOARD_CODE.W, FudgeCore.KEYBOARD_CODE.ARROW_UP])) {
                _sonic.jump(_timeDeltaSeconds);
            }
        }
    }
    Script.KeyboardHandler = KeyboardHandler;
})(Script || (Script = {}));
var Script;
(function (Script) {
    function getAllMeshesInNode(_node) {
        let meshes = [];
        for (const child of _node.getChildren()) {
            if (child.getComponent(FudgeCore.ComponentMesh)) {
                meshes.push(child.getComponent(FudgeCore.ComponentMesh));
            }
            meshes = meshes.concat(getAllMeshesInNode(child));
        }
        return meshes;
    }
    Script.getAllMeshesInNode = getAllMeshesInNode;
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.defSonic = {
        name: 'Sonic',
        height: 1,
        terminalVelocity: new FudgeCore.Vector2(4, 10),
        width: 1,
        jumpImpulse: 15,
        moveAcceleration: 0.5,
        framesToStop: 20,
        origin: FudgeCore.ORIGIN2D.BOTTOMCENTER,
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
    Script.GRAVITY = -0.5;
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.defFloorStraight4x1 = {
        name: 'FloorStraight',
        width: 1,
        height: 1,
        slopeMapping: () => 0.95,
        origin: FudgeCore.ORIGIN2D.CENTER,
    };
    Script.defRampUpFull = {
        name: 'RampUp',
        width: 2.5,
        height: 2,
        slopeMapping: (x) => {
            if (x > 0.1375) {
                return 0.43 * x + 0.54;
            }
            return 0.6;
        },
        origin: FudgeCore.ORIGIN2D.CENTER,
    };
    Script.defBridge = {
        name: 'Bridge',
        width: 4,
        height: 0.5,
        slopeMapping: (x) => (4 / 5) * x ** 2 - (4 / 5) * x + 0.6,
        origin: FudgeCore.ORIGIN2D.CENTER,
    };
    Script.collidables = [Script.defFloorStraight4x1, Script.defRampUpFull, Script.defBridge];
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map