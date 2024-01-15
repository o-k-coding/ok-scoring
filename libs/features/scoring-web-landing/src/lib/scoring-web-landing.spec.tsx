import { render } from '@testing-library/react';

import ScoringWebLanding from './scoring-web-landing';

describe('ScoringWebLanding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ScoringWebLanding />);
    expect(baseElement).toBeTruthy();
  });
});
