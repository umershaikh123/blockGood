"use client"

import * as React from "react"
import {
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Link from "next/link"
import Image from "next/image"
import { ResponsiveAppBarProps } from "../../types/Navbar"
import SearchIcon from "@mui/icons-material/Search"
import { styled, alpha } from "@mui/material/styles"
import SpaIcon from "@mui/icons-material/Spa"

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "white",
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--primary)",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "var(--secondary)",
  width: "100%",
  fontWeight: 600,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "40ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}))

function ResponsiveAppBar({ endComponent, copyright }: ResponsiveAppBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <div className={` flex justify-center h-20   `}>
      <nav
        className=" fixed z-30  mx-auto w-full  bg-[var(--Bg)] rounded-xl   px-0 text-white  backdrop-blur-lg sm:px-8  md:max-w-[98vw]     "
        aria-labelledby="menu-button"
      >
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
            }}
          >
            <div className="flex space-x-2 mr-5">
              <SpaIcon sx={{ color: "var(--primary)", fontSize: 40 }} />
              <h1 className=" text-[var(--primary)]    font-bold  font-mono text-4xl">
                BlockGood
              </h1>
            </div>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", lg: "none" },
              color: "white",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: "var(--primary)" }} fontSize={"large"} />
            </IconButton>

            {/* Mobile Links */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", lg: "none" },
                mt: "1px",

                backdropFilter: "blur(5px)",
                "& .MuiMenu-paper": {
                  backgroundColor: "var(--Bg)",
                  borderRadius: "8px",
                },
              }}
            >
              <MenuItem>
                <div className="mt-4 w-full text-[var(--primary)] flex justify-center">
                  {copyright}
                </div>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile menu end */}

          {/* web/mobile button and links */}

          <Box
            sx={{
              display: { xs: "flex", lg: "none", flexGrow: 1, mr: 2 },
            }}
          >
            <div className="flex space-x-2 mr-5">
              <SpaIcon sx={{ color: "var(--primary)", fontSize: 40 }} />
              <h1 className=" text-[var(--primary)]    font-bold  font-mono text-4xl">
                BlockGood
              </h1>
            </div>
          </Box>

          {/* Web Links */}
          <Box
            sx={{
              flexGrow: 2,
              display: {
                xs: "none",
                lg: "flex",
              },
            }}
          >
            {/* <div className="flex space-x-6 text-base"></div> */}
            {/* add searchBar */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search Campaigns ...."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>

          <Box>{endComponent}</Box>
        </Toolbar>
      </nav>
    </div>
  )
}
export default ResponsiveAppBar
