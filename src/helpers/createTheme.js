import { createMuiTheme } from '@material-ui/core/styles';

export function createTheme(primaryColor, secondaryColor) {
  return createMuiTheme({
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: primaryColor,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: secondaryColor,
        // dark: will be calculated from palette.secondary.main,
      },
      // error: will use the default color
    },
    typography: {
      useNextVariants: true,
      fontWeightLight: 200,
      fontWeightRegular: 300,
      fontWeightMedium: 400,
      fontSize: 14,
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    overrides: {
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
