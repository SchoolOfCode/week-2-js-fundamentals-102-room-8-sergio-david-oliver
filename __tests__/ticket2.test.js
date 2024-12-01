import { expect, test, jest } from "@jest/globals";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const jsFilePath = path.resolve(__dirname, "../index.js"); // Update this path

// test if user input is saved in a variable
test("should save user input from prompt in a variable", () => {
  const jsContent = fs.readFileSync(jsFilePath, "utf8");
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`, {
    runScripts: "dangerously",
  });
  const { window } = dom;

  // Mock the prompt function
  const mockPrompt = jest.fn().mockReturnValue("userInput");
  window.prompt = mockPrompt;

  // Execute the JS file in the context of the JSDOM window
  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = jsContent;
  window.document.body.appendChild(scriptEl);

  // Check if the prompt was called and the input was saved
  expect(mockPrompt).toHaveBeenCalledWith("Please enter the password.");
  expect(window.userInput).toBe("userInput"); // Assuming you saved the input in a variable called userInput
});
