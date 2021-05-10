let userInput: unknown;
let userName: string;

userInput = 10;
userInput = "IgnisDa";

if (typeof userInput === "string") {
  userName = userInput;
}

function generateError(message: string, code: number): never {
  throw { message, errorCode: code };
}

generateError("An error occurred", 500);
