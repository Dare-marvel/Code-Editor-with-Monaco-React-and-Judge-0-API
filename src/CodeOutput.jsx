import React from "react";
import { Box, Text, Badge, Flex } from "@chakra-ui/react";
import { getOutput } from "./utils/GetOutput";

const CodeOutput = ({ output, status }) => {
    const statusColor = {
        Running: "blue.500",
        Completed: "green.500",
        Success: "green.500",
        Error: "red.500",
    }[status] || "gray.500";

    return (
        <Box w="full" h="full" p={4}>
            <Flex align="center" borderBottom="2px" borderColor="gray.200" pb={4}>
                <Text fontSize="lg" fontWeight="medium" color="white">
                    Output:
                </Text>
                {status && (
                    <Badge
                        ml={3}
                        px={4}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        color="white"
                        bg={statusColor}
                        textAlign="center"
                    >
                        {status}
                    </Badge>
                )}
            </Flex>
            <Box
                mt={3}
                p={4}
                border="1px"
                borderColor="gray.300"
                borderRadius="md"
                bg="gray.50"
                fontFamily="mono"
                fontSize="sm"
                whiteSpace="pre-wrap"
                overflowY="auto"
                maxH="400px"
                color="black"
            >
                {output ? getOutput(output) : null}
            </Box>
        </Box>
    );
};

export default CodeOutput;
