namespace Script {
  import fudge = FudgeCore;
  fudge.Debug.info("Main Program Template running!");

  let viewport: fudge.Viewport;
  let sonic: fudge.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    sonic = viewport.getBranch().getChildrenByName("Sonic")[0];

    let cmpCamera = new Camera(3, 1, 6, viewport);
    viewport.camera = cmpCamera.cmp;

    fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
    fudge.Loop.start();
  }

  function update(_event: Event): void {
    if (sonic) {
      if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.A, fudge.KEYBOARD_CODE.ARROW_LEFT])) {
        sonic.cmpTransform.mtxLocal.translateX(-0.1);
      } else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.D, fudge.KEYBOARD_CODE.ARROW_RIGHT])) {
        sonic.cmpTransform.mtxLocal.translateX(0.1);
      } else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.W, fudge.KEYBOARD_CODE.ARROW_UP])) {
        sonic.cmpTransform.mtxLocal.translateY(0.1);
      } else if (fudge.Keyboard.isPressedOne([fudge.KEYBOARD_CODE.S, fudge.KEYBOARD_CODE.ARROW_DOWN])) {
        sonic.cmpTransform.mtxLocal.translateY(-0.1);
    }
  }
    viewport.draw();
  }
}