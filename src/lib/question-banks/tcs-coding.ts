// TCS Coding Test Problems
// 9 problems total (3 shown per test)

export interface CodingProblem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string[];
    sampleInput: string;
    sampleOutput: string;
    explanation: string;
    testCases: {
        input: string;
        output: string;
    }[];
}

export const tcsCodingProblems: CodingProblem[] = [
    {
        id: 'tcs-code-1',
        title: 'Sum of Array Elements',
        difficulty: 'Easy',
        description: 'Given an array of integers, find the sum of all elements in the array.',
        inputFormat: 'First line contains N (size of array). Second line contains N space-separated integers.',
        outputFormat: 'Print the sum of all elements.',
        constraints: ['1 ≤ N ≤ 1000', '-10^6 ≤ arr[i] ≤ 10^6'],
        sampleInput: '5\n1 2 3 4 5',
        sampleOutput: '15',
        explanation: 'Sum = 1 + 2 + 3 + 4 + 5 = 15',
        testCases: [
            { input: '5\n1 2 3 4 5', output: '15' },
            { input: '3\n10 20 30', output: '60' },
            { input: '4\n-5 5 -10 10', output: '0' },
        ],
    },
    {
        id: 'tcs-code-2',
        title: 'Palindrome Check',
        difficulty: 'Easy',
        description: 'Check if a given string is a palindrome (reads the same forwards and backwards).',
        inputFormat: 'A single line containing a string.',
        outputFormat: 'Print "YES" if palindrome, "NO" otherwise.',
        constraints: ['1 ≤ length ≤ 1000', 'String contains only lowercase letters'],
        sampleInput: 'racecar',
        sampleOutput: 'YES',
        explanation: 'racecar reads the same forwards and backwards.',
        testCases: [
            { input: 'racecar', output: 'YES' },
            { input: 'hello', output: 'NO' },
            { input: 'madam', output: 'YES' },
        ],
    },
    {
        id: 'tcs-code-3',
        title: 'Find Maximum Element',
        difficulty: 'Easy',
        description: 'Find the maximum element in an array of integers.',
        inputFormat: 'First line contains N. Second line contains N space-separated integers.',
        outputFormat: 'Print the maximum element.',
        constraints: ['1 ≤ N ≤ 1000', '-10^9 ≤ arr[i] ≤ 10^9'],
        sampleInput: '5\n3 7 2 9 1',
        sampleOutput: '9',
        explanation: 'The maximum element in the array is 9.',
        testCases: [
            { input: '5\n3 7 2 9 1', output: '9' },
            { input: '4\n-5 -2 -10 -1', output: '-1' },
            { input: '3\n100 200 150', output: '200' },
        ],
    },
    {
        id: 'tcs-code-4',
        title: 'Count Vowels',
        difficulty: 'Easy',
        description: 'Count the number of vowels (a, e, i, o, u) in a given string.',
        inputFormat: 'A single line containing a string.',
        outputFormat: 'Print the count of vowels.',
        constraints: ['1 ≤ length ≤ 1000', 'String contains only lowercase letters'],
        sampleInput: 'hello world',
        sampleOutput: '3',
        explanation: 'Vowels are: e, o, o. Total = 3',
        testCases: [
            { input: 'hello world', output: '3' },
            { input: 'programming', output: '3' },
            { input: 'aeiou', output: '5' },
        ],
    },
    {
        id: 'tcs-code-5',
        title: 'Reverse Array',
        difficulty: 'Medium',
        description: 'Reverse the elements of an array.',
        inputFormat: 'First line contains N. Second line contains N space-separated integers.',
        outputFormat: 'Print the reversed array elements space-separated.',
        constraints: ['1 ≤ N ≤ 1000'],
        sampleInput: '5\n1 2 3 4 5',
        sampleOutput: '5 4 3 2 1',
        explanation: 'The reversed array is [5, 4, 3, 2, 1].',
        testCases: [
            { input: '5\n1 2 3 4 5', output: '5 4 3 2 1' },
            { input: '3\n10 20 30', output: '30 20 10' },
            { input: '4\n7 8 9 10', output: '10 9 8 7' },
        ],
    },
    {
        id: 'tcs-code-6',
        title: 'Prime Number Check',
        difficulty: 'Medium',
        description: 'Check if a given number is prime.',
        inputFormat: 'A single integer N.',
        outputFormat: 'Print "PRIME" if the number is prime, "NOT PRIME" otherwise.',
        constraints: ['2 ≤ N ≤ 10^6'],
        sampleInput: '17',
        sampleOutput: 'PRIME',
        explanation: '17 is a prime number as it has no divisors other than 1 and itself.',
        testCases: [
            { input: '17', output: 'PRIME' },
            { input: '20', output: 'NOT PRIME' },
            { input: '2', output: 'PRIME' },
        ],
    },
    {
        id: 'tcs-code-7',
        title: 'Fibonacci Sequence',
        difficulty: 'Medium',
        description: 'Generate the first N numbers of the Fibonacci sequence.',
        inputFormat: 'A single integer N.',
        outputFormat: 'Print N Fibonacci numbers space-separated.',
        constraints: ['1 ≤ N ≤ 30'],
        sampleInput: '7',
        sampleOutput: '0 1 1 2 3 5 8',
        explanation: 'First 7 Fibonacci numbers: 0, 1, 1, 2, 3, 5, 8',
        testCases: [
            { input: '7', output: '0 1 1 2 3 5 8' },
            { input: '5', output: '0 1 1 2 3' },
            { input: '10', output: '0 1 1 2 3 5 8 13 21 34' },
        ],
    },
    {
        id: 'tcs-code-8',
        title: 'Longest Common Prefix',
        difficulty: 'Hard',
        description: 'Find the longest common prefix string amongst an array of strings.',
        inputFormat: 'First line contains N (number of strings). Next N lines contain strings.',
        outputFormat: 'Print the longest common prefix. If none exists, print "-1".',
        constraints: ['1 ≤ N ≤ 100', '1 ≤ string length ≤ 100'],
        sampleInput: '3\nflower\nflow\nflight',
        sampleOutput: 'fl',
        explanation: 'The longest common prefix is "fl".',
        testCases: [
            { input: '3\nflower\nflow\nflight', output: 'fl' },
            { input: '2\ndog\nracecar', output: '-1' },
            { input: '3\ninterspecies\ninterstellar\ninterstate', output: 'inters' },
        ],
    },
    {
        id: 'tcs-code-9',
        title: 'Two Sum Problem',
        difficulty: 'Hard',
        description: 'Given an array of integers and a target sum, find two numbers that add up to the target.',
        inputFormat: 'First line contains N and target. Second line contains N space-separated integers.',
        outputFormat: 'Print indices of the two numbers (0-indexed) space-separated. If no solution, print "-1".',
        constraints: ['2 ≤ N ≤ 1000', '-10^9 ≤ arr[i] ≤ 10^9'],
        sampleInput: '4 9\n2 7 11 15',
        sampleOutput: '0 1',
        explanation: 'arr[0] + arr[1] = 2 + 7 = 9',
        testCases: [
            { input: '4 9\n2 7 11 15', output: '0 1' },
            { input: '3 6\n3 2 4', output: '1 2' },
            { input: '2 10\n1 2', output: '-1' },
        ],
    },
];
