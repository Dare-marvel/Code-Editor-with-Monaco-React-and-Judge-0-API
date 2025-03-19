import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Spinner, Textarea, Heading, VStack, HStack, Text, IconButton, Tooltip } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import Editor from "@monaco-editor/react";
import Navbar from './Navbar';
import axios from 'axios';
// import compileCode from './compiling';
import { boilerCodes } from "./constants/boilerCodes";
import CodeOutput from './CodeOutput';

import { checkStatus, submitCode } from './utils/SubmitCode';

const problem = {
    id: 1,
    name: "Add Two Numbers",
    description: "Write a function that adds two numbers and returns the result.",
    examples: "Example 1: Input: 2 3 | Output: 5\nExample 2: Input: -1 5 | Output: 4",
    constraints: "The numbers will be integers.\nThe sum will not exceed the range of a 32-bit integer.",
    allTestCases: [
        { input: "4 4", expectedOutput: "8" },
        { input: "4 5", expectedOutput: "9" },
        { input: "-1 5", expectedOutput: "4" },
        { input: "-1 -5", expectedOutput: "-6" },
        { input: "-1 -5", expectedOutput: "-6" },

    ]
};

// const languageTemplates = {
//     python: `def add_two_numbers(a, b):
//     # Write your code here
//     return a + b

// # DO NOT MODIFY BELOW THIS LINE
// if __name__ == "__main__":
//     a, b = map(int, input().split())
//     print(add_two_numbers(a, b))`,
//     javascript: `function addTwoNumbers(a, b) {
//     // Write your code here
// }

