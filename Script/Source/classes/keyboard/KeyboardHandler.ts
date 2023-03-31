namespace Script {
    export class KeyboardHandler {
        private controlsKeys: FudgeCore.KEYBOARD_CODE[];
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

        public handleInputs(_sonic: Sonic, _timeDeltaSeconds: number): void {
            // Yes, it is intentional that jumping doesn't stop Sonic
            // I think it's more fun to have a bhopping Sonic :D
            if (!FudgeCore.Keyboard.isPressedOne(this.controlsKeys)) {
                _sonic.stop();
            }

            // also hi
            if (FudgeCore.Keyboard.isPressedOne([FudgeCore.KEYBOARD_CODE.A, FudgeCore.KEYBOARD_CODE.ARROW_LEFT])) {
                _sonic.move(Direction.LEFT, _timeDeltaSeconds);
            } else if (
                FudgeCore.Keyboard.isPressedOne([FudgeCore.KEYBOARD_CODE.D, FudgeCore.KEYBOARD_CODE.ARROW_RIGHT])
            ) {
                _sonic.move(Direction.RIGHT, _timeDeltaSeconds);
            }
            if (FudgeCore.Keyboard.isPressedOne([FudgeCore.KEYBOARD_CODE.W, FudgeCore.KEYBOARD_CODE.ARROW_UP])) {
                _sonic.jump(_timeDeltaSeconds);
            }
        }
    }
}
