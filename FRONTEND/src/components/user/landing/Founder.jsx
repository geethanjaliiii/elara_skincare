import { Button } from "@/components/ui/button"

import { Link } from "react-router-dom"

export default function FounderHero() {
  return (
    <section className="w-full bg-[#fdf6f0] px-16">
      <div className="container flex flex-col-reverse md:flex-row items-center gap-8 py-8 md:py-16">
        <div className="flex-1 hidden md:block">
          <img
            src="https://res.cloudinary.com/dby2ebbkr/image/upload/v1733418477/banners/huhfbrejlvyi1vvq6kje.jpg"
            alt="Founder"
            width={500}
            height={500}
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="flex-1 space-y-6 text-left">
          <h1 className="font-cursive italic text-4xl md:text-5xl lg:text-6xl">
            Hi beautiful soul.
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif">
              I&apos;m the Founder
            </h2>
          </div>
          <p className="font-sans text-muted-foreground text-lg md:text-xl leading-relaxed max-w-[600px]">
            At our company, we&apos;re all about keeping it natural and real with
            handpicked ingredients and products crafted with love. Always Choose
            Pure, Choose Natural.
          </p>
          <Button
            asChild
            className="rounded-full bg-black text-white hover:bg-black/90 px-8 font-sans"
          >
            <Link to="/our-story">Know More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

