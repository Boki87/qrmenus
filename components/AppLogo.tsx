import {Box, Text, useColorModeValue} from '@chakra-ui/react'

const AppLogo = () => {

    return (
        
          <Box fontSize="2xl" fontWeight="bolder">
            <img src={`/images/logo-wide${useColorModeValue('', '-white')}.png`} style={{width:'auto', height:'40px'}} />
          </Box>
    )
}

export default AppLogo
