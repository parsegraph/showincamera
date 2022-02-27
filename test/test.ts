import { assert } from "chai";
import {showInCamera} from "../src/index";
import { Layout, Positioned, LayoutNode } from "parsegraph-layout";
import Camera from "parsegraph-camera";
import {DirectionNode} from 'parsegraph-direction';
import Size from 'parsegraph-size';

class DefaultVal implements Positioned {
  _layout:Layout;
  constructor(n:LayoutNode) {
    this._layout = new Layout(n);
  }

  getLayout():Layout {
    return this._layout;
  }

  getSeparation() {
    return 10;
  }

  size(size?:Size):Size {
    if (!size) {
      size = new Size();
    }
    size.setWidth(50);
    size.setHeight(50);
    return size;
  }

}

describe("Package", function () {
  it("works", () => {
    const n:LayoutNode = new DirectionNode();
    n.setValue(new DefaultVal(n));
    const cam = new Camera();
    cam.setSize(25, 25);
    showInCamera(n, cam, false);
    assert.equal(0.5, cam.scale());
  });
});
