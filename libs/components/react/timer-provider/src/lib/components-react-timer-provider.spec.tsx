import { render } from '@testing-library/react';

import ComponentsReactTimerProvider from './components-react-timer-provider';

describe('ComponentsReactTimerProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ComponentsReactTimerProvider />);
    expect(baseElement).toBeTruthy();
  });
});