// // DO NOT MODIFY BELOW THIS LINE
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.on('line', (input) => {
//     const [a, b] = input.split(' ').map(Number);
//     console.log(addTwoNumbers(a, b));
//     rl.close();
// });`,
//     java: `import java.util.Scanner;

// public class Main {
//     public static int addTwoNumbers(int a, int b) {
//         // Write your code here
//         return 0;
//     }

//     // DO NOT MODIFY BELOW THIS LINE
//     public static void main(String[] args) {
//         Scanner scanner = new Scanner(System.in);
//         int a = scanner.nextInt();
//         int b = scanner.nextInt();
//         System.out.println(addTwoNumbers(a, b));
//         scanner.close();
//     }
// }`,
//     cpp: `#include <iostream>
// using namespace std;

// int addTwoNumbers(int a, int b) {
//     // Write your code here
//     return 0;
// }

// // DO NOT MODIFY BELOW THIS LINE
// int main() {
//     int a, b;
//     cin >> a >> b;
//     cout << addTwoNumbers(a, b) << endl;
//     return 0;
// }`,
//     c: `#include <stdio.h>

// int addTwoNumbers(int a, int b) {
//     // Write your code here
//     return 0;
// }

// int main() {
//     int a, b;
//     scanf("%d %d", &a, &b);
//     printf("%d\n", addTwoNumbers(a, b));
//     return 0;
// }
// `
// };

function CodeEditor() {
    const [userLang, setUserLang] = useState({
        id: 63,
        name: "JavaScript (Node.js 12.14.0)",
        label: "JavaScript (Node.js 12.14.0)",
        value: "javascript",
    });
    const [status,setStatus] = useState(null)
    const [userCode, setUserCode] = useState(boilerCodes(userLang.id));
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(20);
    const [testCases, setTestCases] = useState([
        { input: "2 3", expectedOutput: "5" },
        { input: "-1 5", expectedOutput: "4" }
    ]);
    const [selectedTestCase, setSelectedTestCase] = useState(0);
    const [userOutput, setUserOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [activePanel, setActivePanel] = useState("input");
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const options = {
        fontSize: fontSize
    }

    useEffect(() => {
        setUserCode(boilerCodes(userLang.id));
    }, [userLang.id]);

    const addTestCase = () => {
        if (testCases.length < 6) {
            setTestCases([...testCases, { input: "", expectedOutput: "" }]);
            setSelectedTestCase(testCases.length);
        }
    };

    const deleteTestCase = (index) => {
        const newTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(newTestCases);
        if (selectedTestCase >= newTestCases.length) {
            setSelectedTestCase(newTestCases.length - 1);
        }
    };

    const updateTestCase = (field, value) => {
        const newTestCases = [...testCases];
        newTestCases[selectedTestCase][field] = value;
        setTestCases(newTestCases);
    };


    // const compile = async (input) => {
    //     try {
    //         const response = await axios.post('http://localhost:5000/compile', {
    //             code: userCode,
    //             language: userLang,
    //             input: input
    //         });
    //         return response.data.stdout || response.data.stderr || "No output";
    //     } catch (error) {
    //         console.error(error);
    //         return "Error: " + (error.response ? error.response.data.error : error.message);
    //     }
    // };

    const executeCode = async(input , exp_output) => {
        const formData = {
            language_id: userLang.id,
            source_code: btoa(userCode),
            stdin: btoa(input),
            expected_output : btoa(exp_output)
        }

        try {
            const { data } = await submitCode(formData)
            const { token } = data;
            const {data: output, success, err}  = await checkStatus(token);
            
            if(success) {
                setUserOutput(output);
                setStatus("Finished");
                setLoading(false);
            }else{
              console.log(err);
              setStatus("Error");
              setLoading(false);
            }
          }
          catch(err){
            let error = err.response ? err.response.data : err;
            console.log(error);
            setLoading(false);
          }
    }

    const runAllTestCases = async () => {
        setLoading(true);
        setActivePanel("output");
        setStatus("Running");

        let combinedInput = `${problem.allTestCases.length}\n`;
        combinedInput += problem.allTestCases.map(testCase => testCase.input).join("\n");

        let expectedOutput = problem.allTestCases.map(testCase => testCase.expectedOutput).join("\n");

        console.log(combinedInput);

        console.log(expectedOutput)

        executeCode(combinedInput,expectedOutput)

        // const formData = {
        //     language_id: userLang.id,
        //     source_code: btoa(userCode),
        //     stdin: btoa(combinedInput),
        //     expected_output : btoa(expectedOutput)
        // }

        // try {
        //     const { data } = await submitCode(formData)
        //     const { token } = data;
        //     const {data: output, success, err}  = await checkStatus(token);
            
        //     if(success) {
        //         setUserOutput(output);
        //         setStatus("Finished");
        //         setLoading(false);
        //     }else{
        //       console.log(err);
        //       setStatus("Error");
        //       setLoading(false);
        //     }
        //   }
        //   catch(err){
        //     let error = err.response ? err.response.data : err;
        //     console.log(error);
        //     setLoading(false);
        //   }

        // for (let i = 0; i < problem.allTestCases.length; i++) {
        //     const testCase = problem.allTestCases[i];
        //     const output = await compileCode({
        //         code: userCode,
        //         language: userLang,
        //         input: testCase.input
        //     });
        //     const passed = output.run.output.trim() === testCase.expectedOutput.trim();

        //     allOutput += `Test Case ${i + 1}: ${passed ? 'Passed' : 'Failed'}\n`;
        //     allOutput += `Input: ${testCase.input}\n`;
        //     allOutput += `Expected Output: ${testCase.expectedOutput}\n`;
        //     allOutput += `Actual Output: ${output.run.output}\n\n`;
        // }

        // setUserOutput(allOutput);
        
    };

    const runUserTestCases = async () => {
        setLoading(true);
        setActivePanel("output");
        setStatus("Running");

        let combinedInput = `${testCases.length}\n`;
        combinedInput += testCases.map(testCase => testCase.input).join("\n");

        let expectedOutput = testCases.map(testCase => testCase.expectedOutput).join("\n");

        executeCode(combinedInput,expectedOutput);
    };

    return (
        <Box>
            <Flex p={4}>
                {/* Left panel: Problem description */}
                <Box width="30%" pr={4}>
                    <Heading size="md" mb={2}>{problem.name}</Heading>
                    <Text mb={2}>{problem.description}</Text>
                    <Text mb={2}>Examples:</Text>
                    <Text mb={2} whiteSpace="pre-line">{problem.examples}</Text>
                    <Text mb={2}>Constraints:</Text>
                    <Text whiteSpace="pre-line">{problem.constraints}</Text>
                </Box>

                {/* Right panel: Code editor and I/O */}
                <VStack width="70%" spacing={4}>
                    {/* Language and theme selectors */}
                    <HStack width="100%" justifyContent="space-between">
                        <Navbar
                            userTheme={userTheme} setUserTheme={setUserTheme}
                            fontSize={fontSize} setFontSize={setFontSize}
                            userLang={userLang} setUserLang={setUserLang}
                        />
                    </HStack>

                    {/* Code editor */}
                    <Box width="100%" height="400px">
                        <Editor
                            options={options}
                            height="100%"
                            width="100%"
                            theme={userTheme}
                            language={userLang.value}
                            value={userCode}
                            onChange={(value) => { setUserCode(value) }}
                        />
                    </Box>

                    {/* Test Cases */}


                    {/* Buttons */}
                    <HStack width="100%" justifyContent="space-between">
                        <Button colorScheme="teal" onClick={runAllTestCases}>Submit</Button>
                        <Button colorScheme="blue" onClick={runUserTestCases}>Run</Button>
                        <Button onClick={() => setActivePanel("input")} variant={activePanel === "input" ? "solid" : "outline"}>Input</Button>
                        <Button onClick={() => setActivePanel("output")} variant={activePanel === "output" ? "solid" : "outline"}>Output</Button>
                    </HStack>

                    {/* Input/Output panel */}
                    <Box width="100%" height="200px">
                        {activePanel === "input" ? (

                            <Box width="100%">
                                <Heading size="sm" mb={2}>Test Cases</Heading>
                                <HStack spacing={2} mb={2}>
                                    {testCases.map((_, index) => (
                                        <HStack
                                            key={index} // Moved key here for proper rendering in the loop
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            position="relative"
                                        >
                                            <Button
                                                size="sm"
                                                colorScheme={selectedTestCase === index ? "blue" : "gray"}
                                                onClick={() => setSelectedTestCase(index)}
                                            >
                                                Case {index + 1}
                                            </Button>
                                            {hoveredIndex === index && (
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    size="xs"
                                                    onClick={() => deleteTestCase(index)}
                                                    position="absolute"
                                                    top="-10px"
                                                    right="-10px"
                                                />
                                            )}
                                        </HStack>
                                    ))}
                                    {testCases.length < 6 && (
                                        <IconButton
                                            icon={<AddIcon />}
                                            size="sm"
                                            onClick={addTestCase}
                                            aria-label="Add Test Case"
                                        />
                                    )}
                                </HStack>
                                {testCases[selectedTestCase] && (
                                    <Box borderWidth={1} borderRadius="md" p={4}>
                                        <VStack spacing={2} align="stretch">
                                            <Text fontSize="sm">Input:</Text>
                                            <Textarea
                                                value={testCases[selectedTestCase].input}
                                                onChange={(e) => updateTestCase('input', e.target.value)}
                                                size="sm"
                                            />
                                            <Text fontSize="sm">Expected Output:</Text>
                                            <Textarea
                                                value={testCases[selectedTestCase].expectedOutput}
                                                onChange={(e) => updateTestCase('expectedOutput', e.target.value)}
                                                size="sm"
                                            />
                                            <Tooltip label="Delete Test Case" placement="top-end">
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    size="sm"
                                                    onClick={() => deleteTestCase(selectedTestCase)}
                                                    alignSelf="flex-end"
                                                />
                                            </Tooltip>
                                        </VStack>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            loading ? (
                                <Flex justify="center" align="center" height="100%">
                                    <Spinner size="xl" />
                                </Flex>
                            ) : (
                                <Box bg="black.100" p={4} borderRadius="md" height="100%" overflowY="auto">
                                    <CodeOutput output={userOutput} status={status} />
                                </Box>
                            )
                        )}
                    </Box>
                </VStack>
            </Flex>
        </Box>
    );
}

export default CodeEditor;