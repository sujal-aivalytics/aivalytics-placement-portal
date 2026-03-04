// TCS Advanced Quantitative + Logical Test Questions
// 15 questions total: Advanced Math and Logic

export interface QuestionData {
    id: string;
    text: string;
    type: 'multiple-choice';
    category: 'quant' | 'logical';
    options: {
        text: string;
        isCorrect: boolean;
    }[];
}

export const tcsAdvancedQuestions: QuestionData[] = [
    // ADVANCED QUANTITATIVE (8 questions)
    {
        id: 'tcs-adv-q-1',
        text: 'A train 150m long passes a pole in 15 seconds. What is its speed in km/h?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '30 km/h', isCorrect: false },
            { text: '36 km/h', isCorrect: true },
            { text: '40 km/h', isCorrect: false },
            { text: '45 km/h', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-2',
        text: 'If log₁₀(x) = 2, what is the value of x?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '10', isCorrect: false },
            { text: '20', isCorrect: false },
            { text: '100', isCorrect: true },
            { text: '1000', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-3',
        text: 'The probability of getting a sum of 7 when two dice are thrown is:',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '1/6', isCorrect: true },
            { text: '1/12', isCorrect: false },
            { text: '1/9', isCorrect: false },
            { text: '1/8', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-4',
        text: 'If sin θ = 3/5, what is cos θ? (θ is acute)',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '3/5', isCorrect: false },
            { text: '4/5', isCorrect: true },
            { text: '5/3', isCorrect: false },
            { text: '5/4', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-5',
        text: 'The sum of the first 50 natural numbers is:',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '1225', isCorrect: false },
            { text: '1250', isCorrect: false },
            { text: '1275', isCorrect: true },
            { text: '1300', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-6',
        text: 'If x + 1/x = 5, what is x² + 1/x²?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '21', isCorrect: false },
            { text: '23', isCorrect: true },
            { text: '25', isCorrect: false },
            { text: '27', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-7',
        text: 'A mixture contains milk and water in the ratio 5:3. If 16 liters of water is added, the ratio becomes 5:7. What was the initial quantity of milk?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '20 liters', isCorrect: true },
            { text: '25 liters', isCorrect: false },
            { text: '30 liters', isCorrect: false },
            { text: '35 liters', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-8',
        text: 'The HCF and LCM of two numbers are 12 and 336 respectively. If one number is 48, what is the other number?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '72', isCorrect: false },
            { text: '84', isCorrect: true },
            { text: '96', isCorrect: false },
            { text: '108', isCorrect: false },
        ],
    },

    // ADVANCED LOGICAL (7 questions)
    {
        id: 'tcs-adv-l-1',
        text: 'In a row of 40 students, A is 16th from the left and B is 29th from the right. How many students are between A and B?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
            { text: '5', isCorrect: false },
            { text: '6', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-2',
        text: 'If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'CPNCBZ', isCorrect: true },
            { text: 'CPNBCZ', isCorrect: false },
            { text: 'CQNCBZ', isCorrect: false },
            { text: 'DPNCBZ', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-3',
        text: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: '0°', isCorrect: false },
            { text: '7.5°', isCorrect: true },
            { text: '15°', isCorrect: false },
            { text: '22.5°', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-4',
        text: 'Five friends A, B, C, D, and E are sitting in a row. A and B are not sitting together. C is not at either end. D is to the immediate right of E. Who is sitting in the middle?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'A', isCorrect: false },
            { text: 'B', isCorrect: false },
            { text: 'C', isCorrect: true },
            { text: 'D', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-5',
        text: 'If EARTH can be coded as 51234 and MOON as 5667, how is THRONE coded?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: '246781', isCorrect: false },
            { text: '346781', isCorrect: true },
            { text: '356781', isCorrect: false },
            { text: '456781', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-6',
        text: 'A man walks 5 km towards north, then turns right and walks 3 km, then turns right again and walks 5 km. How far is he from the starting point?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: '2 km', isCorrect: false },
            { text: '3 km', isCorrect: true },
            { text: '4 km', isCorrect: false },
            { text: '5 km', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-7',
        text: 'In a family of 6 members A, B, C, D, E and F, there are two married couples. D is grandmother of A and mother of B. C is wife of B and mother of F. F is the granddaughter of D. Who is E?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'Father of A', isCorrect: false },
            { text: 'Grandfather of A', isCorrect: true },
            { text: 'Father of F', isCorrect: false },
            { text: 'Uncle of A', isCorrect: false },
        ],
    },

    // ADDITIONAL ADVANCED QUANTITATIVE (7 questions)
    {
        id: 'tcs-adv-q-9',
        text: 'A boat can travel 30 km downstream in 2 hours and 20 km upstream in 4 hours. What is the speed of the boat in still water?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '10 km/h', isCorrect: true },
            { text: '12 km/h', isCorrect: false },
            { text: '15 km/h', isCorrect: false },
            { text: '8 km/h', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-10',
        text: 'If the compound interest on a sum for 2 years at 10% per annum is ₹420, what is the simple interest on the same sum at the same rate for the same period?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '₹380', isCorrect: false },
            { text: '₹400', isCorrect: true },
            { text: '₹410', isCorrect: false },
            { text: '₹390', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-11',
        text: 'A cistern can be filled by two pipes A and B in 12 and 16 hours respectively. Both pipes are opened together, but after 3 hours pipe A is closed. How much time will B take to fill the remaining cistern?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '8 hours', isCorrect: false },
            { text: '9 hours', isCorrect: false },
            { text: '10 hours', isCorrect: true },
            { text: '11 hours', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-12',
        text: 'The average age of a group of 10 students is 15 years. If 5 more students with an average age of 12 years join the group, what is the new average age?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '13 years', isCorrect: false },
            { text: '14 years', isCorrect: true },
            { text: '13.5 years', isCorrect: false },
            { text: '14.5 years', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-13',
        text: 'A shopkeeper marks his goods 40% above cost price but allows a discount of 20%. What is his net profit percentage?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '10%', isCorrect: false },
            { text: '12%', isCorrect: true },
            { text: '15%', isCorrect: false },
            { text: '20%', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-14',
        text: 'In how many ways can the letters of the word "MATHEMATICS" be arranged?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '4989600', isCorrect: true },
            { text: '3628800', isCorrect: false },
            { text: '5040000', isCorrect: false },
            { text: '2419200', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-q-15',
        text: 'The area of a rhombus is 240 cm² and one of its diagonals is 16 cm. What is the length of the other diagonal?',
        type: 'multiple-choice',
        category: 'quant',
        options: [
            { text: '25 cm', isCorrect: false },
            { text: '28 cm', isCorrect: false },
            { text: '30 cm', isCorrect: true },
            { text: '32 cm', isCorrect: false },
        ],
    },

    // ADDITIONAL ADVANCED LOGICAL (8 questions)
    {
        id: 'tcs-adv-l-8',
        text: 'If "COMPUTER" is coded as "DPNQVUFS", how is "KEYBOARD" coded?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'LFZCPBSE', isCorrect: true },
            { text: 'KFZCPBSE', isCorrect: false },
            { text: 'LFYCPBSE', isCorrect: false },
            { text: 'LFZCPASE', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-9',
        text: 'A, B, C, D, E, F, G and H are sitting around a circular table facing the center. A is third to the left of C and second to the right of E. B is second to the right of D who is not an immediate neighbor of E. F is not an immediate neighbor of C. Who is sitting between D and F?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'A', isCorrect: false },
            { text: 'B', isCorrect: false },
            { text: 'C', isCorrect: true },
            { text: 'H', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-10',
        text: 'In a certain code, 15789 is written as XTZAL and 2346 is written as NPSU. How is 23549 written in that code?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'NPTUL', isCorrect: true },
            { text: 'NPSUL', isCorrect: false },
            { text: 'NPTSL', isCorrect: false },
            { text: 'NPTZL', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-11',
        text: 'Find the missing number in the series: 2, 6, 12, 20, 30, ?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: '40', isCorrect: false },
            { text: '42', isCorrect: true },
            { text: '44', isCorrect: false },
            { text: '46', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-12',
        text: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies. This statement is:',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false },
            { text: 'Uncertain', isCorrect: false },
            { text: 'None of the above', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-13',
        text: 'A cube is painted red on all faces and then cut into 64 smaller cubes of equal size. How many cubes have exactly one face painted?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: '8', isCorrect: false },
            { text: '16', isCorrect: false },
            { text: '24', isCorrect: true },
            { text: '32', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-14',
        text: 'If the day before yesterday was Thursday, what day will be the day after tomorrow?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: 'Sunday', isCorrect: false },
            { text: 'Monday', isCorrect: true },
            { text: 'Tuesday', isCorrect: false },
            { text: 'Wednesday', isCorrect: false },
        ],
    },
    {
        id: 'tcs-adv-l-15',
        text: 'In a class, 60% of students play cricket, 30% play football, and 10% play both. What percentage of students play neither cricket nor football?',
        type: 'multiple-choice',
        category: 'logical',
        options: [
            { text: '10%', isCorrect: false },
            { text: '15%', isCorrect: false },
            { text: '20%', isCorrect: true },
            { text: '25%', isCorrect: false },
        ],
    },
];
