/* eslint-disable no-inner-declarations */
namespace Script {
    import fudge = FudgeCore;
    fudge.Debug.info('Main Program Template running!');

    let viewport: fudge.Viewport;
    let sonic: Sonic;
    let viewCamera: Camera;
    document.addEventListener('interactiveViewportStarted', <EventListener>start);

    function start(_event: CustomEvent): void {
        viewport = _event.detail;

        viewCamera = new Camera(3, 1, 6, viewport);
        viewport.camera = viewCamera.cmp;

        sonic = new Sonic(viewport);

        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
        fudge.Loop.start();
    }

    function update(_event: Event): void {
        if (sonic) {
            sonic.stop();
            if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.A, fudge.KEYBOARD_CODE.ARROW_LEFT])) {
                sonic.move(Direction.LEFT);
            } else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.D, fudge.KEYBOARD_CODE.ARROW_RIGHT])) {
                sonic.move(Direction.RIGHT);
            }
            if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.W, fudge.KEYBOARD_CODE.ARROW_UP])) {
                sonic.jump();
            }
            sonic.update();
            viewCamera.follow(sonic.character);
            console.log(viewCamera.position);
        }
        // if space is pressed, stop the loop
        if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.SPACE])) {
            fudge.Loop.removeEventListener(fudge.EVENT.LOOP_FRAME, update);
            console.log('Loop stopped');
        }
        viewport.draw();
    }
}
