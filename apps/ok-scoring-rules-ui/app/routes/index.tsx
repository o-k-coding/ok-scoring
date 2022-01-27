import { LinksFunction } from 'remix'
import stylesUrl from "../styles/index.css";

// This tells remix to associate this stylesheet with this module
// The important this is that this style will NOT show up in any sibling routes (/rules for instance)
export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
}


export default function () {
  return <>Hello Index Route</>
}
