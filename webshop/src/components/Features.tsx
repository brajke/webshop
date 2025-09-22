// src/components/Features.tsx

export default function Features() {
    const features = [
      {
        icon: 'fast-delivery-icon-in-blue-style-for-any-projects-vector-35418577.jpg',
        title: 'FREE SHIPPING',
        desc: 'Free worldwide shipping on all orders!',
      },
      {
        icon: 'send-back-easy-parcel-return-icon-blue-color-vector-32386836.jpg',
        title: '30 DAYS RETURN',
        desc: 'Return and refund in 14 days!',
      },
      {
        icon: 'email-symbol-blue-white-logo-nr3n538-600.jpg',
        title: 'CONTACT US',
        desc: 'Keep in touch via e-mail!',
      },
    ]
  
    return (
      <section className="features flex flex-wrap justify-evenly items-center py-12 bg-white text-center gap-10">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="feature flex flex-col items-center max-w-xs px-4">
            <img src={`/img/${icon}`} alt={title} className="featureIcon w-[70px] h-[70px] mb-4" />
            <span className="featureTitle text-[20px] font-semibold mb-2">{title}</span>
            <p className="featureDesc text-gray-600">{desc}</p>
          </div>
        ))}
      </section>
    )
  }
  