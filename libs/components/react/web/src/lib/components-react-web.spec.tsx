import { render } from '@testing-library/react';

import ComponentsReactWeb from './components-react-web';

describe('ComponentsReactWeb', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ComponentsReactWeb />);
    expect(baseElement).toBeTruthy();
  });
});
