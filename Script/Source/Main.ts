namespace Script {
  import fudge = FudgeCore;
  fudge.Debug.info("Main Program Template running!");

  let viewport: fudge.Viewport;
  let sonic: fudge.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    // get the Node named "Sonic" from the graph attached to the viewport
    sonic = viewport.getBranch().getChildrenByName("Sonic")[0];

    fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
    fudge.Loop.start();
  }

  function update(_event: Event): void {
    if (sonic) {

      sonic.cmpTransform.mtxLocal.translateX(0.1);
    }
    viewport.draw();
    fudge.AudioManager.default.update();
  }
}