export default function UvjetiKupovinePage() {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-2xl font-bold mb-6">Uvjeti kupovine</h1>
  
        <section className="space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold mb-2">1. Opće odredbe</h2>
            <p>
              Ovi uvjeti kupovine primjenjuju se na sve narudžbe i kupovine putem naše online trgovine.
              Kupac je svaka osoba koja naruči barem jedan proizvod, ispuni tražene podatke i plati naručeni proizvod.
              Prodavatelj je Darts shop.
            </p>
          </div>
  
          <div>
            <h2 className="text-lg font-semibold mb-2">2. Narudžba i plaćanje</h2>
            <p>
              Kupac naručuje proizvod putem elektroničkog obrasca na webshopu. Plaćanje je moguće pouzećem ili karticom putem sigurnog Stripe sustava.
              Sve cijene su izražene u eurima (EUR) i uključuju PDV.
            </p>
          </div>
  
          <div>
            <h2 className="text-lg font-semibold mb-2">3. Dostava</h2>
            <p>
              Narudžbe se šalju putem kurirske službe na adresu koju kupac navede prilikom narudžbe.
              Trošak dostave jasno je naveden prije potvrde narudžbe. Rok dostave je obično 2–5 radnih dana.
            </p>
          </div>
  
          <div>
            <h2 className="text-lg font-semibold mb-2">4. Reklamacije i povrati</h2>
            <p>
              Kupac ima pravo na povrat proizvoda u roku 14 dana od primitka pošiljke. Proizvod mora biti nekorišten i u originalnom pakiranju.
              U slučaju reklamacije, kontaktirajte nas na info@darts-shop.com.
            </p>
          </div>
  
          <div>
            <h2 className="text-lg font-semibold mb-2">5. Pravna napomena</h2>
            <p>
              Web trgovina zadržava pravo izmjene ovih uvjeta bez prethodne najave. Kupac je dužan pročitati uvjete prije svake kupovine.
              Korištenjem webshopa potvrđujete da ste upoznati s ovim uvjetima i da ih prihvaćate.
            </p>
          </div>
        </section>
      </div>
    )
  }
  