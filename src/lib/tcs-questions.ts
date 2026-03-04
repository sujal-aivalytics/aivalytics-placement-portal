
export interface TCSQuestion {
    id: number;
    text: string;
    options: { id: string; text: string }[];
    category: 'Quants' | 'Verbal' | 'Reasoning' | 'Programming';
    correctAnswer: string;
}

export const tcsQuestions: TCSQuestion[] = [
    // --- QUANTS (1-8) ---
    {
        id: 1,
        text: "Review the following sequence: 8, 17, 32, 53, ?. What is the next number in the series?",
        category: 'Quants',
        options: [
            { id: "A", text: "78" },
            { id: "B", text: "79" },
            { id: "C", text: "80" },
            { id: "D", text: "81" },
        ],
        correctAnswer: "C"
    },
    {
        id: 2,
        text: "If a train 100m long passes a platform 200m long in 20 seconds, what is the speed of the train?",
        category: 'Quants',
        options: [
            { id: "A", text: "15 m/s" },
            { id: "B", text: "30 m/s" },
            { id: "C", text: "45 m/s" },
            { id: "D", text: "60 m/s" },
        ],
        correctAnswer: "A"
    },
    {
        id: 3,
        text: "The average of 5 consecutive odd numbers is 61. What is the difference between the highest and lowest numbers?",
        category: 'Quants',
        options: [
            { id: "A", text: "8" },
            { id: "B", text: "2" },
            { id: "C", text: "5" },
            { id: "D", text: "12" },
        ],
        correctAnswer: "A"
    },
    {
        id: 4,
        text: "A and B together can do a piece of work in 15 days. A alone can do it in 20 days. In how many days can B alone do it?",
        category: 'Quants',
        options: [
            { id: "A", text: "30 days" },
            { id: "B", text: "45 days" },
            { id: "C", text: "60 days" },
            { id: "D", text: "75 days" },
        ],
        correctAnswer: "C"
    },
    {
        id: 5,
        text: "What is the probability of getting a sum of 9 when two dice are thrown simultaneously?",
        category: 'Quants',
        options: [
            { id: "A", text: "1/6" },
            { id: "B", text: "1/8" },
            { id: "C", text: "1/9" },
            { id: "D", text: "1/12" },
        ],
        correctAnswer: "C"
    },
    {
        id: 6,
        text: "A shopkeeper marks his goods 20% above cost price and allows a discount of 10%. What is his gain percent?",
        category: 'Quants',
        options: [
            { id: "A", text: "8%" },
            { id: "B", text: "10%" },
            { id: "C", text: "12%" },
            { id: "D", text: "15%" },
        ],
        correctAnswer: "A"
    },
    {
        id: 7,
        text: "The ratio of ages of A and B is 3:5. After 5 years, their ages will be in the ratio 2:3. What is the present age of A?",
        category: 'Quants',
        options: [
            { id: "A", text: "15 years" },
            { id: "B", text: "12 years" },
            { id: "C", text: "18 years" },
            { id: "D", text: "21 years" },
        ],
        correctAnswer: "A"
    },
    {
        id: 8,
        text: "Find the compound interest on $12600 for 2 years at 10% per annum compounded annually.",
        category: 'Quants',
        options: [
            { id: "A", text: "$2646" },
            { id: "B", text: "$2466" },
            { id: "C", text: "$2664" },
            { id: "D", text: "$2600" },
        ],
        correctAnswer: "A"
    },

    // --- REASONING (9-16) ---
    {
        id: 9,
        text: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
        category: 'Reasoning',
        options: [
            { id: "A", text: "His own" },
            { id: "B", text: "His son" },
            { id: "C", text: "His father" },
            { id: "D", text: "His nephew" },
        ],
        correctAnswer: "B"
    },
    {
        id: 10,
        text: "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in the same code?",
        category: 'Reasoning',
        options: [
            { id: "A", text: "EOJDJEFM" },
            { id: "B", text: "EOJDEJFM" },
            { id: "C", text: "MFEJDJOE" },
            { id: "D", text: "MFEDJJOE" },
        ],
        correctAnswer: "A"
    },
    {
        id: 11,
        text: "Statements: All cars are cats. All fans are cats. \nConclusions: \nI. All cars are fans. \nII. Some fans are cars.",
        category: 'Reasoning',
        options: [
            { id: "A", text: "Only I follows" },
            { id: "B", text: "Only II follows" },
            { id: "C", text: "Either I or II follows" },
            { id: "D", text: "Neither I nor II follows" },
        ],
        correctAnswer: "D"
    },
    {
        id: 12,
        text: "Find the odd one out: 3, 5, 7, 12, 17, 19",
        category: 'Reasoning',
        options: [
            { id: "A", text: "19" },
            { id: "B", text: "17" },
            { id: "C", text: "12" },
            { id: "D", text: "3" },
        ],
        correctAnswer: "C"
    },
    {
        id: 13,
        text: "If P means 'div', Q means 'mul', R means 'plus' and S means 'minus', then what is the value of 18 Q 12 P 4 R 5 S 6?",
        category: 'Reasoning',
        options: [
            { id: "A", text: "53" },
            { id: "B", text: "59" },
            { id: "C", text: "63" },
            { id: "D", text: "65" },
        ],
        correctAnswer: "A"
    },
    {
        id: 14,
        text: "A is located to the West of B. C is located to the North of B. D is located to the East of C. In which direction is D from A?",
        category: 'Reasoning',
        options: [
            { id: "A", text: "North-East" },
            { id: "B", text: "South-East" },
            { id: "C", text: "North-West" },
            { id: "D", text: "South-West" },
        ],
        correctAnswer: "A"
    },
    {
        id: 15,
        text: "Arrange the words in a meaningful logical order: 1. Key 2. Door 3. Lock 4. Room 5. Switch on",
        category: 'Reasoning',
        options: [
            { id: "A", text: "5, 1, 2, 4, 3" },
            { id: "B", text: "4, 2, 1, 5, 3" },
            { id: "C", text: "1, 3, 2, 4, 5" },
            { id: "D", text: "1, 2, 3, 5, 4" },
        ],
        correctAnswer: "C"
    },
    {
        id: 16,
        text: "2, 6, 12, 20, 30, 42, ?",
        category: 'Reasoning',
        options: [
            { id: "A", text: "52" },
            { id: "B", text: "56" },
            { id: "C", text: "60" },
            { id: "D", text: "64" },
        ],
        correctAnswer: "B"
    },

    // --- VERBAL (17-23) ---
    {
        id: 17,
        text: "Choose the synonym of 'BRIEF':",
        category: 'Verbal',
        options: [
            { id: "A", text: "Limited" },
            { id: "B", text: "Small" },
            { id: "C", text: "Little" },
            { id: "D", text: "Short" },
        ],
        correctAnswer: "D"
    },
    {
        id: 18,
        text: "Choose the antonym of 'ARTIFICIAL':",
        category: 'Verbal',
        options: [
            { id: "A", text: "Red" },
            { id: "B", text: "Natural" },
            { id: "C", text: "Truthful" },
            { id: "D", text: "Solid" },
        ],
        correctAnswer: "B"
    },
    {
        id: 19,
        text: "Fill in the blank: The cat ______ on the rug.",
        category: 'Verbal',
        options: [
            { id: "A", text: "lay" },
            { id: "B", text: "laid" },
            { id: "C", text: "lain" },
            { id: "D", text: "lied" },
        ],
        correctAnswer: "A"
    },
    {
        id: 20,
        text: "Select the correctly spelt word:",
        category: 'Verbal',
        options: [
            { id: "A", text: "Accomodation" },
            { id: "B", text: "Accommodation" },
            { id: "C", text: "Acommodation" },
            { id: "D", text: "Acomodation" },
        ],
        correctAnswer: "B"
    },
    {
        id: 21,
        text: "Idiom 'To break the ice' means:",
        category: 'Verbal',
        options: [
            { id: "A", text: "To start a conflict" },
            { id: "B", text: "To start a conversation" },
            { id: "C", text: "To end a friendship" },
            { id: "D", text: "To feel cold" },
        ],
        correctAnswer: "B"
    },
    {
        id: 22,
        text: "Improve the sentence: He is too important for tolerating any delay.",
        category: 'Verbal',
        options: [
            { id: "A", text: "to tolerate" },
            { id: "B", text: "to tolerating" },
            { id: "C", text: "at tolerating" },
            { id: "D", text: "No improvement" },
        ],
        correctAnswer: "A"
    },
    {
        id: 23,
        text: "One word substitution: A person who eats too much.",
        category: 'Verbal',
        options: [
            { id: "A", text: "Glutton" },
            { id: "B", text: "Nibbler" },
            { id: "C", text: "Cannibal" },
            { id: "D", text: "Omnivore" },
        ],
        correctAnswer: "A"
    },

    // --- TECHNICAL / PROGRAMMING LOGIC (24-30) ---
    {
        id: 24,
        text: "What is the time complexity of binary search?",
        category: 'Programming',
        options: [
            { id: "A", text: "O(n)" },
            { id: "B", text: "O(n^2)" },
            { id: "C", text: "O(log n)" },
            { id: "D", text: "O(1)" },
        ],
        correctAnswer: "C"
    },
    {
        id: 25,
        text: "Which data structure uses LIFO principle?",
        category: 'Programming',
        options: [
            { id: "A", text: "Queue" },
            { id: "B", text: "Stack" },
            { id: "C", text: "Linked List" },
            { id: "D", text: "Tree" },
        ],
        correctAnswer: "B"
    },
    {
        id: 26,
        text: "In C, what is the size of 'int' data type on a 32-bit compiler?",
        category: 'Programming',
        options: [
            { id: "A", text: "2 bytes" },
            { id: "B", text: "4 bytes" },
            { id: "C", text: "8 bytes" },
            { id: "D", text: "1 byte" },
        ],
        correctAnswer: "B"
    },
    {
        id: 27,
        text: "Which of the following is NOT an OOPS concept?",
        category: 'Programming',
        options: [
            { id: "A", text: "Polymorphism" },
            { id: "B", text: "Inheritance" },
            { id: "C", text: "Encapsulation" },
            { id: "D", text: "Compilation" },
        ],
        correctAnswer: "D"
    },
    {
        id: 28,
        text: "What is the output of 10 % 3 in Java?",
        category: 'Programming',
        options: [
            { id: "A", text: "3" },
            { id: "B", text: "1" },
            { id: "C", text: "0" },
            { id: "D", text: "10" },
        ],
        correctAnswer: "B"
    },
    {
        id: 29,
        text: "In SQL, which command is used to remove a table from the database?",
        category: 'Programming',
        options: [
            { id: "A", text: "DELETE" },
            { id: "B", text: "REMOVE" },
            { id: "C", text: "DROP" },
            { id: "D", text: "CLEAR" },
        ],
        correctAnswer: "C"
    },
    {
        id: 30,
        text: "Which sorting algorithm has the best average case time complexity?",
        category: 'Programming',
        options: [
            { id: "A", text: "Bubble Sort" },
            { id: "B", text: "Insertion Sort" },
            { id: "C", text: "Merge Sort" },
            { id: "D", text: "Selection Sort" },
        ],
        correctAnswer: "C"
    },
];
