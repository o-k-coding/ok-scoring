import { Link, LoaderFunction, useLoaderData } from 'remix';
import { GameRulesTemplate } from '../../../../../libs/data/game-models/src';

type LoaderData = {
  data: GameRulesTemplate;
};

export const loader: LoaderFunction = async ({ params }) => {
  const data = await fetch(`http://localhost:4000/v1/rules/${params.ruleKey}`).then(r => r.json());
  console.log('Fetched data for rule', data);
  return data;
};

export default function RuleRoute() {
  const { data } = useLoaderData<LoaderData>();
  return (
    <div>
      <p>{data.description}</p>
      <Link
        to={`/rules/${data.key}/edit`}
        title="Edit rule"
        aria-label="Edit rule"
      >
        Edit
      </Link>
    </div>
  );
}
