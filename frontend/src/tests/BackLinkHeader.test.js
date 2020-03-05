import React from 'react';
import {render} from '@testing-library/react'
import BackLinkHeader from '../BackLinkHeader';

describe('BackLinkHeader', () => {
  it('does not render when there is no querystring', () => {
    const {container} = render(
      <BackLinkHeader queryString=""/>
    );

    expect(container.textContent).toEqual('');
  });

  it('does not render when returnUrl has no value', () => {
    const {container} = render(
      <BackLinkHeader queryString="?returnUrl="/>
    );

    expect(container.textContent).toEqual('');
  });

  it('does not render when returnUrl is malformed', () => {
    const {container} = render(
      <BackLinkHeader queryString="?returnUrl=asdf"/>
    );

    expect(container.textContent).toEqual('');
  });

  it('does not render when returnUrl is an unsupported domain', () => {
    const {container} = render(
      <BackLinkHeader queryString="?returnUrl=https://google.com"/>
    );

    expect(container.textContent).toEqual('');
  });

  it('does not render when returnUrl is an unsupported domain partially matching whitelisted one', () => {
    const {container} = render(
      <BackLinkHeader queryString="?returnUrl=https://greendreamboard.google.com"/>
    );

    expect(container.textContent).toEqual('');
  });

  it('renders when fully matching a whitelisted domain', () => {
    const {container} = render(
      <BackLinkHeader queryString="?returnUrl=https://greendreamboard.com"/>
    );

    expect(container.textContent).toEqual('Return to Green Dream Board.');
  });

  it('renders when fully matching a whitelisted subdomain', () => {
    const {container} = render(
      <BackLinkHeader queryString="?returnUrl=https://www.greendreamboard.com"/>
    );

    expect(container.textContent).toEqual('Return to Green Dream Board.');
  });
});
