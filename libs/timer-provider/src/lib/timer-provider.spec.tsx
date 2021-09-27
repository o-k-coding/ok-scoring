import { render } from '@testing-library/react';

import TimerProvider from './timer-provider';

describe('TimerProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TimerProvider />);
    expect(baseElement).toBeTruthy();
  });
});
