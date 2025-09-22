// src/components/Partners.tsx

export default function Partners() {
    const logos = [
      '/img/images (1).png',
      '/img/Winmau Logo-  White Text with Black Background.jpg',
      '/img/images (2).png',
      '/img/pentathlon.webp',
    ]
  
    return (
      <section className="partners flex flex-col items-center gap-8 py-10 px-6 bg-white">
        <div className="partnerImages flex flex-wrap justify-center gap-10 w-full">
          {logos.map((src, i) => (
            <div key={i} className="partnerItem h-[120px] flex justify-center items-center p-4">
              <img src={src} alt={`partner-${i}`} className="partnerImg max-h-full max-w-[150px] object-contain" />
            </div>
          ))}
        </div>

      </section>
    )
  }
  