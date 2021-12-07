import Direction from "parsegraph-direction";
import Camera from "parsegraph-camera";
import { LayoutNode } from "parsegraph-layout";

// The largest scale at which nodes are shown in camera.
// export const NATURAL_VIEWPORT_SCALE = 0.5;
export const NATURAL_VIEWPORT_SCALE = 1.0;

export const showNodeInCamera = (node: LayoutNode, cam: Camera) => {
  const layout = node.value().getLayout();
  layout.commitLayoutIteratively();
  const bodySize = layout.absoluteSize();

  // const bodyRect = new Rect(
  // layout.absoluteX(),
  // layout.absoluteY(),
  // bodySize[0],
  // bodySize[1],
  // );
  // if(cam.ContainsAll(bodyRect)) {
  // return;
  // }

  const nodeScale = layout.absoluteScale();

  const camScale = cam.scale();
  const screenWidth = cam.width();
  const screenHeight = cam.height();

  let scaleAdjustment: number;
  const widthIsBigger =
    screenWidth / (bodySize[0] * nodeScale) <
    screenHeight / (bodySize[1] * nodeScale);
  if (widthIsBigger) {
    scaleAdjustment = screenWidth / (bodySize[0] * nodeScale);
  } else {
    scaleAdjustment = screenHeight / (bodySize[1] * nodeScale);
  }
  if (scaleAdjustment > camScale) {
    scaleAdjustment = camScale;
  } else {
    cam.setScale(scaleAdjustment);
  }

  const ax = layout.absoluteX();
  const ay = layout.absoluteY();
  cam.setOrigin(
    -ax + screenWidth / (scaleAdjustment * 2),
    -ay + screenHeight / (scaleAdjustment * 2)
  );
};

export const showInCamera = (
  node: LayoutNode,
  cam: Camera,
  onlyScaleIfNecessary: boolean
) => {
  const layout = node.value().getLayout();

  // console.log("Showing node in camera");
  layout.commitLayoutIteratively();
  const bodySize = layout.extentSize();
  const nodeScale = layout.absoluteScale();
  const camScale = cam.scale();
  const screenWidth = cam.width();
  const screenHeight = cam.height();
  if (Number.isNaN(screenWidth) || Number.isNaN(screenHeight)) {
    throw new Error(
      "Camera size must be set before a node can be shown in it."
    );
  }

  // Adjust camera scale.
  let scaleAdjustment: number;
  const widthIsBigger = screenWidth / bodySize[0] < screenHeight / bodySize[1];
  if (widthIsBigger) {
    scaleAdjustment = screenWidth / bodySize[0];
  } else {
    scaleAdjustment = screenHeight / bodySize[1];
  }
  const scaleMaxed = scaleAdjustment > NATURAL_VIEWPORT_SCALE;
  if (scaleMaxed) {
    scaleAdjustment = NATURAL_VIEWPORT_SCALE;
  }
  if (onlyScaleIfNecessary && scaleAdjustment / nodeScale > camScale) {
    scaleAdjustment = camScale;
  } else {
    cam.setScale(scaleAdjustment / nodeScale);
  }

  // Get node extents.
  let x: number;
  let y: number;
  const bv: number[] = [null, null, null];
  layout.extentsAt(Direction.BACKWARD).boundingValues(bv);
  x = bv[2] * nodeScale;
  layout.extentsAt(Direction.UPWARD).boundingValues(bv);
  y = bv[2] * nodeScale;

  if (widthIsBigger || scaleMaxed) {
    y += screenHeight / (cam.scale() * 2) - (nodeScale * bodySize[1]) / 2;
  }
  if (!widthIsBigger || scaleMaxed) {
    x += screenWidth / (cam.scale() * 2) - (nodeScale * bodySize[0]) / 2;
  }

  // Move camera into position.
  const ax = layout.absoluteX();
  const ay = layout.absoluteY();
  cam.setOrigin(x - ax, y - ay);
};
