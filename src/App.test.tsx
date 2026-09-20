import { render, screen } from '@testing-library/react';
import App from './App';

const openAt = (hash: string) => {
  window.location.hash = hash;
  return render(<App />);
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.useRealTimers();
  window.location.hash = '';
});

describe('App routing', () => {
  test('opens the home page in the site root', () => {
    openAt('');
    expect(screen.getByRole('heading')).toHaveTextContent('Algorithms Visualizer');
  });

  test('opens the sort page entered directly, without the home page', () => {
    openAt('#/sort/bubble');
    expect(screen.getByRole('link', { name: 'Bubble Sort' })).toHaveClass('textSelected');
    expect(screen.getByLabelText('Array Length:')).toBeInTheDocument();
  });

  test('opens the search page entered directly, without the home page', () => {
    openAt('#/search/binary');
    expect(screen.getByRole('link', { name: 'Binary Search' })).toHaveClass('textSelected');
  });

  test('shows 404 for an unknown route', () => {
    openAt('#/nothing');
    expect(screen.getByRole('heading')).toHaveTextContent('404');
  });
});
