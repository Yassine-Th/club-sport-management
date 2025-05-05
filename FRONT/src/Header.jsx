import { Group, Container, Box } from "@mantine/core";
import React from "react";
import Logout from "../src/Auth/Logout"

const Header = () => {
  return (
    <Box className="!bg-gradient-to-r !from-blue-600 !to-indigo-700 !shadow-lg">
      <Container size="xl" className="p-0">
        <Group
          position="apart"
          className="px-6 py-4"
          justify="space-between"
          align="center"
        >
          <div></div> {/* Placeholder to align Logout to the right */}
          <Group spacing="lg">
            <Logout />
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
