import { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme as useMuiTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const DRAWER_WIDTH = 280;

export const MainLayout = () => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Header onMenuClick={handleDrawerToggle} />

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                mt: 7,
                height: "calc(100vh - 56px)",
                border: "none",
              },
            }}
          >
            <Sidebar />
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                mt: 7,
                height: "calc(100vh - 56px)",
                border: "none",
                borderRight: 1,
                borderColor: "divider",
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 7,
          height: "calc(100vh - 56px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
