import {AnimatePresence, motion} from 'framer-motion'
import {IconButton, useColorMode, useColorModeValue} from '@chakra-ui/react'
import {BsSun, BsMoon} from 'react-icons/bs'


const ThemeToggleButton = () => {

    const {toggleColorMode} = useColorMode()


    return (
    <AnimatePresence mode="wait" initial={false}>
            <motion.div
                style={{display:"block"}}
                key={useColorModeValue('light', 'dark')}
                initial={{y:-20, opacity: 0}}
                animate={{y:0, opacity:1}}
                exit={{y:20,opacity:0}}
                transition={{duration: 0.2}}
            >
                <IconButton
                    variant="ghost"
                    borderRadius="full"
                    aria-label="Toggle theme"
                    colorScheme={useColorModeValue('blue','orange')}
                    icon={useColorModeValue(<BsMoon />, <BsSun />)}
                    onClick={toggleColorMode}
                >
                </IconButton>
            </motion.div>
        </AnimatePresence>
    )

}

export default ThemeToggleButton
