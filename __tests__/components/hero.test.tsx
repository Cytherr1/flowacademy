import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero";
import { MantineProvider } from "@mantine/core";

/* 
https://www.youtube.com/watch?v=AS79oJ3Fcf0
*/

it("should have Title", () => {
  render(
    <MantineProvider>
      <Hero />
    </MantineProvider>
  );

  const title = screen.getByText("FlowAcademy");

  expect(title).toBeInTheDocument();
});
