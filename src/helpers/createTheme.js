import { createTheme as createDefaultTheme } from '@material-ui/core';

export function createTheme(primaryColor, secondaryColor) {
  return createDefaultTheme({
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
    },
    typography: {
      useNextVariants: true,
      fontWeightLight: 200,
      fontWeightRegular: 300,
      fontWeightMedium: 400,
      fontSize: 14,
      fontFamily: ['"Poppins"', 'sans-serif'].join(','),
    },
    shape: {
      borderRadius: 0,
    },
    overrides: {
      MuiButton: {
        contained: {
          boxShadow: 'none',
        },
      },
      MuiAppBar: {
        root: {
          boxShadow: 'none',
        },
      },
      MuiInput: {
        root: {
          fontWeight: 300,
        },
      },
      MuiTypography: {
        h6: {
          fontWeight: 400,
        },
      },
      MuiLink: {
        underlineHover: {
          '&:hover': {
            textDecoration: 'none',
          },
        },
        underlineAlways: {
          textDecoration: 'none',
        },
      },
    },
  });
}
