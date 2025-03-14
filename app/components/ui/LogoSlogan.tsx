import { Logo } from "@/app/icons/icons";

export default function LogoSlogan() {
    return (
        <div className="flex items-center gap-6">
            <div className="size-16 md:size-20 hidden">
                <Logo />
            </div>
            <div>
                <h1 className="font-bold text-lg md:text-2xl">Generador de Cotizaciones</h1>
                <p className="font-light italic text-xs md:text-base">Crea y personaliza tus cotizaciones fácilmente</p>
            </div>
        </div>
    )
}