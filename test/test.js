import {assert} from "chai";
import todo from "../dist/parsegraph-showincamera";

describe("Package", function () {
  it("works", ()=>{
    assert.equal(todo(), 42);
  });
});
