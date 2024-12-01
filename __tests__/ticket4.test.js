import { expect, test, jest } from "@jest/globals";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import acorn from "acorn";

const jsFilePath = path.resolve(__dirname, "../index.js"); // Update this path

// test to check if the 'attempts' variable is created and assigned to 0
test("should create a variable 'attempts' and assign it to 0", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the 'attempts' variable is created and assigned to 0
  expect(window.attempts).toBe(0);
});

// test to see if a while loop is used
test("should use a while loop", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const parsed = acorn.parse(jsContent, { ecmaVersion: 2020 });

  let hasWhileLoop = false;
  acorn.walk.simple(parsed, {
    WhileStatement(node) {
      hasWhileLoop = true;
    },
  });

  expect(hasWhileLoop).toBe(true);
});

// test to see if secret information is alerted if the password is correct
test("should alert secret information if the password is correct on first attempt", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt and alert functions
  const mockPrompt = jest.fn().mockReturnValueOnce("myPassword1!");
  const mockAlert = jest.fn();
  window.prompt = mockPrompt;
  window.alert = mockAlert;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the alert was called with the correct message
  expect(mockAlert).toHaveBeenCalledWith("My favourite colour is #000080!");
  expect(mockPrompt).toHaveBeenCalledTimes(1);
});

// test to it allows up to 3 attempts and then stops
test("should allow up to 3 attempts and then stop", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt and alert functions
  const mockPrompt = jest
    .fn()
    .mockReturnValueOnce("wrongPassword")
    .mockReturnValueOnce("wrongPassword")
    .mockReturnValueOnce("wrongPassword");
  const mockAlert = jest.fn();
  window.prompt = mockPrompt;
  window.alert = mockAlert;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the prompt was called 3 times and alert was not called
  expect(mockPrompt).toHaveBeenCalledTimes(3);
  expect(mockAlert).not.toHaveBeenCalled();
});

// test to see if the prompt stops after the correct password is entered
test("should stop prompting after correct password is entered", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt and alert functions
  const mockPrompt = jest
    .fn()
    .mockReturnValueOnce("wrongPassword")
    .mockReturnValueOnce("myPassword1!");
  const mockAlert = jest.fn();
  window.prompt = mockPrompt;
  window.alert = mockAlert;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the prompt was called 2 times and alert was called once
  expect(mockPrompt).toHaveBeenCalledTimes(2);
  expect(mockAlert).toHaveBeenCalledWith("My favourite colour is #000080!");
});
