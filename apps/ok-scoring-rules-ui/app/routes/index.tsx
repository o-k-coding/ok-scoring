import { Link, LinksFunction } from 'remix'
import stylesUrl from "../styles/index.css";
import { Box, Heading, HStack, Link as ChakraLink } from '@chakra-ui/react';

// This tells remix to associate this stylesheet with this module
// The important this is that this style will NOT show up in any sibling routes (/rules for instance)
export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
}


export default function () {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Heading as="h1">
        OK Scoring Rules Template UI
      </Heading>
      <HStack>
        <ChakraLink as={Link} to="/rules">
          Rules
        </ChakraLink>
      </HStack>
    </Box>
  );
}
