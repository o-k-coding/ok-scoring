import type { MetaFunction, LinksFunction } from '@remix-run/cloudflare';
import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import { cssBundleHref } from '@remix-run/css-bundle';

import rootStyles from "./styles/index.css";
import logo from './images/icon-adaptive.png';

// Note you can add a links function with stylesheets to any route btw
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap' },
  { rel: "stylesheet", href: rootStyles },
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : []),
];

export const meta: MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'OK Scoring Web',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav className='header'>
          <Link to={`/`}>
            <h1 className='title'>
              <img className='logoImage' src={logo} alt='OK Enterprises Mountain Logo'></img>
              OK Scoring
            </h1>
          </Link>

          <ul className='navLinks'>
            <li><Link to={`game`}>Game Scoring</Link></li>
            <li><Link to={`rules`}> Rules Builder</Link></li>
          </ul>


        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
