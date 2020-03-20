function eval() {
  // Do not use eval!!!
  return;
}

function checkBrackets(string) {
  //check brackets (open-close)
  let count = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] == "(") {
      count++;
    } else if (string[i] == ")") {
      count--;
    }
  }
  if (count !== 0) {
    throw new Error("ExpressionError: Brackets must be paired");
  }
}

function calculate(num1, operator, num2) {
  if (num2 === 0 && operator === "/") {
    //check /0
    throw new Error("TypeError: Division by zero.");
  }
  if (operator == "+") {
    return num1 + num2;
  } else if (operator == "-") {
    return num1 - num2;
  } else if (operator == "*") {
    return num1 * num2;
  } else if (operator == "/") {
    return num1 / num2;
  } //result expression
}

function expressionCalculator(expr) {
  checkBrackets(expr);
  let goodString = expr.replace(/\s/g, ""); //reg expression for space string
  let arr = [];
  let numberLength = 0;
  let num = "";
  for (let i = 0; i < goodString.length; i++) {
    if (isNaN(goodString[i]) === true) {
      //check symbol string or number
      for (let j = numberLength; j > 0; j--) {
        num += goodString[i - j];
      }
      if (num !== "") {
        arr.push(Number(num)); //add number in array
        num = "";
        numberLength = 0;
      }
      arr.push(goodString[i]);
    } else {
      numberLength++;
    }
  }

  if (numberLength > 0) {
    //check number length
    for (let j = numberLength; j > 0; j--) {
      num += goodString[goodString.length - j];
    }
    arr.push(Number(num));
  }

  const signExpression = {
    //create obj operators with priority
    "-": 1,
    "+": 1,
    "*": 2,
    "/": 2
  };
  const numberStack = []; //create stack for numbers
  const operatorStack = []; // create stack for operators

  for (let i = 0; i < arr.length; i++) {
    if (isNaN(arr[i]) == false) {
      numberStack.push(arr[i]); //push in stack numbers
    } else if (isNaN(arr[i]) == true) {
      if (arr[i] == "(") {
        operatorStack.push(arr[i]); //push in stack operators
      } else {
        if (operatorStack[operatorStack.length - 1] === "(") {
          //check stack
          if (arr[i] === ")") {
            operatorStack.pop();
          } else {
            operatorStack.push(arr[i]);
          }
        } else if (arr[i] === ")") {
          let lastOperator = operatorStack.pop();
          let lastNumber = numberStack.pop();
          let firstNumber = numberStack.pop();
          let newNumber = calculate(firstNumber, lastOperator, lastNumber);
          numberStack.push(newNumber); //add result in stack
          i--;
        } else if (operatorStack.length === 0) {
          operatorStack.push(arr[i]);
        } else if (
          signExpression[arr[i]] >
          signExpression[operatorStack[operatorStack.length - 1]] //check priority
        ) {
          operatorStack.push(arr[i]);
        } else {
          let lastOperator = operatorStack.pop();
          let lastNumber = numberStack.pop();
          let firstNumber = numberStack.pop();
          let newNumber = calculate(firstNumber, lastOperator, lastNumber);
          numberStack.push(newNumber); //add result in stack
          i--;
        }
      }
    }
  }
  if (numberStack.length > 1) {
    for (let j = 0; j < numberStack.length; j++) {
      let lastOperator = operatorStack.pop();
      let lastNumber = numberStack.pop();
      let firstNumber = numberStack.pop();
      let newNumber = calculate(firstNumber, lastOperator, lastNumber);
      numberStack.push(newNumber); //add result in stack
    }
  }
  return numberStack[0];
}

module.exports = {
  expressionCalculator
};
