import { Box } from '../ds/box/Box';

export function ResponsiveIndicator() {
  return (
    <Box direction="column">
      <Box className="flex gap-4">
        <Box>mobileSmall</Box>
        <Box className="block">visible</Box>
        <Box className="hidden landscape:block">landscape</Box>
      </Box>
      <Box className="flex gap-4">
        <Box>mobileMedium</Box>
        <Box className="hidden md:block">visible</Box>
        <Box className="hidden md:landscape:block">landscape</Box>
      </Box>
      <Box className="flex gap-4">
        <Box>mobileLarge</Box>
        <Box className="hidden lg:block">visible</Box>
        <Box className="hidden lg:landscape:block">landscape</Box>
      </Box>
      <Box className="flex gap-4">
        <Box>tablet</Box>
        <Box className="hidden xl:block">visible</Box>
        <Box className="hidden xl:landscape:block">landscape</Box>
      </Box>
    </Box>
  );
}
