import { render } from '@testing-library/react';

import FeaturesWebLanding from './features-web-landing';

describe('FeaturesWebLanding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesWebLanding />);
    expect(baseElement).toBeTruthy();
  });
});
