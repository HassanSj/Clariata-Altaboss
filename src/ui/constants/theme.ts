import {createTheme, ThemeOptions,} from '@material-ui/core/styles';
declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    colors: {
      blue: string;
      purple: string;
      green: string;
      orange: string;
      teal: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    colors?: {
      danger?: string;
    };
  }
}

export const theme = createTheme({
  typography: {
    // fontFamily: "'Play', sans-serif",
    fontFamily: "'Work Sans', sans-serif",
  },
  palette: {
    primary: {
      main: '#183f69',
      light: '#2A547F',
      dark: '#082C51',
    },
    secondary: {
      main: '#F2592A',
      light: '#FF7C53',
      dark: '#CC390B',
    },
    error: {
      main: '#c0392b',
      light: '#D95E51',
      dark: '#9B2114',
    },
    warning: {
      main: '#f7ca18',
      light: '#FFDA47',
      dark: '#C8A004',
    },
    info: {
      // main: '#C9E6E9',
      // light: '#EEF9FA',
      // dark: '#183f69',
      main: '#7bc1c7',
      light: '#ADDFE4',
      dark: '#DFF6F8',
    },
    success: {
      main: '#659A41',
      light: '#8CBB6B',
      dark: '#4A7E26',
    },
  },
  shape: {
    borderRadius: 0,
  }, 
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }
    },
    MuiStepLabel: {
      root: {
        disabled: {
          cursor: 'pointer'
        }
      }
    },
    MuiButton: {
      root: {
        borderRadius: 0,
      } 
    },
    MuiFormLabel: {
      root: {
        fontSize: '.7rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        color: '#000',
        borderBottom: 'none',
        marginBottom: '5px',
        padding: '0px',
      }
    },
    MuiInputLabel: {
      formControl: {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        transform: 'none !important',
        textTransform: 'uppercase',
        paddingBottom: '7px'
      }
    },
    MuiInputBase: {
      root: {
        border: '1px solid rgba(0, 0, 0, 0.23)'
      }
    },
    MuiOutlinedInput: {
      notchedOutline: {
        display: 'none'
      }
    },
    MuiList: {
      padding: {
        paddingTop: '0',
        paddingBottom: '15px'
      }
    },
    MuiMenu: {
      list: {
        // '&:focus':{
          backgroundColor: 'rgba(0, 0, 0, 0.08)'
        // }
      }
    },
    MuiListItem: {
      root: {
        '&[aria-selected=true]': {
              backgroundColor: '#193F69',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#193F69',
                color: '#fff'
              }
            }
      },
      button: {
        '&:hover': {
          textDecoration: 'none',
          backgroundColor: '#193F69',
          color: '#fff'
        }
      }
    },
    MuiSelect: {
      root: {
        '&&Mui-focused': {
          backgroundColor: 'rgba(0, 0, 0, 0.08)'
        }
      },
      outlined: {
        '&&': {
          MuiSelect: {
            outlined: {
              '&[aria-expanded=true]': {
                backgroundColor: '#F1F1F1'
              }
            }
          }
        }
      }
    }
  }
});
