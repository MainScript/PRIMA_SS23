namespace Script {
  import fudge = FudgeCore;
  fudge.Debug.info("Main Program Template running!");

  let viewport: fudge.Viewport;
  let sonic: Sonic;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let cmpCamera = new Camera(3, 1, 6, viewport);
    viewport.camera = cmpCamera.cmp;

    sonic = new Sonic(viewport);

    fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
    fudge.Loop.start();
  }

  function update(_event: Event): void {
    if (sonic) {
      if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.A, fudge.KEYBOARD_CODE.ARROW_LEFT])) {
        sonic.move(Direction.LEFT);
      } else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.D, fudge.KEYBOARD_CODE.ARROW_RIGHT])) {
        sonic.move(Direction.RIGHT);
      } else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.W, fudge.KEYBOARD_CODE.ARROW_UP])) {
        sonic.jump();
      } else {
        sonic.stop();
      }
      sonic.update();
  }
    viewport.draw();
  }
}