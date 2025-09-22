const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-700">
        
        <div>
          <h2 className="text-lg font-bold mb-3 text-black">Webshop</h2>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-black transition">Naslovna</a></li>
            <li><a href="/strelice" className="hover:text-black transition">Strelice</a></li>
            <li><a href="/nastavci" className="hover:text-black transition">Nastavci</a></li>
            <li><a href="/spicevi" className="hover:text-black transition">Špicevi</a></li>
            <li><a href="/my-orders" className="hover:text-black transition">Moje narudžbe</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 text-black">Obavezni podaci</h2>
          <ul className="space-y-2">
            <li><a href="/uvjeti-kupovine" className="hover:text-black transition">Uvjeti kupovine</a></li>
            <li><a href="/uvjeti-koristenja" className="hover:text-black transition">Uvjeti korištenja</a></li>
            <li><a href="/dostava" className="hover:text-black transition">Dostava</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 text-black">O nama</h2>
          <ul className="space-y-2">
            <li><a href="/o-nama" className="hover:text-black transition">O Darts shop</a></li>
            <li><a href="/partneri" className="hover:text-black transition">Partneri</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 text-black">Kontakt info</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p><strong>Darts shop</strong> </p>
            </div>
            <p><strong>E-mail:</strong> info@darts-shop.com</p>
            <p><strong>Tel:</strong> +385 91 91 22 443 (pon–pet 8:00 – 14:00)</p>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-xs py-4 text-gray-400">
        © {new Date().getFullYear()} Webshop. Sva prava pridržana.
      </div>
    </footer>
  )
}

export default Footer
