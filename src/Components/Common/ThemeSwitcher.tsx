import React, { useState, useEffect } from "react"
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material"
interface Theme {
  "--primary": string
  "--secondary": string
  "--Bg": string
}
// Define themes with CSS variable values
const themes: { [key: string]: Theme } = {
  ForestGreen: {
    "--primary": "#283618",
    "--secondary": "#606c38",
    "--Bg": "#fefae0",
  },

  Turquoise: {
    "--primary": "#073B4C",
    "--secondary": "#118AB2",
    "--Bg": "#06D6A0",
  },
  NavyNight: {
    "--primary": "#003049",
    "--secondary": "#034D73",
    "--Bg": "#FDF0D5",
  },
  SkyBlue: {
    "--primary": "#0077B6",
    "--secondary": "#00B4D8",
    "--Bg": "#CAF0F8",
  },
  PinkPeach: {
    "--primary": "#FB6F92",
    "--secondary": "#FF8FAB",
    "--Bg": "#FFE5EC",
  },

  OrangePeel: {
    "--primary": "#EF476F",
    "--secondary": "#EF476F",
    "--Bg": "#FFD166",
  },
}

const ThemeSwitcher: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTheme") || "ForestGreen"
    } else {
      return "ForestGreen"
    }
  })

  useEffect(() => {
    const root = document.documentElement
    const themeVariables = themes[selectedTheme as keyof typeof themes]

    for (const [key, value] of Object.entries(themeVariables)) {
      root.style.setProperty(key, value)
    }

    localStorage.setItem("selectedTheme", selectedTheme)
  }, [selectedTheme])

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTheme(event.target.value)
  }

  return (
    <FormControl component="fieldset">
      <h1 className="text-xl">Choose a Theme</h1>
      <RadioGroup row value={selectedTheme} onChange={handleThemeChange}>
        {Object.keys(themes).map(theme => (
          <FormControlLabel
            key={theme}
            value={theme}
            control={
              <Radio
                sx={{
                  color: "var(--secondary)",
                  "&.Mui-checked": {
                    color: "var(--primary)",
                  },
                }}
              />
            }
            label={theme.charAt(0).toUpperCase() + theme.slice(1)}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default ThemeSwitcher
