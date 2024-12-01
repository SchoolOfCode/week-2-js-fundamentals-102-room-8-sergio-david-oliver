import { expect, test, jest } from "@jest/globals";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const jsFilePath = path.resolve(__dirname, "../index.js"); // Update this path

// test to alert secret information if the password is correct
test("should alert secret information if the password is correct", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt and alert functions
  const mockPrompt = jest.fn().mockReturnValue("myPassword1!");
  const mockAlert = jest.fn();
  window.prompt = mockPrompt;
  window.alert = mockAlert;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the alert was called with the correct message
  expect(mockAlert).toHaveBeenCalledWith("My favourite colour is #000080!");
});

// test to not alert if the password is incorrect
test("should not alert if the password is incorrect", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt and alert functions
  const mockPrompt = jest.fn().mockReturnValue("wrongPassword");
  const mockAlert = jest.fn();
  window.prompt = mockPrompt;
  window.alert = mockAlert;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the alert was not called
  expect(mockAlert).not.toHaveBeenCalled();
});
