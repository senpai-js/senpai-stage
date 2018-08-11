import { Label } from "../src/view/Label";
import { setup } from "./setupUtil";

describe("Label tests", () => {
  const x = 50;
  const y = 50;
  
  test("When Label.setText() is called, the text is set correctly", () => {
    let { sprites: {label} } = setup()
      .addLabel("label", x, y)
      .setLabelText("label", "myLabelText")
      .values;

    expect(label.text).toBe("myLabelText");
  });
});
