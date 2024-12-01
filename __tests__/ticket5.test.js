import { expect, test, jest } from "@jest/globals";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";


const jsFilePath = path.resolve(__dirname, "../index.js"); // Update this path

// test to check if function authenticateUser is created
test("should create a function 'authenticateUser'", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the function 'authenticateUser' is created
  expect(typeof window.authenticateUser).toBe("function");
});

// test to check if it returns true if the correct password is entered on the first attempt
test("should return true if the correct password is entered on the first attempt", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt function
  const mockPrompt = jest.fn().mockReturnValueOnce("myPassword1!");
  window.prompt = mockPrompt;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if authenticateUser returns true
  const isLoggedIn = window.authenticateUser();
  expect(isLoggedIn).toBe(true);
  expect(mockPrompt).toHaveBeenCalledTimes(1);
});

// test to check if it returns false after 3 incorrect attempts
test("should return false after 3 incorrect attempts", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt function
  const mockPrompt = jest
    .fn()
    .mockReturnValueOnce("wrongPassword")
    .mockReturnValueOnce("wrongPassword")
    .mockReturnValueOnce("wrongPassword");
  window.prompt = mockPrompt;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if authenticateUser returns false after 3 incorrect attempts
  const isLoggedIn = window.authenticateUser();
  expect(isLoggedIn).toBe(false);
  expect(mockPrompt).toHaveBeenCalledTimes(3);
});

// test to check if it returns true if the correct password is entered after some incorrect attempts
test("should return true if the correct password is entered after some incorrect attempts", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt function
  const mockPrompt = jest
    .fn()
    .mockReturnValueOnce("wrongPassword")
    .mockReturnValueOnce("myPassword1!");
  window.prompt = mockPrompt;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if authenticateUser returns true after some incorrect attempts
  const isLoggedIn = window.authenticateUser();
  expect(isLoggedIn).toBe(true);
  expect(mockPrompt).toHaveBeenCalledTimes(2);
});
