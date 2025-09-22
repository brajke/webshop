const partners = [
    { name: 'Target', image: '/img/images (1).png' },
    { name: 'Winmau', image: '/img/Winmau Logo-  White Text with Black Background.jpg'},
    { name: 'Caliburn', image: '/img/images (2).png'},
    { name: 'Pentathlon', image: '/img/pentathlon.webp'},
  ]
  
  export default function PartneriPage() {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-2xl font-bold mb-6">Partneri i brendovi</h1>
        <p className="text-sm text-gray-600 mb-10">
          S ponosom surađujemo s renomiranim svjetskim brendovima i dobavljačima. 
          Kvaliteta proizvoda i zadovoljstvo kupaca su nam prioritet.
        </p>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner) => (
            <a
              key={partner.name}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center hover:opacity-80 transition"
            >
              <img
                src={partner.image}
                alt={partner.name}
                className="max-h-16 object-contain grayscale hover:grayscale-0 transition"
              />
            </a>
          ))}
        </div>
      </div>
    )
  }
  