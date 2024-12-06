import { MapPin, Phone } from 'lucide-react';

export default function VisitUs() {
  const locations = [
    {
      city: "Chennai",
      address: "114, St.Cathedral Rd, opp. Stella Mary's College, Gopalapuram, Chennai- 600086",
      phone: "95143 25599",
      image: "https://deyga.in/cdn/shop/files/Rectangle_146.png?v=1710833061&width=750",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0C38.9543 0 30 8.95431 30 20V80C30 91.0457 38.9543 100 50 100C61.0457 100 70 91.0457 70 80V20C70 8.95431 61.0457 0 50 0ZM40 20C40 14.4772 44.4772 10 50 10C55.5228 10 60 14.4772 60 20V35H40V20ZM60 80C60 85.5228 55.5228 90 50 90C44.4772 90 40 85.5228 40 80V65H60V80Z" />
        </svg>
      ),
    },
    {
      city: "Coimbatore",
      address: "Deyga organics SF 468, Avinashi Road, Peelamedu, Coimbatore - 641004",
      phone: "95143 45599",
      image: "https://deyga.in/cdn/shop/files/01_1_8fc8d7a6-e3b3-4b87-b5f6-9b5798631ef4.jpg?v=1700125242&width=750",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0ZM70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50Z" />
        </svg>
      ),
    },
    {
      city: "Erode",
      address: "59, Mosuvanna St, Erode, Tamil Nadu 638009.",
      phone: "95143 75599",
      image: "https://img.freepik.com/free-photo/full-shot-woman-shopping-market_23-2149148466.jpg?t=st=1733422125~exp=1733425725~hmac=93175c5f209f14f27981739e8c0bf151583bd3c24764d57d9a86cf968e4159ea&w=740",
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0L0 50H20V100H80V50H100L50 0ZM40 40H60V90H40V40Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-[#FBF9F7]">
      <div className="container px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-center mb-8 md:mb-12">
          Visit us
        </h2>
        <div className="grid gap-6">
          {/* Store Images */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <img
                  src={location.image}
                  alt={`${location.city} store`}
                  className="aspect-[4/3] object-cover w-full"
                />
              </div>
            ))}
          </div>
          {/* Location Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {locations.map((location, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-white"
              >
                <div className="text-primary flex-shrink-0">
                  {location.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    <h3 className="text-sm md:text-base font-semibold">{location.city}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {location.address}
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    <a
                      href={`tel:${location.phone.replace(/\s/g, '')}`}
                      className="text-xs md:text-sm hover:underline"
                    >
                      {location.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
