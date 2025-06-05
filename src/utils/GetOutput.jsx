import { Box, Text, Code } from "@chakra-ui/react";

export const getOutput = (output) => {
  const statusId = output?.status?.id;

  // Case: Compilation Error (Status ID 6)
  if (statusId === 6) {
    return (
      <Box px={2} py={1}>
        <Text fontSize="sm" color="red.500" fontFamily="mono" whiteSpace="pre-wrap">
          {atob(output?.compile_output)}
        </Text>
      </Box>
    );
  }

  // Case: Successful Execution (Status ID 3)
  if (statusId === 3) {
    return (
      <Box px={2} py={1}>
        {output?.time && (
          <Text fontSize="sm" fontWeight="medium" color="green.500" fontFamily="mono" mb={2}>
            Finished in {parseInt(output.time * 100)} ms
          </Text>
        )}
        <Code
          display="block"
          whiteSpace="pre-wrap"
          fontSize="sm"
          p={2}
          borderRadius="md"
          bg="gray.100"
          fontFamily="mono"
        >
          {atob(output.stdout)}
        </Code>
      </Box>
    );
  }

  // Case: Time Limit Exceeded (Status ID 5)
  if (statusId === 5) {
    return (
      <Box px={2} py={1}>
        <Text fontSize="sm" color="red.500" fontFamily="mono">
          Time Limit Exceeded
        </Text>
      </Box>
    );
  }

  // Case: Other Errors
  return (
    <Box px={2} py={1}>
      <Text fontSize="sm" color="red.500" fontFamily="mono" whiteSpace="pre-wrap">
        {atob(output?.stderr)}
      </Text>
    </Box>
  );
};

// Optional: Chakra-ready color mapping for statuses
export const statusColor = {
  Running: "blue.500",
  Completed: "green.500",
  Error: "red.500",
};
