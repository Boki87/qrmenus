import {extendTheme} from '@chakra-ui/react'

const styles = {
    global: () => ({
        html: {
            h: '100%',
            w: '100%',
        },
        body: {
            h: '100%',
            w: '100%',
        },
        '#__next': {
            h: '100%',
            w: '100%',
        }
    })
}

const config = {
    initialColorMode: 'light',
    useSystemColorMode: true
}


const theme = extendTheme({
    config,
    styles
})

export default theme
