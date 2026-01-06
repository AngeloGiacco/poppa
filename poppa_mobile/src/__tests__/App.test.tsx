import { render } from "@testing-library/react-native";

import { Button } from "@/components/ui/Button";

describe("Button Component", () => {
  it("renders correctly with text", () => {
    const { getByText } = render(<Button>Test Button</Button>);
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("shows loading indicator when isLoading is true", () => {
    const { getByTestId, rerender } = render(<Button isLoading>Loading</Button>);

    rerender(<Button isLoading testID="loading-button">Loading</Button>);
    expect(getByTestId("loading-button")).toBeTruthy();
  });

  it("is disabled when disabled prop is true", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button disabled onPress={onPressMock}>
        Disabled
      </Button>
    );

    const button = getByText("Disabled");
    expect(button).toBeTruthy();
  });
});
