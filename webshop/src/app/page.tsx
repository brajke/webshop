// src/app/page.tsx
import Slider from '../components/Slider'
import '../index.css'
import Features from '../components/Features'
import Gallery from '../components/Gallery'
import Partners from '../components/Partners'
import Footer from '@/components/Footer'


export default function Home() {
  return (
    <>
      <Slider />
      <Features />
      <Gallery />
      <Partners />
      <Footer />
    </>
  )
}
