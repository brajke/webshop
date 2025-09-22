// src/components/Gallery.tsx

export default function Gallery() {
    const items = [
      {
        title: 'Izaberi najbolje!',
        image: '/img/winmau-blade-life-style-fb-1.jpg',
      },
      {
        title: 'Igraj kao prvak!',
        image: '/img/LUKE_LITTLER_PRODIGY_1920x1080px_V1_533x.webp',
      },
      {
        title: 'Naruči brzo i povoljno!',
        image: '/img/upute.png',
      },
    ]
  
    return (
      <>
      <section className="gallery bg-black flex flex-col md:flex-row p-12 gap-6">
        {items.map(({ title, image }) => (
          <div key={title} className="galleryItem flex-1 px-4">
            <h1 className="galleryTitle text-white text-xl font-semibold mb-4">{title}</h1>
            <img src={image} alt={title} className="galleryImg w-full object-cover rounded" />
          </div>
        ))}
      </section>
      </>
    )
  }
  