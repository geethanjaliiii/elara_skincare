import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import OurStory from '@/components/user/ourStory/OurStory'
import { ParallaxBackground } from '@/components/user/ourStory/parallax'

export default function OurStoryPage() {
  return (
    <main>
        <Navbar/>
      <ParallaxBackground />
      <OurStory />
      <Footer/>
    </main>
  )
}
