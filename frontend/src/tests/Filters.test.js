import React from 'react';
import {render} from '@testing-library/react'
import Filters from '../Filters';
import makes from './fixtures/Makes';
import models from './fixtures/Models';

describe('Filters', () => {
  const filterOptions = {
    year: [2000, 1999].map(v => {
      return {label: v, value: v}
    }),
    make: makes.map(v => {
      return {label: v, value: v}
    }),
    model: models.map(v => {
      return {label: v, value: v}
    }),
  };

  it('sets all select dropdowns to readonly when isDisabled=true', () => {
    const onChange = jest.fn();
    const filterValues = {
      year: {label: '1999', value: '1999'},
      make: {label: 'Plymouth', value: 'Plymouth'},
      model: {label: 'Breeze', value: 'Breeze'},
    };
    const {container} = render(
      <Filters
        options={filterOptions}
        values={filterValues}
        onChange={onChange}
        isDisabled={true}
      />
    );

    const selectDropdowns = container.querySelectorAll('input');
    expect(selectDropdowns.length).toEqual(3);

    selectDropdowns.forEach(e => {
      expect(e.disabled).toEqual(true);
    });
  });

  it('sets make and model to readonly when year is not yet selected', () => {
    const onChange = jest.fn();
    const filterValues = {
      year: {label: undefined, value: undefined},
      make: {label: undefined, value: undefined},
      model: {label: undefined, value: undefined},
    };
    const {container} = render(
      <Filters
        options={filterOptions}
        values={filterValues}
        onChange={onChange}
        isDisabled={false}
      />
    );

    const yearDropdown = container.querySelector('#year');
    expect(yearDropdown.disabled).toEqual(false);

    const makeDropdown = container.querySelector('#make');
    expect(makeDropdown.disabled).toEqual(true);

    const modelDropdown = container.querySelector('#model');
    expect(modelDropdown.disabled).toEqual(true);
  });

  it('sets make to NOT be readonly when selecting a year', () => {
    const onChange = jest.fn();
    const filterValues = {
      year: {label: 1999, value: 1999},
      make: {label: undefined, value: undefined},
      model: {label: undefined, value: undefined},
    };
    const {container} = render(
      <Filters
        options={filterOptions}
        values={filterValues}
        onChange={onChange}
        isDisabled={false}
      />
    );

    const yearDropdown = container.querySelector('#year');
    expect(yearDropdown.disabled).toEqual(false);

    const makeDropdown = container.querySelector('#make');
    expect(makeDropdown.disabled).toEqual(false);

    const modelDropdown = container.querySelector('#model');
    expect(modelDropdown.disabled).toEqual(true);
  });

  it('sets model to NOT be readonly when selecting a year and make', () => {
    const onChange = jest.fn();
    const filterValues = {
      year: {label: 1999, value: 1999},
      make: {label: 'Plymouth', value: 'Plymouth'},
      model: {label: undefined, value: undefined},
    };
    const {container} = render(
      <Filters
        options={filterOptions}
        values={filterValues}
        onChange={onChange}
        isDisabled={false}
      />
    );

    const yearDropdown = container.querySelector('#year');
    expect(yearDropdown.disabled).toEqual(false);

    const makeDropdown = container.querySelector('#make');
    expect(makeDropdown.disabled).toEqual(false);

    const modelDropdown = container.querySelector('#model');
    expect(modelDropdown.disabled).toEqual(false);
  });

  it('sets all select dropdowns to editable when year, make, and model are all specified', () => {
    const onChange = jest.fn();
    const filterValues = {
      year: {label: 1999, value: 1999},
      make: {label: 'Plymouth', value: 'Plymouth'},
      model: {label: 'Breeze', value: 'Breeze'},
    };
    const {container} = render(
      <Filters
        options={filterOptions}
        values={filterValues}
        onChange={onChange}
        isDisabled={false}
      />
    );

    const yearDropdown = container.querySelector('#year');
    expect(yearDropdown.disabled).toEqual(false);

    const makeDropdown = container.querySelector('#make');
    expect(makeDropdown.disabled).toEqual(false);

    const modelDropdown = container.querySelector('#model');
    expect(modelDropdown.disabled).toEqual(false);
  });
});
