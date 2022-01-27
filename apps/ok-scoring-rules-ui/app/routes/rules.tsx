import { LinksFunction, Outlet } from 'remix';
import stylesUrl from '../styles/rules.css';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: stylesUrl
    }
  ];
};

// Parent route and entrypoint for Rules, this component has an Outlet for all children for this 'Module'
export default function RulesRoute() {
  return (
    <div>
      <h1>Game Rules</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
