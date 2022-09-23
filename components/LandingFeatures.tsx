import {Center, Text, Box, useColorModeValue, VStack} from "@chakra-ui/react"
import Image from "next/image"
import AppContainer from "./Container"

const featuresArr = [
    {
        title: 'supabase',
        img: '/images/supabase.svg',
        description: 'A very powerful and flexible baas for modern web applications.'
    },

    {
        title: 'next',
        img: '/images/nextjs.svg',
        description: 'A production-ready react framework with the great developer experience.'
    },
    {
        title: 'chakra',
        img: '/images/chakra.svg',
        description: 'A UI component library that gives full customizability and accessible components.'
    },
    {
        title: 'redux',
        img: '/images/redux.png',
        description: 'A Predictable State Container for JS Apps'
    },
]


const LandingFeatures = () => {


    return <Box bg={useColorModeValue('gray.100', 'gray.700')} py="50px">
                <AppContainer>
                    <Center>
                        <VStack gap="20px" w="full">
                            <Text as="h3" fontSize="4xl" fontWeight="bold" color={useColorModeValue('gray.700', 'gary.100')}>The Tech Behind</Text>
                    {featuresArr.map( f => <FeatureDiv key={f.title} img={f.img} description={f.description} />)}
                            </VStack> 
                    </Center>

                </AppContainer>
    </Box>
}

export default LandingFeatures


const FeatureDiv = ({img, description}: {img: string, description: string}) => {

    return (
        <Box w="full" minH="250px" bg={useColorModeValue('white', 'gray.500')} borderRadius="xl" display="flex" alignContent="center" justifyContent="center" flexDir="column" p="30px">
            <Box textAlign="center" w="full" mb="20px">

                <img src={img} style={{height: '80px', width:'auto', display:'inline'}} />
            </Box>
            <Text textAlign="center" fontSize="xl">{description}</Text>
        </Box>
    )
}