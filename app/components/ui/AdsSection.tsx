import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const adsData = [
    { img: "/ads1.webp", link: "https://qosmo.vercel.app/" },
    { img: "/ads2.webp", link: "https://qosmo.gumroad.com/l/xatlt" },
];

export default function AdsSection() {
    return (
        <div className="flex items-start flex-col mb-6">
            <p className="font-bold text-xs py-1 px-3 bg-gray-200 rounded-t-md">Publicidad</p>
            <div className="border border-gray-200 w-full rounded-b-md rounded-r-md p-1 relative">
                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 5000,
                            stopOnInteraction: true
                        }),
                    ]}
                    opts={{
                        loop: true,
                    }}
                    orientation="horizontal"
                >
                    <CarouselContent>
                        {adsData.map((ad, index) => (
                            <CarouselItem key={index}>
                                <a href={ad.link} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={ad.img}
                                        alt={`Ad ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                </a>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
}
