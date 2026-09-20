import { render, screen } from '@testing-library/react';
import App from './App';

// the <base> is what the bootstrap in index.html leaves for the app
const openAt = (base: string, pathname: string) => {
  document.head.innerHTML = `<base href="${base}">`;
  window.history.replaceState({}, '', pathname);
  return render(<App />);
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.useRealTimers();
  document.head.innerHTML = '';
  window.history.replaceState({}, '', '/');
});

describe('App routing', () => {
  test('opens the home page in the site root', () => {
    openAt('/', '/');
    expect(screen.getByRole('heading')).toHaveTextContent('Algorithms Visualizer');
  });

  test('opens the home page under a prefix', () => {
    openAt('/asd/', '/asd/');
    expect(screen.getByRole('heading')).toHaveTextContent('Algorithms Visualizer');
  });

  test.each(['/', '/asd/', '/qwe/'])(
    'opens the sort page entered directly under "%s", without the home page',
    (base) => {
      openAt(base, `${base}sort/bubble`);
      expect(screen.getByRole('link', { name: 'Bubble Sort' })).toHaveClass('textSelected');
      expect(screen.getByLabelText('Array Length:')).toBeInTheDocument();
    }
  );

  test('opens the search page entered directly, without the home page', () => {
    openAt('/qwe/', '/qwe/search/binary');
    expect(screen.getByRole('link', { name: 'Binary Search' })).toBeInTheDocument();
    expect(screen.getByLabelText('Array Length:')).toBeInTheDocument();
  });

  test('keeps the route out of the address hash', () => {
    openAt('/asd/', '/asd/sort/bubble');
    expect(window.location.hash).toBe('');
    expect(window.location.pathname).toBe('/asd/sort/bubble');
  });

  test('shows 404 for an unknown route', () => {
    openAt('/asd/', '/asd/nothing');
    expect(screen.getByRole('heading')).toHaveTextContent('404');
  });
});
