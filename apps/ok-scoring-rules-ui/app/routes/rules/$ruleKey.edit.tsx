import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'remix';
import { DealerSettings, DealerSettingsText, GameRulesTemplate } from '../../../../../libs/data/game-models/src';

type LoaderData = {
  data: GameRulesTemplate;
};

export const loader: LoaderFunction = async ({ params }) => {
  const data = await fetch(`http://localhost:4000/v1/rules/${params.ruleKey}`).then(r => r.json());
  console.log('Fetched data for rule', data);
  return data;
};

export const action: ActionFunction = async ({
  request, params
}) => {
  const form = await request.formData();


  const rulesTemplateData: any = { key: params.ruleKey };
  // hack way to convert a checked checkbox input into a boolean. Need to figure out a better support for that.
  form.forEach((value, key) => {
    let data: any = value;

    if (value === 'on') data = true;
    if (key.toLowerCase().includes('schema') && typeof value === 'string') data = JSON.parse(value as string)
    rulesTemplateData[key] = data;
  });

  // TODO send request to server
  console.log('Saving updates to rules template', JSON.stringify(rulesTemplateData));

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rulesTemplateData),
  }

  await fetch('http://localhost:4000/v1/rules/update', requestOptions).then(r => console.log('RESPONSE FOR UPDATE', r));

  // console.log('Saved rules template!', key);
  // The redirect utility is a simple utility in Remix for creating a Response object that has the right headers/status codes to redirect the user.
  return redirect(`/rules/${rulesTemplateData.key}`);
};

export default function EditRuleRoute() {
  const { data } = useLoaderData<LoaderData>();

  // React is complaining on the backend about the onChange listeners. They do not actually get shipped with the code this way though
  return (
    <div>
      <p>Add your own Rules</p>
      <form method='post'>
        <div>
          <label>
            Description: <input type='text' name='description' value={data.description} />
          </label>
        </div>
        <div>
          <label>
            Valid State Schema (Must be valid json schema): <textarea name='validStateSchema' value={JSON.stringify(data.validStateSchema)} />
          </label>
        </div>
        <div>
          <label>
            Winning Schema (Must be valid json schema): <textarea name='winningSchema' value={JSON.stringify(data.winningSchema)} />
          </label>
        </div>
        <div>
          <label>
            Dealer Settings:
            <select name='dealerSettings' value={data.dealerSettings}>
              {
                Object.values(DealerSettings).map(d => (
                  <option key={d} value={d}>
                    {DealerSettingsText[d]}
                  </option>
                ))
              }
            </select>
          </label>
        </div>

        <div>
          <label>
            First to score wins:
            <input type="checkbox" id="firstToScoreWins" name="firstToScoreWins" checked={data.firstToScoreWins} />
          </label>
        </div>

        <div>
          <label>
            High score wins:
            <input type="checkbox" id="highScoreWins" name="highScoreWins" checked={data.highScoreWins} />
          </label>
        </div>

        <div>
          <label>
            Players must be on the same round:
            <input type="checkbox" id="playersMustBeOnSameRound" name="playersMustBeOnSameRound" checked={data.playersMustBeOnSameRound} />
          </label>
        </div>

        <div>
          <label>
            Archive Template:
            <input type="checkbox" id="playersMustBeOnSameRound" name="archived" checked={data.archived} />
          </label>
        </div>

        <div>
          <button type='submit' className='button'>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
