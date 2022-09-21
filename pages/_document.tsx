import {ColorModeScript} from "@chakra-ui/react"
import NextDocumnet, { NextScript, Html, Head, Main } from "next/document";
import theme from '../style/theme'

export default class Document extends NextDocumnet {
    render () {
        return (
        <Html lang="eng">
                <Head />
                <body>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
