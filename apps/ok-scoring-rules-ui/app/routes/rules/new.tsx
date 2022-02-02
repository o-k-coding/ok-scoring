import { ActionFunction, redirect } from 'remix';
import { DealerSettings, DealerSettingsText } from '../../../../../libs/data/game-models/src';

export const action: ActionFunction = async ({
  request
}) => {
  const form = await request.formData();


  const rulesTemplateData: any = {};
  // hack way to convert a checked checkbox input into a boolean. Need to figure out a better support for that.
  form.forEach((value, key) => {
    let data: any = value;

    if (value === 'on') data = true;
    if (key.toLowerCase().includes('schema') && typeof value === 'string') data = JSON.parse(value as string)
    rulesTemplateData[key] = data;
  })

  // TODO send request to server
  console.log('Saving new rules template', rulesTemplateData);

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(rulesTemplateData),
  }

  const { key } = await fetch('http://localhost:4000/v1/rules/create', requestOptions).then(r => r.json())

  console.log('Saved rules template!', key);

  // const joke = await db.joke.create({ data: fields });
  // The redirect utility is a simple utility in Remix for creating a Response object that has the right headers/status codes to redirect the user.
  return redirect(`/rules/${key}`);
};

export default function NewRuleRoute() {
  return (
    <div>
      <p>Add your own Rules</p>
      <form method='post'>
        <div>
          <label>
            Description: <input type='text' name='description' />
          </label>
        </div>
        <div>
          <label>
            Valid State Schema (Must be valid json schema): <textarea name='validStateSchema' />
          </label>
        </div>
        <div>
          <label>
            Winning Schema (Must be valid json schema): <textarea name='winningSchema' />
          </label>
        </div>
        <div>
          <label>
            Dealer Settings:
            <select name='dealerSettings'>
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
            <input type="checkbox" id="firstToScoreWins" name="firstToScoreWins" />
          </label>
        </div>

        <div>
          <label>
            High score wins:
            <input type="checkbox" id="highScoreWins" name="highScoreWins" defaultChecked />
          </label>
        </div>

        <div>
          <label>
            Players must be on the same round:
            <input type="checkbox" id="playersMustBeOnSameRound" name="playersMustBeOnSameRound" />
          </label>
        </div>

        <div>
          <button type='submit' className='button'>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
