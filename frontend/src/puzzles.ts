export abstract class Puzzle {
  roomNumber: number;
  title: string;
  category: string;
  question: string;
  hint: string;
  protected answer: string;
  constructor(roomNumber: number, title: string, category: string, question: string, hint: string, answer: string) {
    this.roomNumber = roomNumber; this.title = title; this.category = category; this.question = question; this.hint = hint; this.answer = answer;
  }
  abstract validate(userInput: string): { isValid: boolean; message: string };
}

export class RiddlePuzzle extends Puzzle {
  constructor(roomNumber: number, title: string, question: string, hint: string, answer: string) {
    super(roomNumber, title, 'General Knowledge & Logic', question, hint, answer);
  }
  validate(userInput: string) {
    const cleaned = userInput.trim().toLowerCase();
    if (!cleaned) return { isValid: false, message: 'Input cannot be empty!' };
    if (/^[0-9]+$/.test(cleaned)) return { isValid: false, message: 'This riddle requires a word, not a number!' };
    if (cleaned === this.answer.toLowerCase()) return { isValid: true, message: 'Access Granted!' };
    return { isValid: false, message: 'Incorrect answer. Read carefully!' };
  }
}

export class MathPuzzle extends Puzzle {
  constructor(roomNumber: number, title: string, question: string, hint: string, answer: string) {
    super(roomNumber, title, 'Mathematical Sequence & Lock', question, hint, answer);
  }
  validate(userInput: string) {
    const cleaned = userInput.trim();
    if (!cleaned) return { isValid: false, message: 'Please enter a code.' };
    if (cleaned === this.answer) return { isValid: true, message: 'Sequence verified!' };
    return { isValid: false, message: 'Wrong value. Check your math!' };
  }
}

export class TechnicalPuzzle extends Puzzle {
  constructor(roomNumber: number, title: string, question: string, hint: string, answer: string) {
    super(roomNumber, title, 'Technical Code & Systems', question, hint, answer);
  }
  validate(userInput: string) {
    const cleaned = userInput.trim();
    if (!cleaned) return { isValid: false, message: 'Terminal input required.' };
    if (cleaned.toLowerCase() === this.answer.toLowerCase()) return { isValid: true, message: 'System Override Successful!' };
    return { isValid: false, message: 'Key error. Try again.' };
  }
}

export const ROOMS: Puzzle[] = [
  new RiddlePuzzle(1, 'Room 1: The Gatekeeper', 'I have keys but open no locks. I have space but no room. You can enter, but cannot go outside. What am I?', 'You are typing your solution with one right now.', 'keyboard'),
  new TechnicalPuzzle(2, 'Room 2: The Recursive Function', 'Analyze this C recursive function snippet. Trace the execution flow to determine what integer value is returned and printed by solve(6):\n\n#include <stdio.h>\nint solve(int n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}\nint main() {\n    printf("%d", solve(6));\n    return 0;\n}', 'Calculate the factorial of 6 (6 x 5 x 4 x 3 x 2 x 1).', '720'),
  new MathPuzzle(3, 'Room 3: The Sequencer', 'Complete the power sequence: 2, 6, 12, 20, 30, __ ?', 'Look at the differences between consecutive numbers: +4, +6, +8, +10...', '42'),
  new TechnicalPuzzle(4, 'Room 4: The Terminal Loop', 'Fill in the missing 2-character increment operator:\n\nfor (let i = 0; i < 5; i___ ) { unlock(); }', 'What standard operator adds 1 to a variable?', '++'),
  new TechnicalPuzzle(5, 'Room 5: Basic File System', 'What standard 3-letter file extension is universally used for a compiled executable program file in Windows systems?', 'It stands for executable.', 'exe'),
  new MathPuzzle(6, 'Room 6: The Master Lock', 'Enter the 4-digit master PIN:\n• First two digits: Your answer from Room 3 (42).\n• Last two digits: Total rooms (6) multiplied by 4 (24).', 'Combine Room 3 result with 6 x 4.', '4224')
];
