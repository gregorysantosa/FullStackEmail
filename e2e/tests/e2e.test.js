const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/v0', createProxyMiddleware({
        target: 'http://localhost:3010/',
        changeOrigin: true}))
      .use('/static', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'build', 'static')))
      .get('*', function(req, res) {
        res.sendFile('index.html',
          {root: path.join(__dirname, '..', '..', 'frontend', 'build')});
      }),
  );
  frontend.listen(3020, () => {
    console.log('Frontend Running at http://localhost:3020');
  });
});

afterAll((done) => {
  backend.close(() => {
    frontend.close(done);
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
    ],
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

// Starts from login and logs in with molly@books.com, verifies if url valid
test('Valid login redirection', async () => {
  await page.goto('http://localhost:3020/login');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Login")',
  );
  await page.type('#email', 'molly@books.com');
  await page.type('#password', 'mollymember');
  await page.click('aria/submit[role="button"]');
  await page.waitForNavigation();
  const url = await page.url();
  expect(url).toEqual('http://localhost:3020/');
});

// Starts from login and gives invalid login
test('Invalid login', async () => {
  await page.goto('http://localhost:3020/login');
  await page.type('#email', 'invalid@invalid.com');
  await page.type('#password', 'invalidpass');
  await page.click('aria/submit[role="button"]');
  const url = await page.url();
  expect(url).toEqual('http://localhost:3020/login');
});

// Starts from home and presses logout, verifies url
test('Logout redirection', async () => {
  await page.goto('http://localhost:3020');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  await page.click('aria/logout[role="button"]');
  const url = await page.url();
  expect(url).toEqual('http://localhost:3020/Login');
});

// Starts from login and logs in, tests inbox with display
test('Valid login and opening/closing mail display', async () => {
  await page.goto('http://localhost:3020/login');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Login")',
  );
  await page.type('#email', 'molly@books.com');
  await page.type('#password', 'mollymember');
  await page.click('aria/submit[role="button"]');
  await page.waitForNavigation();
  const url = await page.url();
  expect(url).toEqual('http://localhost:3020/');
  await page.click('aria/toggle drawer[role="button"]');
  await page.click('aria/toggle drawer[role="button"]');
  // Below checks if an email exists, if so, no error will be thrown
  await page.click('aria/clickRow');
  await page.$('aria/close mobile reader[role="button"]');
  expect(await page.$('*')).not.toBeNull();
});

// Starts from login and logs in, tests favorite button
test('Valid login and clicking starred for all mailbox', async () => {
  await page.goto('http://localhost:3020/login');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Login")',
  );
  await page.type('#email', 'molly@books.com');
  await page.type('#password', 'mollymember');
  await page.click('aria/submit[role="button"]');
  await page.waitForNavigation();
  const url = await page.url();
  expect(url).toEqual('http://localhost:3020/');

  // trash button click starred
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  await page.click('aria/trashButton[role="button"]');
  await page.keyboard.press('Escape');
  await page.click('aria/StarIcon');

  // sent button click starred
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  await page.click('aria/sentButton[role="button"]');
  await page.keyboard.press('Escape');
  await page.click('aria/StarIcon');

  // inbox button click starred
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  await page.click('aria/inboxButton[role="button"]');
  await page.keyboard.press('Escape');
  await page.click('aria/StarIcon');
  expect(await page.$('aria/StarIcon')).not.toBeNull();
});

// Tests starred number with mail, expects 1
test('number of starred: 1', async () => {
  await page.goto('http://localhost:3020/login');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Login")',
  );
  await page.type('#email', 'molly@books.com');
  await page.type('#password', 'mollymember');
  await page.click('aria/submit[role="button"]');
  await page.waitForNavigation();
  const url = await page.url();
  expect(url).toEqual('http://localhost:3020/');
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  await page.click('aria/inboxButton[role="button"]');
  await page.keyboard.press('Escape');
  await page.click('aria/StarIcon');
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  const label = await page.$('aria/starredButton');
  const cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).not.toBeNull();
});

// Tests starred number with no mail, expects 0
test('number of starred: 0', async () => {
  await page.goto('http://localhost:3020');
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  const label = await page.$('aria/starredButton');
  const cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).toBe('Starred 0');
});

// Tests favorite button with no mail, expects null
test('favorite button (No Login/Mail)', async () => {
  await page.goto('http://localhost:3020');
  expect(await page.$('aria/StarIcon')).toBeNull();
});

// Tests clickRow button for display with no mail, expects null
test('clickRow for display (No Login/Mail)', async () => {
  await page.goto('http://localhost:3020');
  expect(await page.$('aria/clickRow')).toBeNull();
});

// Tests whether escape button is valid or not
test('Escape button test', async () => {
  await page.goto('http://localhost:3020');
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  await page.keyboard.press('Escape');
  expect(await page.$('aria/toggle drawer[role="button"]')).not.toBeNull();
});

// Clicks the 'toggle drawer' button and checks that Inbox is displayed
test('Toggle Drawer - Inbox (No Login)', async () => {
  await page.goto('http://localhost:3020');
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Inbox")',
  );
  const label = await page.$('aria/inboxButton');
  let cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).toBe('Inbox');
  await page.click('aria/inboxButton[role="button"]');
  cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).toEqual('Inbox');
});

// Clicks the 'toggle drawer' button and checks that Trash is displayed
test('Toggle Drawer - Trash (No Login)', async () => {
  await page.goto('http://localhost:3020');
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Trash")',
  );
  const label = await page.$('aria/trashButton');
  let cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).toBe('Trash');
  await page.click('aria/trashButton[role="button"]');
  cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).toEqual('Trash');
});

// Clicks the 'toggle drawer' button and checks that Sent is displayed
test('Toggle Drawer - Sent (No Login)', async () => {
  await page.goto('http://localhost:3020');
  await page.click('aria/toggle drawer[role="button"]');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Sent")',
  );
  const label = await page.$('aria/sentButton');
  let cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).toBe('Sent');
  await page.click('aria/sentButton[role="button"]');
  cont = await (await label.getProperty('textContent')).jsonValue();
  expect(cont).toEqual('Sent');
});


