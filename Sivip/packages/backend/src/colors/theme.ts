import colors from "colors";

interface ThemeColors {
  success: (msg: string) => string;
  error: (msg: string) => string;
  info: (msg: string) => string;
  warning: (msg: string) => string;
}

const themedColors = colors as typeof colors & ThemeColors;

themedColors.setTheme({
  success: "green",
  error: "red",
  info: "blue",
  warning: "yellow",
});

export const log = {
  success: (msg: string) => console.log(themedColors.success(msg)),
  error: (msg: string, err?: unknown, p0?: string, reason?: unknown) => {
    console.error(themedColors.error(msg));
    if (err) console.error(err);
  },
  // Hacer el segundo parámetro opcional
  info: (msg: string, details?: { body?: any; origin?: string; userAgent?: string }) => {
    console.log(themedColors.info(msg));
    if (details && process.env.NODE_ENV === 'development') {
      console.log('  Detalles:', details);
    }
  },
  warning: (msg: string) => console.warn(themedColors.warning(msg)),
};

export default themedColors;