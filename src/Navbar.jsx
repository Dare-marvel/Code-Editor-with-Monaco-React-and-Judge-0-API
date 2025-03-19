import React from 'react';
import { Box, Heading, Slider, SliderTrack, SliderFilledTrack, SliderThumb, FormLabel } from '@chakra-ui/react';
import './Navbar.css';
import { LANGUAGES } from './constants/languages';
import Select from "react-select";


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

    return (
        <Box className="navbar" p={4} boxShadow="md" display="flex" alignItems="center" justifyContent="space-between">
            <Heading as="h1" size="lg">Code Compiler</Heading>

            {/* <Select
                value={userLang}
                onChange={(e) => {
                    console.log(e)
                    setUserLang(e.target.value)
                }}
                placeholder="Select Language"
                width="150px"
            >
                {LANGUAGES.map(lang => (
                    <option key={lang.id} value={lang.value}>
                        {lang.label}
                    </option>
                ))}
            </Select> */}

            <Select
                placeholder={userLang.label}
                options={LANGUAGES}
                value={userLang.value}
                className="w-full"
                onChange={(e) => {
                    setUserLang(e);
                }}
            />

            <Select
                placeholder="Select Theme"
                options={themes}
                value={userTheme.value}
                className="w-full"
                onChange={handleThemeChange}
            />


            {/* <Select
                value={userTheme}
                onChange={(e) => setUserTheme(e.target.value)}
                placeholder="Select Theme"
                width="150px"
            >
                {themes.map(theme => (
                    <option key={theme.value} value={theme.value}>
                        {theme.label}
                    </option>
                ))}
            </Select> */}

            <Box display="flex" alignItems="center">
                <FormLabel htmlFor="font-size-slider" mb="0" mr={2}>Font Size</FormLabel>
                <Slider
                    id="font-size-slider"
                    aria-label="slider-ex-1"
                    defaultValue={fontSize}
                    min={18}
                    max={30}
                    step={2}
                    onChange={(val) => setFontSize(val)}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
            </Box>
        </Box>
    );
}

export default Navbar;
