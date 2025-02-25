import type { FunctionComponent } from 'react';
import React from 'react';
import getElementName from '../getElementName.js';

describe('getElementName', () => {
  it('of a html element', () => {
    expect(getElementName(<div />)).toBe('div');
    expect(getElementName(<span />)).toBe('span');
  });

  it('of non elements', () => {
    expect(getElementName('div')).toBeNull();
    expect(getElementName(null)).toBeNull();
    expect(getElementName(3)).toBeNull();
    expect(getElementName(undefined)).toBeNull();
  });

  it('of a functional component', () => {
    const Example: FunctionComponent = () => <div />;
    expect(getElementName(<Example />)).toBe('Example');
  });

  it('of a class component', () => {
    // eslint-disable-next-line react/prefer-stateless-function
    class Example extends React.Component {
      public render(): JSX.Element {
        return <div />;
      }
    }
    expect(getElementName(<Example />)).toBe('Example');
  });
});
