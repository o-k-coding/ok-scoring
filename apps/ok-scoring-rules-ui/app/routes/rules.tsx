import { Link, LinksFunction, LoaderFunction, Outlet, useLoaderData } from 'remix';
import stylesUrl from '../styles/rules.css';
import { GameRulesTemplate } from '@ok-scoring/data/game-models';

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
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix rules"
              aria-label="Remix rules"
            >
              <span className="logo-medium">Game Rules Templates</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="rules-main">
        <div className="container">
          <div className="rules-list">
            <Link to=".">Get a random rule</Link>
            <p>Here are a few more rules to check out:</p>
            <ul>
              {data.data.map(rule => (
                <li key={rule.key}>
                  <Link to={rule.key}>{rule.description}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="rules-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
