import {Box, Text, useColorModeValue} from '@chakra-ui/react'

const AppLogo = () => {

    return (
        
          <Box fontSize="2xl" fontWeight="bolder">
            <Text as="span" color={useColorModeValue("gray.600", "white")}>
              my
            </Text>
            <Text as="span" color="blue.600">
              app
            </Text>
          </Box>
    )
}

export default AppLogo