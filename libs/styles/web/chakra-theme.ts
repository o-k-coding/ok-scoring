import { extendTheme } from '@chakra-ui/react'
import { colors as themeColors } from '../colors';

// TODO need to figure out what colors to use here
const colors = {
  brand: {
    900: themeColors.primary,
    800: themeColors.primaryLight,
    700: themeColors.secondary,
  },
};

// const fonts = {
//   heading: `'Open Sans', sans-serif`,
//   body: `'Raleway', sans-serif`
// };

const theme = extendTheme({
  colors,
});

export default theme;
