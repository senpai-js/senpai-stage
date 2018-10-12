import { ILabel } from "../src/view/Label";
import { setup } from "./senpaiTestSetup";

describe("Label tests", () => {
  const x = 50;
  const y = 50;

  test("When Label.setText() is called, the text is set correctly", () => {
    const { sprites: { label } } = setup()
      .addLabel("label", x, y)
      .setLabelText("label", "myLabelText")
      .dispose();

    expect((label as ILabel).text)
      .toBe("myLabelText");
  });
});
