'use client'
// pages/index.tsx
// import { Button } from "@/components/ui/button";
import LogoSlogan from "./components/ui/LogoSlogan";
import { useQuoteStore } from "./store/useQuoteStore";
import ItemsList from "./components/ui/ItemsList";
import { ClientInfoForm } from "./components/ui/ClientInfoForm";
import { AdditionalNotes } from "./components/ui/AdditionalNotes";
import { Input } from "@/components/ui/input";
import { PdfButton } from "./components/ui/SubmitButton";
import AdsSection from "./components/ui/AdsSection";

export default function Home() {
  const { subtotal, descuento, total, updateDescuento } = useQuoteStore();

  // Función para manejar el cambio en el input de descuento
  const handleDescuentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Si el campo está vacío, establecer el descuento en 0
    if (value === "") {
      updateDescuento(0);
      return;
    }

    // Validar que el valor sea un número con hasta 2 decimales
    const regex = /^\d*\.?\d{1,2}$/; // Permite 0.25, 0.5, 1.25, etc.
    if (regex.test(value)) {
      updateDescuento(Number(value));
    }
  };

  return (
    <main className="flex flex-col lg:flex-row lg:h-full p-6 items-start gap-6">
      <section className="w-full md:w-4/4 h-full">
        <LogoSlogan />
        <div className="mt-4">
          <ClientInfoForm />
          <ItemsList />

          <div className="flex flex-col lg:flex-row-reverse justify-between items-start border-t pt-4 gap-4">
            {/* Totales en móviles arriba, en desktop a la derecha */}
            <div className="w-full lg:w-auto">
              <div className="flex w-full max-w-sm items-center space-x-2 font-medium text-sm justify-between p-2.5">
                <p>Subtotal:</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex w-full max-w-sm items-center space-x-2 font-medium text-sm justify-between p-2.5">
                <p>Descuento:</p>
                <Input
                  type="number"
                  value={descuento === 0 ? "" : descuento} // Mostrar vacío si el descuento es 0
                  onChange={handleDescuentoChange}
                  className="w-20"
                  step="0.01" // Permitir decimales con hasta 2 dígitos
                />
              </div>
              <div className="flex w-full max-w-sm items-center space-x-2 font-bold text-2xl justify-between p-2.5 border-t border-t-black">
                <p>Total:</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            {/* Notas en móviles abajo, en desktop a la izquierda */}
            <div className="w-full">
              <AdditionalNotes />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full lg:w-1/4 h-full">
        {/* ADS SECTION */}
        <AdsSection />

        {/* PDF PERSOZALIZE */}
        <PdfButton />
      </section>
    </main>
  );
}