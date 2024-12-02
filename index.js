let correctPassword = "myPassword1!";
let secret = "My favourite color is #000080";

let incorrect = 0;

while (incorrect < 3) {
  let userInput = prompt("Please enter your password");
  if (userInput === correctPassword) {
    alert("Correct. " + secret);
    break;
  } else {
    incorrect++;
    alert("Sorry, wrong password. " + incorrect + " failed attempts.");
  }

  if (incorrect === 3) {
    alert("You have been locked out after 3 failed attempts.");
  }
}
