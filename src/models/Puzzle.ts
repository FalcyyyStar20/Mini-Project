export interface PuzzleValidationResult {
  isValid: boolean;
  message: string;
  feedbackType?: 'success' | 'error' | 'warning';
}

/**
 * Abstract Base Class: Puzzle
 * Demonstrates Object-Oriented Polymorphism and Encapsulation in TypeScript
 */
export abstract class Puzzle {
  readonly id: number;
  readonly roomCode: string;
  readonly name: string;
  readonly title: string;
  readonly question: string;
  readonly hint: string;
  readonly classification: 'RIDDLE' | 'RECURSION_C' | 'MATHEMATICAL' | 'SYNTAX_LOOP' | 'FILE_SYSTEM' | 'MASTER_PIN';
  readonly securityLevel: string;
  readonly academicSubject: string;

  constructor(
    id: number,
    roomCode: string,
    name: string,
    title: string,
    question: string,
    hint: string,
    classification: 'RIDDLE' | 'RECURSION_C' | 'MATHEMATICAL' | 'SYNTAX_LOOP' | 'FILE_SYSTEM' | 'MASTER_PIN',
    securityLevel: string,
    academicSubject: string
  ) {
    this.id = id;
    this.roomCode = roomCode;
    this.name = name;
    this.title = title;
    this.question = question;
    this.hint = hint;
    this.classification = classification;
    this.securityLevel = securityLevel;
    this.academicSubject = academicSubject;
  }

  /**
   * Sanitizes generic user input
   */
  protected sanitize(input: string): string {
    return (input || '').trim();
  }

  /**
   * Polymorphic validation contract implemented by each puzzle specialization
   */
  abstract validate(input: string): PuzzleValidationResult;
}

/**
 * RiddlePuzzle: Handles linguistic, semantic, and logic riddles.
 * Provides custom checks such as blocking pure numeric submissions for riddles.
 */
export class RiddlePuzzle extends Puzzle {
  private readonly acceptedAnswers: string[];
  private readonly blockNumeric: boolean;

  constructor(
    id: number,
    roomCode: string,
    name: string,
    title: string,
    question: string,
    hint: string,
    classification: 'RIDDLE',
    securityLevel: string,
    academicSubject: string,
    acceptedAnswers: string[],
    blockNumeric: boolean = false
  ) {
    super(id, roomCode, name, title, question, hint, classification, securityLevel, academicSubject);
    this.acceptedAnswers = acceptedAnswers.map((a) => a.toLowerCase().trim());
    this.blockNumeric = blockNumeric;
  }

  validate(input: string): PuzzleValidationResult {
    const sanitized = this.sanitize(input);

    if (!sanitized) {
      return {
        isValid: false,
        message: 'Input Required: Terminal expects response text.',
        feedbackType: 'warning'
      };
    }

    // Explicit check: Block pure numeric entries
    if (this.blockNumeric && /^\d+$/.test(sanitized)) {
      return {
        isValid: false,
        message: 'Invalid Data Format: Riddle answers cannot be purely numeric digits.',
        feedbackType: 'error'
      };
    }

    const normalized = sanitized.toLowerCase();
    const isMatch = this.acceptedAnswers.some(
      (ans) => normalized === ans || normalized === `a ${ans}` || normalized === `the ${ans}`
    );

    if (isMatch) {
      return {
        isValid: true,
        message: `ACCESS GRANTED: Semantic decryption verified. Room ${this.id} unlocked.`,
        feedbackType: 'success'
      };
    }

    return {
      isValid: false,
      message: 'Access Denied: Semantic frequency mismatch. Re-examine the riddle clues.',
      feedbackType: 'error'
    };
  }
}

/**
 * MathPuzzle: Handles mathematical sequences, recursion calculations, and PIN codes.
 * Enforces numerical formatting and value matching.
 */
export class MathPuzzle extends Puzzle {
  private readonly acceptedValues: string[];
  private readonly expectedLength?: number;

