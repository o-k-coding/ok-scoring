import { Link, LinksFunction, LoaderFunction, Outlet, useLoaderData } from 'remix';
import stylesUrl from '../styles/rules.css';
import { GameRulesTemplate } from '@ok-scoring/data/game-models';
import { Button, Heading, Link as ChakraLink } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl
    }
  ];
};

type LoaderData = {
  data: Array<GameRulesTemplate>;
};

export const loader: LoaderFunction = async () => {
  const data = await fetch('http://localhost:4000/v1/rules').then(r => r.json());
  console.log('Fetched data', data);
  return data;
};

// Parent route and entrypoint for Rules, this component has an Outlet for all children for this 'Module'
export default function RulesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="rules-layout">
      <header className="rules-header">
        <Heading as="h1">
          <ChakraLink
            as={Link}
            to="/"
            title="Remix rules"
            aria-label="Remix rules"
          >
            Game Rules Templates
          </ChakraLink>
        </Heading>
      </header>
      <main className="rules-main">
        <div className="container">
          <div className="rules-list">
            {/* <Link to="new" className="button">

            </Link> */}
            <Button as={Link} to={"new"} colorScheme='brand' variant='link' rightIcon={<AddIcon />} marginBottom='4'>
              Add a new rule
            </Button>
            <p>Here are a few more rules to check out:</p>
            <ul>
              {data.data.map(rule => (
                <li key={rule.key}>
                  <ChakraLink
                    as={Link}
                    to={rule.key}
                    title="Remix rules"
                    aria-label="Remix rules"
                  >
                    {rule.description}
                  </ChakraLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="rules-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
