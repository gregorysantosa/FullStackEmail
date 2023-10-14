import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {getOnlyVisible, getClickable,
  getNotVisible, setNarrow, setWide, getAnyVisible} from './common';
import {waitFor} from '@testing-library/react';

import Home from '../Home';
import SharedContext from '../SharedContext';

const molly = {
  name: 'Molly Member',
  accessToken: 'some-old-jwt',
};

const inbox = [
  {
    'mailbox': {
      'Name': 'Molly Member',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Molly Member',
        'email': 'molly@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
];
const allDates = [
  {
    'mailbox': {
      'Name': 'Molly Member',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Molly Member',
        'email': 'molly@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
  {
    'mailbox': {
      'Name': 'Molly Member',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Molly Member',
        'email': 'molly@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
  {
    'mailbox': {
      'Name': 'Molly Member',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Molly Member',
        'email': 'molly@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
  {
    'mailbox': {
      'Name': 'Molly Member',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Molly Member',
        'email': 'molly@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
  {
    'mailbox': {
      'Name': 'Molly Member',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Molly Member',
        'email': 'molly@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
];

const inboxWithOthers = [
  {
    'mailbox': {
      'Name': 'Molly Member',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Molly Member',
        'email': 'molly@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
  {
    'mailbox': {
      'Name': 'Jacob Beans',
      'Owner': 'molly@books.com',
    },
    'mail': {
      'to': {
        'name': 'Jacob Beans',
        'email': 'jbeans@books.com',
      },
      'from': {
        'name': 'Dwayne',
        'email': 'dwayne@rock.com',
      },
      'sent': '2022-11-30T23:00:00Z',
      'Mailbox': 'Inbox',
      'content': 'Rock content',
      'subject': 'Dwayne the Rock Wants to Speak',
      'received': '2022-11-30T23:00:00Z',
      'read': 600,
      'favorite': 'grey',
    },
  },
];

let box = undefined;

const trash = inbox;

const URL = 'http://localhost:3010/v0/Mailbox?mailbox=Inbox';
const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return box ? res(ctx.json(box)) :
      res(ctx.status(404, 'Unknown mailbox'));
  }),
);

beforeAll(() => {
  localStorage.setItem('user', JSON.stringify(molly));
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Unknown box', async () => {
  const mailbox = undefined;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
});

test('Unknown mailbox', async () => {
  const mailbox = [];
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  await screen.findAllByText('Inbox');
});

test('Defined mailbox - Inbox', async () => {
  const mailbox = inbox;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  await screen.findAllByText('Dwayne');
});

test('Defined mailbox - InboxWithOthers', async () => {
  const mailbox = inboxWithOthers;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  await screen.findAllByText('Dwayne');
});

test('Long subject and name', async () => {
  const mailbox = [
    {
      'mailbox': {
        'Name': 'Molly Member',
        'Owner': 'molly@books.com',
      },
      'mail': {
        'to': {
          'name': 'Molly Member',
          'email': 'molly@books.com',
        },
        'from': {
          'name': 'Dwayne asdjflkjasdflmsdflasjifldaskjflsdf'+
          'asdfhlasdkfjlsdkfmdlasdfkasdufosdfjsdfpjsdlsdsafk',
          'email': 'dwayne@rock.com',
        },
        'sent': '2022-11-30T23:00:00Z',
        'Mailbox': 'Inbox',
        'content': 'Rock content adsklfjlasdfkasldkfjasdklfj'+
        'askldjfalsdkfnlasdfkjasdlfasdlfkmsadlfkasfjaslfkjld',
        'subject': 'Dwayne the Rock Wants to Speak',
        'received': '2022-11-30T23:00:00Z',
        'read': 600,
        'favorite': 'grey',
      },
    },
  ];
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
});

test('Defined mailbox - Today, Yesterday, month, year', async () => {
  const mailbox = allDates;
  const today = new Date();
  const yesterday = new Date(today.getFullYear(),
    today.getMonth(), 25);
  const startOfYear = new Date(2022, 0, 1);
  const startOfYear2 = new Date(2022, 0, 15);
  const previousYears = new Date(2020, 0, 1);
  mailbox[0]['mail']['received']=today.toISOString();
  mailbox[1]['mail']['received']=yesterday.toISOString();
  mailbox[2]['mail']['received']=startOfYear.toISOString();
  mailbox[3]['mail']['received']=startOfYear2.toISOString();
  mailbox[4]['mail']['received']=previousYears.toISOString();
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  await screen.findAllByText('Dwayne');
});

test('Defined mailbox - seconds and minutes', async () => {
  const mailbox = allDates;
  const today = new Date();
  const one = new Date(today.getFullYear(), today.getMonth(),
    today.getDate(), 15, 15, 15, 15);
  const two = new Date(today.getFullYear(), today.getMonth(),
    today.getDate(), 1, 1, 1, 1);
  mailbox[0]['mail']['received']=one.toISOString();
  mailbox[1]['mail']['received']=two.toISOString();
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  await screen.findAllByText('Dwayne');
});

test('Toggle Drawer Clickable', async () => {
  const mailbox = inbox;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  setNarrow();
  setWide();
  getClickable('toggle drawer');
});

test('Open then close Drawer', async () => {
  const mailbox = inbox;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  getOnlyVisible('Inbox');
  getNotVisible('Trash');
  fireEvent.click(getClickable('toggle drawer'));
  getAnyVisible('Inbox');
  getOnlyVisible('Trash');
});

test('Open Drawer and click inbox, sent, trash, starred', async () => {
  const mailbox = inbox;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  getOnlyVisible('Inbox');
  getNotVisible('Trash');
  fireEvent.click(getClickable('toggle drawer'));
  fireEvent.click(getClickable('trashButton'));
  fireEvent.click(getClickable('sentButton'));
  fireEvent.click(getClickable('starredButton'));
  fireEvent.click(getClickable('inboxButton'));
  getAnyVisible('Inbox');
  getOnlyVisible('Trash');
});

test('Click mail', async () => {
  const mailbox = inbox;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  fireEvent.click(getOnlyVisible('Dwayne'));
});

test('Click mail and close', async () => {
  const mailbox = inbox;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  fireEvent.click(getOnlyVisible('Dwayne'));
  fireEvent.click(getClickable('close mobile reader'));
});

test('Click favorite twice', async () => {
  const mailbox = inbox;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  fireEvent.click(getClickable('StarIcon'));
  fireEvent.click(getClickable('StarIcon'));
});

test('Fetch test 2', async () => {
  const mailbox = 'Trash';
  box = trash;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  await waitFor(() => {
    expect(localStorage.getItem('rand')).not.toBe(null);
  });
  fireEvent.click(getClickable('logout'));
});

test('No user', async () => {
  localStorage.removeItem('user');
  const mailbox = undefined;
  render(
    <SharedContext.Provider value = {{mailbox}}><Home />
    </SharedContext.Provider>,
  );
  await waitFor(() => {
    expect(localStorage.getItem('random')).not.toBe(null);
  });
  fireEvent.click(getClickable('logout'));
});
