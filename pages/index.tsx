import {Box} from '@chakra-ui/react'
import type { NextPage } from 'next'
import LandingPageNav from '../components/LandingPageNav'
import LandingHeroSection from '../components/LandingHeroSection'
import LandingFeatures from '../components/LandingFeatures'
import LandingFooter from '../components/LandingFooter'

const Home: NextPage = () => {
  return (
    <Box pt="90px">
        <LandingPageNav />
      <LandingHeroSection />
      <LandingFeatures />
      <LandingFooter />
    </Box>
  )
}

export default Home
