const testProblemCreate = {
  "title": "Add Two Numbers",
  "description": "Write a program that takes two integers as input and returns their sum.",
  "difficulty": "easy",
  "tags": ["math", "array"],
  "visibleTestCases": [
    {
      "input": "2 3",
      "output": "5",
      "explanation": "2 + 3 equals 5"
    },
    {
      "input": "-1 1",
      "output": "0",
      "explanation": "-1 + 1 equals 0"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "1000 2000",
      "output": "3000"
    },
    {
      "input": "-50 -70",
      "output": "-120"
    }
  ],
  "startCode": [
    {
      "language": "C++",
      "initialCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nint addTwoNumbers(int a, int b) {\n    // Write your code here\n    return 0;\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << addTwoNumbers(a, b);\n    return 0;\n}"
    },
    {
      "language": "JavaScript",
      "initialCode": "function addTwoNumbers(a, b) {\n    // Write your code here\n    return 0;\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(' ').map(Number);\nconst [a, b] = input;\nconsole.log(addTwoNumbers(a, b));"
    },
    {
      "language": "Java",
      "initialCode": "import java.util.*;\n\npublic class Main {\n    public static int addTwoNumbers(int a, int b) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(addTwoNumbers(a, b));\n    }\n}"
    }
  ],
  "referenceSolution": [
    {
      "language": "C++",
      "completeCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nint addTwoNumbers(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << addTwoNumbers(a, b);\n    return 0;\n}"
    },
    {
      "language": "JavaScript",
      "completeCode": "function addTwoNumbers(a, b) {\n    return a + b;\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(' ').map(Number);\nconst [a, b] = input;\nconsole.log(addTwoNumbers(a, b));"
    },
    {
      "language": "Java",
      "completeCode": "import java.util.*;\n\npublic class Main {\n    public static int addTwoNumbers(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(addTwoNumbers(a, b));\n    }\n}"
    }
  ]
}
