"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProductList from "./ProductList";
import { Button } from "@/components/ui/button";

const quoteSchema = z.object({
    clientName: z.string().min(1, "El nombre es obligatorio"),
    company: z.string().optional(),
    products: z.array(
        z.object({
            name: z.string().min(1, "Nombre obligatorio"),
            quantity: z.number().min(1, "Cantidad mínima 1"),
            price: z.number().min(0.01, "Precio mínimo 0.01"),
        })
    ),
    notes: z.string().optional(),
});

type QuoteFormInputs = z.infer<typeof quoteSchema>;

export default function QuoteForm() {
    const { register, handleSubmit, control, watch } = useForm<QuoteFormInputs>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            clientName: "",
            company: "",
            products: [{ name: "", quantity: 1, price: 0 }],
            notes: "",
        },
    });

    const onSubmit: SubmitHandler<QuoteFormInputs> = (data) => {
        console.log("Cotización generada:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-2xl font-bold">Nueva Cotización</h2>

            <div className="grid grid-cols-2 gap-4">
                <input
                    {...register("clientName")}
                    placeholder="Nombre del Cliente"
                    className="border p-2 w-full"
                />
                <input
                    {...register("company")}
                    placeholder="Empresa (Opcional)"
                    className="border p-2 w-full"
                />
            </div>

            <ProductList control={control} watch={watch} />

            <textarea
                {...register("notes")}
                placeholder="Notas adicionales (Opcional)"
                className="border p-2 w-full"
            />

            <Button type="submit">Generar Cotización</Button>
        </form>
    );
}
