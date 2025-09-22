'use client'

import { useEffect, useState } from 'react'
import ProductSection from './ProductSection'

const slides = [
  {
    id: 'strelice',
    productId: 1, 
    title: 'LUKE LITTLER SP',
    price: '€190',
    image: '/img/4_030.jpg',
    description: 'Profesionalne strelice za maksimalnu preciznost.',
    colors: [
      { code: 'purple', img: '/img/4_030.jpg' },
      { code: 'gold', img: '/img/2luke_002.jpg' }
    ],
    grams: ['22g', '23g', '24g']
  },
  {
    id: 'pera',
    productId: 10, 
    title: 'HD150 Pentathlon pera',
    price: '€1.10',
    image: '/img/pnt2000_000_000.jpg',
    description: 'Izdržljiva i lagana pera za strelice.',
    colors: [
      { code: 'red', img: '/img/pnt2000_000_000.jpg' },
      { code: 'blue', img: '/img/plava.jpg' }
    ],
    grams: ['150mkr', '180mkr']
  },
  {
    id: 'nastavci',
    productId: 16, 
    title: 'Pro grip nastavci',
    price: '€7',
    image: '/img/2midi_000.jpg',
    description: 'Nastavci za bolji grip i kontrolu strelice.',
    colors: [
      { code: 'black', img: '/img/2midi_000.jpg' },
      { code: 'yellow', img: '/img/2_707.jpg' }
    ],
    grams: ['kratki', 'midi', 'dugi']
  },
  {
    id: 'spicevi',
    productId: 25, 
    title: 'Caliburn EVO Spiro No Lip',
    price: '€10.95',
    image: '/img/1spiro_011.jpg',
    description: 'Napredni dizajn špica za natjecateljsku igru.',
    colors: [
      { code: 'grey', img: '/img/1spiro_011.jpg' },
      { code: 'black', img: '/img/1rippleblack_005.jpg' }
    ],
    grams: ['32mm', '36mm', '41mm']
  },
  {
    id: 'mete',
    productId: 31, 
    title: 'Winmau Blade 6 Dual Core',
    price: '€80',
    image: '/img/2200x1500_blade_6_dual_core_2.jpg',
    description: 'Profesionalna meta za pikado.',
    colors: [],
    grams: []
  }
]

export default function Slider() {
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as string
      const index = slides.findIndex((item) => item.id === id)
      if (index !== -1) setSlideIndex(index)
    }

    window.addEventListener('navigate-to-slider', handler)
    return () => window.removeEventListener('navigate-to-slider', handler)
  }, [])

  const activeSlide = slides[slideIndex]

  const prevSlide = () => {
  setSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      
    <div>
      
      <section className="slider relative" id={activeSlide.id}>
        <div className='text-overlay'>
          <h2>IZDVOJENI PROIZVODI</h2>
        </div>
          <button onClick={prevSlide} className="sliderArrow left">⟨</button>
          <button onClick={nextSlide} className="sliderArrow right">⟩</button>
        <div className="sliderWrapper">

          <div className="sliderItem">
            <img src={activeSlide.image} alt={activeSlide.title} className="sliderImage" />
            <div className="sliderBox">
              <div className="sliderText">
                <h1 className="sliderTitle">{activeSlide.title}</h1>
                <h2 className="sliderPrice">{activeSlide.price}</h2>
                <p className="text-gray-800 mb-4">{activeSlide.description}</p>
                <a href={`#product-${activeSlide.id}`}>
                  <button className="BuyButton">Kupi odmah!</button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
      

      {/* PRODUCT SECTION */}
      <div id={`product-${activeSlide.id}`}>
        <ProductSection product={activeSlide} />
      </div>
    </>
  )
}
