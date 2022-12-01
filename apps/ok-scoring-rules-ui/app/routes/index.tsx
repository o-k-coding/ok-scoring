import { Link, LinksFunction } from 'remix'
import stylesUrl from "../styles/index.css";
import { Box, Heading, HStack, Link as ChakraLink, Image } from '@chakra-ui/react';
import logo from '../images/icon-adaptive.png';
// This tells remix to associate this stylesheet with this module
// The important this is that this style will NOT show up in any sibling routes (/rules for instance)
export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
}


export default function () {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" >
      <Image src={logo} w="25%"></Image>
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
