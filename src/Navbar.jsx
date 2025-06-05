import React from 'react';
import { 
  Box, 
  Heading, 
  Slider, 
  SliderTrack, 
  SliderFilledTrack, 
  SliderThumb, 
  FormLabel,
  HStack,
  VStack,
  Text,
  Badge,
  IconButton,
  Tooltip,
  useColorModeValue,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import Select from "react-select";
import './Navbar.css';
import { LANGUAGES } from './constants/languages';

const Navbar = ({ userLang, setUserLang, userTheme, setUserTheme, fontSize, setFontSize }) => {
    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "javascript", label: "Javascript" }
    ];

    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ];

    function handleThemeChange(th) {
        const theme = th;
        if (["light", "vs-dark"].includes(theme.value)) {
            setUserTheme(theme.value);
        }
    }

    // Custom styles for react-select
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            minWidth: '160px',
            border: '2px solid',
            borderColor: state.isFocused ? '#3182ce' : '#e2e8f0',
            borderRadius: '12px',
            padding: '4px 8px',
            boxShadow: state.isFocused 
                ? '0 0 0 3px rgba(49, 130, 206, 0.1)' 
                : provided.boxShadow,
            background: 'white',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            '&:hover': {
                borderColor: '#3182ce',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? '#3182ce' 
                : state.isFocused 
                    ? '#ebf8ff' 
                    : 'white',
            color: state.isSelected ? 'white' : '#2d3748',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            marginTop: '8px'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#a0aec0',
            fontSize: '14px'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#2d3748',
            fontSize: '14px',
            fontWeight: '500'
        })
    };

    const darkSelectStyles = {
        ...selectStyles,
        control: (provided, state) => ({
            ...selectStyles.control(provided, state),
            background: '#2d3748',
            borderColor: state.isFocused ? '#63b3ed' : '#4a5568',
            color: 'white',
            '&:hover': {
                borderColor: '#63b3ed',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }
        }),
        option: (provided, state) => ({
            ...selectStyles.option(provided, state),
            backgroundColor: state.isSelected 
                ? '#63b3ed' 
                : state.isFocused 
                    ? '#4a5568' 
                    : '#2d3748',
            color: 'white'
        }),
        menu: (provided) => ({
            ...selectStyles.menu(provided),
            background: '#2d3748',
            borderColor: '#4a5568'
        }),
        singleValue: (provided) => ({
            ...selectStyles.singleValue(provided),
            color: 'white'
        }),
        placeholder: (provided) => ({
            ...selectStyles.placeholder(provided),
            color: '#a0aec0'
        })
    };

    const bgGradient = useColorModeValue(
        'linear(to-r, blue.50, purple.50, pink.50)',
        'linear(to-r, gray.900, blue.900, purple.900)'
    );
    
    const glassBg = useColorModeValue(
        'rgba(255, 255, 255, 0.9)',
        'rgba(26, 32, 44, 0.9)'
    );

    const isDark = useColorModeValue(false, true);

    return (
        <Box
            bgGradient={bgGradient}
            backdropFilter="blur(10px)"
            borderBottom="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            position="sticky"
            top={0}
            zIndex={100}
        >
            <Box
                bg={glassBg}
                backdropFilter="blur(20px)"
                px={6}
                py={4}
                className="navbar"
            >
                <Flex alignItems="center" maxW="7xl" mx="auto">
                    {/* Logo Section */}
                    <HStack spacing={3}>
                        <Box
                            w={12}
                            h={12}
                            bgGradient="linear(to-br, blue.500, purple.600)"
                            borderRadius="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow="lg"
                            transform="rotate(-5deg)"
                            _hover={{ transform: 'rotate(0deg)' }}
                            transition="transform 0.3s ease"
                        >
                            <Text color="white" fontSize="xl" fontWeight="bold">
                                {'</>'}
                            </Text>
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Heading 
                                as="h1" 
                                size="lg" 
                                bgGradient="linear(to-r, blue.600, purple.600)"
                                bgClip="text"
                                fontWeight="bold"
                            >
                                Code Compiler
                            </Heading>
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                Build • Test • Deploy
                            </Text>
                        </VStack>
                    </HStack>

                    <Spacer />

                    {/* Controls Section */}
                    <HStack spacing={8} align="center">
                        {/* Language Selector */}
                        <VStack align="start" spacing={2}>
                            <HStack>
                                <Text 
                                    fontSize="xs" 
                                    fontWeight="semibold" 
                                    color="gray.600" 
                                    textTransform="uppercase" 
                                    letterSpacing="wider"
                                >
                                    Language
                                </Text>
                                <Badge 
                                    colorScheme="blue" 
                                    variant="subtle" 
                                    fontSize="xs" 
                                    px={2} 
                                    py={1} 
                                    borderRadius="md"
                                >
                                    {userLang?.label || 'None'}
                                </Badge>
                            </HStack>
                            <Select
                                placeholder="Select Language"
                                options={LANGUAGES}
                                value={userLang}
                                styles={isDark ? darkSelectStyles : selectStyles}
                                onChange={(e) => {
                                    setUserLang(e);
                                }}
                                isSearchable={true}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </VStack>

                        {/* Theme Selector */}
                        <VStack align="start" spacing={2}>
                            <HStack>
                                <Text 
                                    fontSize="xs" 
                                    fontWeight="semibold" 
                                    color="gray.600" 
                                    textTransform="uppercase" 
                                    letterSpacing="wider"
                                >
                                    Theme
                                </Text>
                                <Box 
                                    w={3} 
                                    h={3} 
                                    bg={userTheme === 'vs-dark' ? 'gray.800' : 'white'} 
                                    border="2px solid"
                                    borderColor="gray.400"
                                    borderRadius="full" 
                                />
                            </HStack>
                            <Select
                                placeholder="Select Theme"
                                options={themes}
                                value={themes.find(theme => theme.value === userTheme)}
                                styles={isDark ? darkSelectStyles : selectStyles}
                                onChange={handleThemeChange}
                                isSearchable={false}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </VStack>

                        {/* Font Size Control */}
                        <VStack align="start" spacing={3} minW="220px">
                            <HStack justify="space-between" w="full">
                                <FormLabel 
                                    htmlFor="font-size-slider" 
                                    mb="0" 
                                    fontSize="xs" 
                                    fontWeight="semibold" 
                                    color="gray.600" 
                                    textTransform="uppercase" 
                                    letterSpacing="wider"
                                >
                                    Font Size
                                </FormLabel>
                                <Badge 
                                    colorScheme="purple" 
                                    variant="subtle" 
                                    px={2} 
                                    py={1} 
                                    borderRadius="md"
                                    fontSize="xs"
                                >
                                    {fontSize}px
                                </Badge>
                            </HStack>
                            <Box w="full">
                                <Slider
                                    id="font-size-slider"
                                    aria-label="font-size-slider"
                                    value={fontSize}
                                    min={18}
                                    max={30}
                                    step={2}
                                    onChange={(val) => setFontSize(val)}
                                    colorScheme="purple"
                                >
                                    <SliderTrack 
                                        bg="gray.200" 
                                        h={3} 
                                        borderRadius="full"
                                    >
                                        <SliderFilledTrack 
                                            bgGradient="linear(to-r, purple.400, pink.400)" 
                                        />
                                    </SliderTrack>
                                    <SliderThumb 
                                        boxSize={6} 
                                        bg="white" 
                                        border="3px solid"
                                        borderColor="purple.500"
                                        boxShadow="lg"
                                        _focus={{ 
                                            boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.3)' 
                                        }}
                                        // _hover={{
                                        //     transform: 'scale(1.1)'
                                        // }}
                                        transition="transform 0.2s ease"
                                    />
                                </Slider>
                            </Box>
                        </VStack>

                        {/* Settings Button */}
                        <Tooltip label="Advanced Settings" hasArrow placement="bottom">
                            <IconButton
                                aria-label="Settings"
                                icon={<SettingsIcon />}
                                variant="ghost"
                                colorScheme="gray"
                                size="lg"
                                borderRadius="xl"
                                _hover={{
                                    bg: useColorModeValue('gray.100', 'gray.700'),
                                    transform: 'rotate(90deg)'
                                }}
                                transition="all 0.3s ease"
                            />
                        </Tooltip>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
}

export default Navbar;