// __tests__/Login.test.js
// From CSE186 Class Announcement

import {render, fireEvent} from '@testing-library/react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {BrowserRouter} from 'react-router-dom';

import Login from '../Login';

const URL = 'http://localhost:3010/v0/login';

const server = setupServer(
  rest.post(URL, async (req, res, ctx) => {
    const user = await req.json();
    return user.email === 'molly@books.com' ?
      res(ctx.json({name: 'Molly Member', accessToken: 'some-old-jwt'})) :
      res(ctx.status(401, 'Username or password incorrect'));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Success', async () => {
  render(<BrowserRouter><Login /></BrowserRouter>);
  window.alert = () => { };
  const email = screen.getByLabelText('Email Address');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('Password');
  await userEvent.type(passwd, 'mollymember');
  fireEvent.click(screen.getByText('Log In'));
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null);
  });
});

test('Fail', async () => {
  render(<BrowserRouter><Login /></BrowserRouter>);
  let alerted = false;
  window.alert = () => {
    alerted = true;
  };
  fireEvent.click(screen.getByText('Log In'));
  await waitFor(() => {
    expect(alerted).toBe(true);
  });
  expect(localStorage.getItem('user')).toBe(null);
});

