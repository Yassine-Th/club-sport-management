import { Group, Container, Box } from "@mantine/core";
import React from "react";
import Logout from "../src/Auth/Logout";

const Header = () => {
  return (
    <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <Container size="xl" className="p-0">
        <Group position="apart" className="px-6 py-4" align="center">
          {/* Left Side: App Title */}
          <div>
            <h1 className="text-white font-bold text-lg">My App</h1>
          </div>

          {/* Right Side: Logout Button */}
          <Group spacing="lg" align="center">
            <Logout />
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Header;
