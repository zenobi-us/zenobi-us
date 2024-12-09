import { render } from '@testing-library/react';

import { flattenChildren } from './ui-react-children';

describe('uiReactChildren', () => {
  it('should work', () => {
    const children = flattenChildren(
      <>
        <div>ui-react-children</div>
        <div>ui-react-children</div>
        <div>ui-react-children</div>
      </>
    );

    const result = render(
      <div>
        {children.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );

    expect(result).toBeDefined();
  });
});
