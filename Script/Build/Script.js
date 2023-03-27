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
    var fudge = FudgeCore;
    class Character {
        cmp;
        velocity = fudge.Vector3.ZERO();
        acceleration = fudge.Vector3.ZERO();
        terminalVelocity;
        constructor(name, x, y, z, viewport, terminalVelocity) {
            this.cmp = viewport.getBranch().getChildrenByName(name)[0];
            this.cmp.cmpTransform.mtxLocal.translate(new fudge.Vector3(x, y, z));
            this.terminalVelocity = terminalVelocity;
        }
        applyGravity(g) {
            this.acceleration.y = g;
        }
        updateVelocity() {
            this.velocity.add(this.acceleration);
            if (this.velocity.x > this.terminalVelocity.x) {
                this.velocity.x = this.terminalVelocity.x;
            }
            if (this.velocity.x < -this.terminalVelocity.x) {
                this.velocity.x = -this.terminalVelocity.x;
            }
            if (this.velocity.y > this.terminalVelocity.y) {
                this.velocity.y = this.terminalVelocity.y;
            }
            if (this.velocity.y < -this.terminalVelocity.y) {
                this.velocity.y = -this.terminalVelocity.y;
            }
        }
    }
    Script.Character = Character;
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
        sonic = viewport.getBranch().getChildrenByName("Sonic")[0];
        let cmpCamera = new Script.Camera(3, 1, 6, viewport);
        viewport.camera = cmpCamera.cmp;
        fudge.Loop.addEventListener("loopFrame" /* fudge.EVENT.LOOP_FRAME */, update);
        fudge.Loop.start();
    }
    function update(_event) {
        if (sonic) {
            if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.A, fudge.KEYBOARD_CODE.ARROW_LEFT])) {
                sonic.cmpTransform.mtxLocal.translateX(-0.1);
            }
            else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.D, fudge.KEYBOARD_CODE.ARROW_RIGHT])) {
                sonic.cmpTransform.mtxLocal.translateX(0.1);
            }
            else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.W, fudge.KEYBOARD_CODE.ARROW_UP])) {
                sonic.cmpTransform.mtxLocal.translateY(0.1);
            }
            else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.S, fudge.KEYBOARD_CODE.ARROW_DOWN])) {
                sonic.cmpTransform.mtxLocal.translateY(-0.1);
            }
        }
        viewport.draw();
    }
})(Script || (Script = {}));
System.register("constants", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("default", {
                bg: {
                    width: 8,
                    height: 6
                },
                sonic: {
                    width: 1,
                    height: 1
                }
            });
        }
    };
});
//# sourceMappingURL=Script.js.map