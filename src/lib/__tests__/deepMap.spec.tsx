import type { ReactElement, ReactNode } from 'react';
import React, { cloneElement, isValidElement } from 'react';
import type { ReactTestInstance, ReactTestRendererJSON } from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import type { ReadonlyDeep } from 'type-fest';
import deepMap from '../deepMap.js';

interface Props {
  children?: ReactNode;
}

const DeepMapped = ({ children }: ReadonlyDeep<Props>): ReactElement => (
  <div>
    {deepMap(children, (child: ReadonlyDeep<ReactNode>) => {
      if (isValidElement<{ className: string }>(child) && child.type === 'b') {
        return cloneElement(child, {
          ...child.props,
          className: 'mapped',
        });
      }
      return child;
    })}
  </div>
);

describe('deepMap', () => {
  it('nested elements', () => {
    const element = TestRenderer.create(
      <DeepMapped>
        <b>1</b>
        <b>2</b>
        test text
        <span>
          <b>3</b>
        </span>
        <div>
          <b>
            <b>4</b>
          </b>
        </div>
      </DeepMapped>,
    );

    const mapped = element.root.findAll(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      (node: ReadonlyDeep<ReactTestInstance>) =>
        node.type === 'b' && node.props.className === 'mapped',
    );
    const unmapped = element.root.findAll(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      (node: ReadonlyDeep<ReactTestInstance>) =>
        node.type === 'b' && node.props.className !== 'mapped',
    );

    expect(mapped).toHaveLength(5);
    expect(unmapped).toHaveLength(0);
  });

  it('non nested elements', () => {
    const element = TestRenderer.create(
      <DeepMapped>
        <b>1</b>
        <b>2</b>
      </DeepMapped>,
    );

    const mapped = element.root.findAll(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      (node: ReadonlyDeep<ReactTestInstance>) =>
        node.type === 'b' && node.props.className === 'mapped',
    );
    const unmapped = element.root.findAll(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      (node: ReadonlyDeep<ReactTestInstance>) =>
        node.type === 'b' && node.props.className !== 'mapped',
    );

    expect(mapped).toHaveLength(2);
    expect(unmapped).toHaveLength(0);
  });

  it('empty children', () => {
    const element = TestRenderer.create(<DeepMapped />);
    const { children } = element.toJSON() as ReactTestRendererJSON;

    expect(children).toBeNull();
  });
});