  constructor(
    id: number,
    roomCode: string,
    name: string,
    title: string,
    question: string,
    hint: string,
    classification: 'RECURSION_C' | 'MATHEMATICAL' | 'MASTER_PIN',
    securityLevel: string,
    academicSubject: string,
    acceptedValues: string[] | string,
    expectedLength?: number
  ) {
    super(id, roomCode, name, title, question, hint, classification, securityLevel, academicSubject);
    this.acceptedValues = (Array.isArray(acceptedValues) ? acceptedValues : [acceptedValues]).map(
      (v) => v.toLowerCase().trim()
    );
    this.expectedLength = expectedLength;
  }

  validate(input: string): PuzzleValidationResult {
    const sanitized = this.sanitize(input);

    if (!sanitized) {
      return {
        isValid: false,
        message: 'Input Required: Terminal expects numerical parameter.',
        feedbackType: 'warning'
      };
    }

    // Strict numerical check
    if (!/^-?\d+$/.test(sanitized)) {
      return {
        isValid: false,
        message: 'Syntax Error: Calculation matrix requires integer digits only.',
        feedbackType: 'error'
      };
    }

    // Length check if required (e.g. 4-digit PIN in Room 6)
    if (this.expectedLength && sanitized.length !== this.expectedLength) {
      return {
        isValid: false,
        message: `Length Mismatch: Exactly ${this.expectedLength} numeric digits required.`,
        feedbackType: 'error'
      };
    }

    const normalized = sanitized.toLowerCase();
    const isMatch = this.acceptedValues.some((val) => normalized === val);

    if (isMatch) {
      return {
        isValid: true,
        message: `CALCULATION ALIGNED: Mathematical parameter [${sanitized}] confirmed!`,
        feedbackType: 'success'
      };
    }

    return {
      isValid: false,
      message: `Calculation Mismatch: Computed value [${sanitized}] is incorrect. Check your trace or formula.`,
      feedbackType: 'error'
    };
  }
}

/**
 * TechnicalPuzzle: Handles syntax operators and file system extensions.
 */
export class TechnicalPuzzle extends Puzzle {
  private readonly acceptedTokens: string[];
  private readonly caseSensitive: boolean;

  constructor(
    id: number,
    roomCode: string,
    name: string,
    title: string,
    question: string,
    hint: string,
    classification: 'SYNTAX_LOOP' | 'FILE_SYSTEM',
    securityLevel: string,
    academicSubject: string,
    acceptedTokens: string[] | string,
    caseSensitive: boolean = false
  ) {
    super(id, roomCode, name, title, question, hint, classification, securityLevel, academicSubject);
    this.acceptedTokens = (Array.isArray(acceptedTokens) ? acceptedTokens : [acceptedTokens]).map(
      (t) => (caseSensitive ? t.trim() : t.toUpperCase().trim())
    );
    this.caseSensitive = caseSensitive;
  }

  validate(input: string): PuzzleValidationResult {
    const sanitized = this.sanitize(input);

    if (!sanitized) {
      return {
        isValid: false,
        message: 'Input Required: Terminal waiting for operator or file extension payload.',
        feedbackType: 'warning'
      };
    }

    // Guidance for loop operator (Room 4)
    if (this.classification === 'SYNTAX_LOOP') {
      if (sanitized === '+=1' || sanitized === '+= 1') {
        return {
          isValid: false,
          message: 'Syntax Notice: Standard 2-character increment operator required.',
          feedbackType: 'warning'
        };
      }
      if (sanitized.length !== 2) {
        return {
          isValid: false,
          message: 'Operator Constraint: Missing the exact 2-character increment operator.',
          feedbackType: 'error'
        };
      }
    }

    // Guidance for file extension (Room 5)
    if (this.classification === 'FILE_SYSTEM') {
      const cleanExt = sanitized.startsWith('.') ? sanitized.slice(1) : sanitized;
      if (cleanExt.toLowerCase() === 'exe') {
        return {
          isValid: true,
          message: `FILE EXTENSION VERIFIED: Standard Windows executable binary extension (.exe) confirmed!`,
          feedbackType: 'success'
        };
      }
      return {
        isValid: false,
        message: `Extension Mismatch: [${sanitized}] is not the standard 3-letter executable file extension in Windows.`,
        feedbackType: 'error'
      };
    }

    const normalized = this.caseSensitive ? sanitized : sanitized.toUpperCase();
    const isMatch = this.acceptedTokens.some((tok) => normalized === tok);

    if (isMatch) {
      return {
        isValid: true,
        message: `TOKEN COMPILED: Payload [${sanitized}] confirmed!`,
        feedbackType: 'success'
      };
    }

    return {
      isValid: false,
      message: `Verification Failed: [${sanitized}] is rejected by the room evaluation subsystem.`,
      feedbackType: 'error'
    };
  }
}

