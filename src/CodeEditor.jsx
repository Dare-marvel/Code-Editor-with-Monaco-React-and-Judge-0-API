import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Spinner, Textarea, Heading, VStack, HStack, Text, IconButton, Tooltip, Container, Spacer,ButtonGroup } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import Editor from "@monaco-editor/react";
import Navbar from './Navbar';
// import axios from 'axios';
import { FaPlay } from "react-icons/fa";
// import compileCode from './compiling';
import { boilerCodes } from "./constants/boilerCodes";
import CodeOutput from './CodeOutput';
import { CheckIcon } from '@chakra-ui/icons';

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
    const [status, setStatus] = useState(null)
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
    // const [isHovered, setIsHovered] = useState(false);
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

    const executeCode = async (input, exp_output) => {
        const formData = {
            language_id: userLang.id,
            source_code: btoa(userCode),
            stdin: btoa(input),
            expected_output: btoa(exp_output)
        }

        try {
            const { data } = await submitCode(formData)
            const { token } = data;
            const { data: output, success, err } = await checkStatus(token);

            if (success) {
                setUserOutput(output);
                setStatus("Finished");
                setLoading(false);
            } else {
                console.log(err);
                setStatus("Error");
                setLoading(false);
            }
        }
        catch (err) {
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

        executeCode(combinedInput, expectedOutput)

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

        executeCode(combinedInput, expectedOutput);
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <Container maxW="full" p={6}>
                <Flex gap={6} minH="calc(100vh - 3rem)">
                    {/* Left panel: Problem description */}
                    <Box
                        width="32%"
                        bg="white"
                        borderRadius="xl"
                        shadow="lg"
                        border="1px"
                        borderColor="gray.200"
                        overflow="hidden"
                    >
                        <Box bg="gradient-to-r from-blue.500 to-purple.600" p={4}>
                            <Heading size="lg" color="black" fontWeight="bold">
                                {problem.name}
                            </Heading>
                        </Box>

                        <VStack p={6} align="stretch" spacing={5} h="calc(100% - 80px)" overflowY="auto">
                            <Box>
                                <Text fontSize="md" color="gray.700" lineHeight="1.6">
                                    {problem.description}
                                </Text>
                            </Box>

                            <Box>
                                <Heading size="sm" mb={3} color="gray.800" fontWeight="semibold">
                                    📝 Examples
                                </Heading>
                                <Box
                                    bg="gray.50"
                                    p={4}
                                    borderRadius="lg"
                                    border="1px"
                                    borderColor="gray.200"
                                >
                                    <Text
                                        whiteSpace="pre-line"
                                        fontSize="sm"
                                        fontFamily="mono"
                                        color="gray.700"
                                    >
                                        {problem.examples}
                                    </Text>
                                </Box>
                            </Box>

                            <Box>
                                <Heading size="sm" mb={3} color="gray.800" fontWeight="semibold">
                                    ⚡ Constraints
                                </Heading>
                                <Box
                                    bg="yellow.50"
                                    p={4}
                                    borderRadius="lg"
                                    border="1px"
                                    borderColor="yellow.200"
                                >
                                    <Text
                                        whiteSpace="pre-line"
                                        fontSize="sm"
                                        color="gray.700"
                                    >
                                        {problem.constraints}
                                    </Text>
                                </Box>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Right panel: Code editor and I/O */}
                    <VStack width="68%" spacing={4}>
                        {/* Header with controls */}
                        <Box
                            width="100%"
                            bg="white"
                            borderRadius="xl"
                            shadow="md"
                            border="1px"
                            borderColor="gray.200"
                            p={4}
                        >
                            <Navbar
                                userTheme={userTheme}
                                setUserTheme={setUserTheme}
                                fontSize={fontSize}
                                setFontSize={setFontSize}
                                userLang={userLang}
                                setUserLang={setUserLang}
                            />
                        </Box>

                        {/* Code editor */}
                        <Box
                            width="100%"
                            height="600px"
                            bg="white"
                            borderRadius="xl"
                            shadow="md"
                            border="1px"
                            borderColor="gray.200"
                            overflow="hidden"
                            position="relative"
                        >
                            <Box
                                bg="gray.800"
                                px={4}
                                py={2}
                                borderBottom="1px"
                                borderColor="gray.200"
                            >
                                <Flex align="center" gap={2}>
                                    <Box w={3} h={3} borderRadius="full" bg="red.400" />
                                    <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
                                    <Box w={3} h={3} borderRadius="full" bg="green.400" />
                                    <Text ml={4} fontSize="sm" color="gray.300" fontWeight="medium">
                                        Solution.{userLang.value}
                                    </Text>
                                </Flex>
                            </Box>
                            <Editor
                                options={{
                                    ...options,
                                    padding: { top: 16, bottom: 16 }
                                }}
                                height="calc(100% - 48px)"
                                width="100%"
                                theme={userTheme}
                                language={userLang.value}
                                value={userCode}
                                onChange={(value) => { setUserCode(value) }}
                            />
                        </Box>

                        {/* Action buttons */}
                        <HStack
                            width="100%"
                            spacing={3}
                            bg="white"
                            p={4}
                            borderRadius="xl"
                            shadow="md"
                            border="1px"
                            borderColor="gray.200"
                        >
                            <Button
                                leftIcon={<CheckIcon />}
                                colorScheme="green"
                                onClick={runAllTestCases}
                                size="md"
                                fontWeight="semibold"
                                _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                                transition="all 0.2s"
                            >
                                Submit Solution
                            </Button>

                            <Button
                                leftIcon={<FaPlay />}
                                colorScheme="blue"
                                onClick={runUserTestCases}
                                size="md"
                                fontWeight="semibold"
                                _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                                transition="all 0.2s"
                            >
                                Run Tests
                            </Button>

                            <Spacer />

                            <ButtonGroup isAttached variant="outline">
                                <Button
                                    onClick={() => setActivePanel("input")}
                                    bg={activePanel === "input" ? "blue.50" : "white"}
                                    color={activePanel === "input" ? "blue.600" : "gray.600"}
                                    borderColor={activePanel === "input" ? "blue.300" : "gray.300"}
                                    fontWeight="medium"
                                    _hover={{ bg: activePanel === "input" ? "blue.100" : "gray.50" }}
                                >
                                    Input
                                </Button>
                                <Button
                                    onClick={() => setActivePanel("output")}
                                    bg={activePanel === "output" ? "blue.50" : "white"}
                                    color={activePanel === "output" ? "blue.600" : "gray.600"}
                                    borderColor={activePanel === "output" ? "blue.300" : "gray.300"}
                                    fontWeight="medium"
                                    _hover={{ bg: activePanel === "output" ? "blue.100" : "gray.50" }}
                                >
                                    Output
                                </Button>
                            </ButtonGroup>
                        </HStack>

                        {/* Input/Output panel */}
                        <Box
                            width="100%"
                            height="auto"
                            minH="200px"
                            bg="white"
                            borderRadius="xl"
                            shadow="md"
                            border="1px"
                            borderColor="gray.200"
                            overflow="hidden"
                        >
                            {activePanel === "input" ? (
                                <Box p={6} h="100%">
                                    <Flex justify="space-between" align="center" mb={4}>
                                        <Heading size="md" color="gray.800" fontWeight="semibold">
                                            🧪 Test Cases
                                        </Heading>
                                        {testCases.length < 6 && (
                                            <Button
                                                leftIcon={<AddIcon />}
                                                size="sm"
                                                colorScheme="blue"
                                                variant="ghost"
                                                onClick={addTestCase}
                                                _hover={{ bg: "blue.50" }}
                                            >
                                                Add Case
                                            </Button>
                                        )}
                                    </Flex>

                                    <HStack spacing={2} mb={4} flexWrap="wrap">
                                        {testCases.map((_, index) => (
                                            <Box
                                                key={index}
                                                position="relative"
                                                onMouseEnter={() => setHoveredIndex(index)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                            >
                                                <Button
                                                    size="sm"
                                                    bg={selectedTestCase === index ? "blue.500" : "gray.100"}
                                                    color={selectedTestCase === index ? "white" : "gray.700"}
                                                    onClick={() => setSelectedTestCase(index)}
                                                    borderRadius="full"
                                                    px={4}
                                                    _hover={{
                                                        transform: "translateY(-1px)",
                                                        shadow: "md"
                                                    }}
                                                    transition="all 0.2s"
                                                >
                                                    Case {index + 1}
                                                </Button>
                                                {hoveredIndex === index && testCases.length > 1 && (
                                                    <IconButton
                                                        icon={<DeleteIcon />}
                                                        size="xs"
                                                        colorScheme="red"
                                                        variant="solid"
                                                        onClick={() => deleteTestCase(index)}
                                                        position="absolute"
                                                        top="-8px"
                                                        right="-8px"
                                                        borderRadius="full"
                                                        shadow="md"
                                                    />
                                                )}
                                            </Box>
                                        ))}
                                    </HStack>

                                    {testCases[selectedTestCase] && (
                                        <Box
                                            borderWidth={1}
                                            borderRadius="lg"
                                            borderColor="gray.200"
                                            bg="gray.50"
                                            p={4}
                                            h="calc(100% - 120px)"
                                            overflowY="auto"
                                        >
                                            <VStack spacing={4} align="stretch">
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                                        📥 Input:
                                                    </Text>
                                                    <Textarea
                                                        value={testCases[selectedTestCase].input}
                                                        onChange={(e) => updateTestCase('input', e.target.value)}
                                                        size="sm"
                                                        borderRadius="md"
                                                        bg="white"
                                                        borderColor="gray.300"
                                                        _focus={{ borderColor: "blue.400", shadow: "0 0 0 1px blue.400" }}
                                                        fontFamily="mono"
                                                        resize="vertical"
                                                    />
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                                        📤 Expected Output:
                                                    </Text>
                                                    <Textarea
                                                        value={testCases[selectedTestCase].expectedOutput}
                                                        onChange={(e) => updateTestCase('expectedOutput', e.target.value)}
                                                        size="sm"
                                                        borderRadius="md"
                                                        bg="white"
                                                        borderColor="gray.300"
                                                        _focus={{ borderColor: "blue.400", shadow: "0 0 0 1px blue.400" }}
                                                        fontFamily="mono"
                                                        resize="vertical"
                                                    />
                                                </Box>
                                            </VStack>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                loading ? (
                                    <Flex justify="center" align="center" height="100%" flexDirection="column" gap={4}>
                                        <Spinner size="xl" color="blue.500" thickness="4px" />
                                        <Text color="gray.600" fontSize="sm">Running your code...</Text>
                                    </Flex>
                                ) : (
                                    <Box
                                        bg="gray.900"
                                        p={6}
                                        height="auto"
                                        overflowY="auto"
                                        position="relative"
                                    >
                                        <Box
                                            position="absolute"
                                            top={4}
                                            right={4}
                                            bg="gray.800"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            <Text fontSize="xs" color="gray.400" fontWeight="medium">
                                                Console Output
                                            </Text>
                                        </Box>
                                        <CodeOutput output={userOutput} status={status} />
                                    </Box>
                                )
                            )}
                        </Box>
                    </VStack>
                </Flex>
            </Container>
        </Box>
    );
}

export default CodeEditor;