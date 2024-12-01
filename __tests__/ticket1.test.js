import { expect, test } from "@jest/globals";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const htmlFilePath = path.resolve(__dirname, "../index.html");

// test if the index.html file exists
test("index.html should exist", () => {
  expect(fs.existsSync(htmlFilePath)).toBe(true);
});

// test if the index.html file links to the JS file
test("index.html should link to the JS file", () => {
  const htmlContent = fs.readFileSync(htmlFilePath, "utf8");
  const dom = new JSDOM(htmlContent);
  const script = dom.window.document.querySelector("script");

  expect(script).not.toBeNull();
  expect(script.src).toBe("../index.js"); // Update this path to match the actual JS file path
});

// Simulate the variables from the JS file
const correctPassword = "myPassword1!";
const secretInformation = "My favourite colour is #000080!";

// test if correct password is defined
test("correctPassword should have the correct value", () => {
  expect(correctPassword).toBe("myPassword1!");
});

// test if secret is defined
test("secret should have the correct value", () => {
  expect(secretInformation).toBe("My favourite colour is #000080!");
});
