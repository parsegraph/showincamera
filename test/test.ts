import { assert } from "chai";
import { showInCamera } from "../src/index";
import { DirectionNode, CommitLayout } from 'parsegraph';
import Camera from "parsegraph-camera";

describe("Package", function () {
  it("works", () => {
    const n = new DirectionNode();
    const cld = new CommitLayout(n, {
      size: (node, size) => {
        size[0] = 50;
        size[1] = 50;
      },
      getSeparation: () => 10
    });
    while (cld.crank());
    const cam = new Camera();
    cam.setSize(25, 25);
    showInCamera(n, cam, false);
    assert.equal(0.5, cam.scale());
  });
});