/**
 * Puzzle Repository: Initializes instances of each puzzle with polymorphism
 * Tailored for IT Engineering Mini-Project Curriculum
 */
export const ESCAPE_ROOMS: Puzzle[] = [
  // Room 1: The Gatekeeper (Riddle - Hardware)
  new RiddlePuzzle(
    1,
    'SYS_SECURE // ROOM_01.EXE',
    'The Gatekeeper',
    'Human-Computer Interface Hardware',
    'I have keys but open no locks. I have space but no room. You can enter, but cannot go outside. What am I?',
    'You are typing your solution with one right now.',
    'RIDDLE',
    'CLASS-A ENTRY GATE',
    'Hardware & Computer Architecture',
    ['keyboard', 'computer keyboard'],
    true
  ),

  // Room 2: The Recursive Function (C Programming)
  new MathPuzzle(
    2,
    'SYS_SECURE // ROOM_02.EXE',
    'The Recursive Function',
    'C Programming: Recursive Call Stack Execution',
    'Analyze this C recursive function snippet. Trace the execution flow to determine what integer value is returned and printed by solve(6):\n\n#include <stdio.h>\nint solve(int n) {\n    if (n <= 1) return 1;\n    return n * solve(n - 1);\n}\nint main() {\n    printf("%d", solve(6));\n    return 0;\n}',
    'Calculate the factorial of 6 (6 x 5 x 4 x 3 x 2 x 1).',
    'RECURSION_C',
    'CLASS-B RECURSION BUS',
    'Structured Programming in C',
    '720'
  ),

  // Room 3: The Sequencer (Math/Pattern)
  new MathPuzzle(
    3,
    'SYS_SECURE // ROOM_03.EXE',
    'The Sequencer',
    'Algorithmic Number Sequence',
    'Complete the power sequence: 2, 6, 12, 20, 30, __ ?',
    'Look at the differences between consecutive numbers: +4, +6, +8, +10...',
    'MATHEMATICAL',
    'CLASS-C POWER GRID',
    'Discrete Mathematics & Algorithms',
    '42'
  ),

  // Room 4: The Terminal Loop (Code Syntax)
  new TechnicalPuzzle(
    4,
    'SYS_SECURE // ROOM_04.EXE',
    'The Terminal Loop',
    'Control Flow Execution Loop',
    'Fill in the missing 2-character increment operator:\n\nfor (let i = 0; i < 5; i___ ) { unlock(); }',
    'What standard operator adds 1 to a variable in C/JS/TS?',
    'SYNTAX_LOOP',
    'CLASS-D COMPILER SYNTAX',
    'Object-Oriented Programming (OOP)',
    '++',
    true
  ),

  // Room 5: Basic File System (IT Knowledge)
  new TechnicalPuzzle(
    5,
    'SYS_SECURE // ROOM_05.EXE',
    'Basic File System',
    'Operating Systems: Executable Binary Formats',
    'What standard 3-letter file extension is universally used for a compiled executable program file in Windows systems?',
    'It stands for executable.',
    'FILE_SYSTEM',
    'CLASS-E FILE OS ARCH',
    'Operating Systems & File Formats',
    ['exe', '.exe'],
    false
  ),

  // Room 6: The Master Lock (Final PIN)
  new MathPuzzle(
    6,
    'SYS_SECURE // ROOM_06.EXE',
    'The Master Lock',
    'Master Vault PIN Matrix',
    'Enter the 4-digit master PIN:\n• First two digits: Your answer from Room 3 (42).\n• Last two digits: Total rooms (6) multiplied by 4 (24).',
    'Combine the result of Room 3 with the product of 6 x 4.',
    'MASTER_PIN',
    'CLASS-F MASTER OVERRIDE',
    'Cryptography & Security Engineering',
    '4224',
    4
  )
];

/**
 * Retrieve puzzle by ID
 */
export function getPuzzleById(id: number): Puzzle | undefined {
  return ESCAPE_ROOMS.find((p) => p.id === id);
}
