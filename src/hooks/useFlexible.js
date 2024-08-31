/* eslint-disable react-hooks/rules-of-hooks */
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export function useResponsive(query, start, end) {
  const theme = useTheme();
  const breakpointQueries = {
    up: theme.breakpoints.up(start),
    down: theme.breakpoints.down(start),
    between: theme.breakpoints.between(start, end),
    only: theme.breakpoints.only(start)
  };

  return useMediaQuery(breakpointQueries[query] || breakpointQueries.only);
}

export function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();

  return keys.find(key => useMediaQuery(theme.breakpoints.up(key))) || 'xs';
}
