// Wipro Coding Test Problems
// 6 problems total (2 shown per test)

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

export const wiproCodingProblems: CodingProblem[] = [
    {
        id: 'wipro-code-1',
        title: 'Array Rotation',
        difficulty: 'Easy',
        description: 'Rotate an array to the right by K positions.',
        inputFormat: 'First line contains N and K. Second line contains N space-separated integers.',
        outputFormat: 'Print the rotated array elements space-separated.',
        constraints: ['1 ≤ N ≤ 1000', '0 ≤ K ≤ N'],
        sampleInput: '5 2\n1 2 3 4 5',
        sampleOutput: '4 5 1 2 3',
        explanation: 'Rotating [1,2,3,4,5] by 2 positions to the right gives [4,5,1,2,3]',
        testCases: [
            { input: '5 2\n1 2 3 4 5', output: '4 5 1 2 3' },
            { input: '4 1\n10 20 30 40', output: '40 10 20 30' },
            { input: '3 3\n7 8 9', output: '7 8 9' },
        ],
    },
    {
        id: 'wipro-code-2',
        title: 'String Compression',
        difficulty: 'Medium',
        description: 'Compress a string by replacing consecutive repeated characters with the character followed by the count.',
        inputFormat: 'A single line containing a string.',
        outputFormat: 'Print the compressed string.',
        constraints: ['1 ≤ length ≤ 1000', 'String contains only lowercase letters'],
        sampleInput: 'aaabbcccc',
        sampleOutput: 'a3b2c4',
        explanation: 'aaa becomes a3, bb becomes b2, cccc becomes c4',
        testCases: [
            { input: 'aaabbcccc', output: 'a3b2c4' },
            { input: 'abc', output: 'a1b1c1' },
            { input: 'aaaa', output: 'a4' },
        ],
    },
    {
        id: 'wipro-code-3',
        title: 'Missing Number',
        difficulty: 'Easy',
        description: 'Find the missing number in an array containing n-1 distinct numbers from 1 to n.',
        inputFormat: 'First line contains N. Second line contains N-1 space-separated integers.',
        outputFormat: 'Print the missing number.',
        constraints: ['2 ≤ N ≤ 10^5'],
        sampleInput: '5\n1 2 4 5',
        sampleOutput: '3',
        explanation: 'The array contains 1,2,4,5. The missing number is 3.',
        testCases: [
            { input: '5\n1 2 4 5', output: '3' },
            { input: '10\n1 2 3 4 5 6 7 8 10', output: '9' },
            { input: '3\n1 3', output: '2' },
        ],
    },
    {
        id: 'wipro-code-4',
        title: 'Anagram Check',
        difficulty: 'Medium',
        description: 'Check if two strings are anagrams of each other.',
        inputFormat: 'Two lines, each containing a string.',
        outputFormat: 'Print "YES" if anagrams, "NO" otherwise.',
        constraints: ['1 ≤ length ≤ 1000', 'Strings contain only lowercase letters'],
        sampleInput: 'listen\nsilent',
        sampleOutput: 'YES',
        explanation: 'Both strings contain the same characters with the same frequencies.',
        testCases: [
            { input: 'listen\nsilent', output: 'YES' },
            { input: 'hello\nworld', output: 'NO' },
            { input: 'anagram\nnagaram', output: 'YES' },
        ],
    },
    {
        id: 'wipro-code-5',
        title: 'Merge Sorted Arrays',
        difficulty: 'Medium',
        description: 'Merge two sorted arrays into one sorted array.',
        inputFormat: 'First line contains N and M. Second line contains N sorted integers. Third line contains M sorted integers.',
        outputFormat: 'Print the merged sorted array space-separated.',
        constraints: ['1 ≤ N, M ≤ 1000'],
        sampleInput: '3 3\n1 3 5\n2 4 6',
        sampleOutput: '1 2 3 4 5 6',
        explanation: 'Merging [1,3,5] and [2,4,6] gives [1,2,3,4,5,6]',
        testCases: [
            { input: '3 3\n1 3 5\n2 4 6', output: '1 2 3 4 5 6' },
            { input: '2 2\n1 2\n3 4', output: '1 2 3 4' },
            { input: '4 2\n1 5 9 10\n2 3', output: '1 2 3 5 9 10' },
        ],
    },
    {
        id: 'wipro-code-6',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Hard',
        description: 'Find the length of the longest substring without repeating characters.',
        inputFormat: 'A single line containing a string.',
        outputFormat: 'Print the length of the longest substring.',
        constraints: ['0 ≤ length ≤ 10^4'],
        sampleInput: 'abcabcbb',
        sampleOutput: '3',
        explanation: 'The longest substring without repeating characters is "abc" with length 3.',
        testCases: [
            { input: 'abcabcbb', output: '3' },
            { input: 'bbbbb', output: '1' },
            { input: 'pwwkew', output: '3' },
        ],
    },
];
