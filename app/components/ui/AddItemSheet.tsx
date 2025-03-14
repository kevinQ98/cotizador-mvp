import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuoteStore } from "@/app/store/useQuoteStore";
import { useState } from "react";

const MAX_NOMBRE = 75;
const MAX_DESCRIPCION = 100;
const MAX_PRECIO = 9999.99;
const MAX_CANTIDAD = 9999;

const itemSchema = z.object({
    nombre: z.string()
        .min(1, "El nombre es requerido")
        .max(MAX_NOMBRE, `Máximo ${MAX_NOMBRE} caracteres`),
    descripcion: z.string()
        .max(MAX_DESCRIPCION, `Máximo ${MAX_DESCRIPCION} caracteres`)
        .optional(),
    precio: z.number({
        required_error: "Ingresa un número válido",
        invalid_type_error: "Ingresa un número válido",
    })
        .min(0, "El precio debe ser mayor o igual a 0")
        .max(MAX_PRECIO, `El precio no puede superar ${MAX_PRECIO}`)
        .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toString()), {
            message: "El precio debe tener hasta 2 decimales",
        }),
    cantidad: z.number({
        required_error: "Ingresa un número válido",
        invalid_type_error: "Ingresa un número válido",
    })
        .min(1, "La cantidad debe ser mayor o igual a 1")
        .max(MAX_CANTIDAD, `La cantidad no puede superar ${MAX_CANTIDAD}`)
        .int("La cantidad debe ser un número entero"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export function AddItemSheet() {
    const { addItem } = useQuoteStore();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema),
    });

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [nombreLength, setNombreLength] = useState(0);
    const [descripcionLength, setDescripcionLength] = useState(0);

    const onSubmit = (data: ItemFormValues) => {
        addItem({
            id: Math.random().toString(36).substr(2, 9),
            ...data,
        });
        reset();
        setNombreLength(0);
        setDescripcionLength(0);
        setIsSheetOpen(false);
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="default" className="mt-4">Agregar ítem</Button>
            </SheetTrigger>
            <SheetContent className="p-6 overflow-y-auto">
                <SheetHeader className="p-0 mt-5">
                    <SheetTitle>Agregar ítem</SheetTitle>
                    <SheetDescription>Complete los detalles del ítem.</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nombre del ítem */}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="nombre">Nombre del ítem</Label>
                        <div className="relative">
                            <Input
                                id="nombre"
                                maxLength={MAX_NOMBRE}
                                placeholder="Ej. Producto/Servicio"
                                className="pb-8 pt-5"
                                {...register("nombre")}
                                onChange={(e) => setNombreLength(e.target.value.length)}
                            />
                            <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                                {nombreLength}/{MAX_NOMBRE}
                            </span>
                        </div>
                        {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
                    </div>

                    {/* Descripción */}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <div className="relative">
                            <Input
                                type="text"
                                id="descripcion"
                                maxLength={MAX_DESCRIPCION}
                                placeholder="Una breve descripción del producto o servicio."
                                className="pb-8 pt-5"
                                {...register("descripcion")}
                                onChange={(e) => setDescripcionLength(e.target.value.length)}
                            />
                            <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                                {descripcionLength}/{MAX_DESCRIPCION}
                            </span>
                        </div>
                        {errors.descripcion && <span className="text-red-500 text-xs">{errors.descripcion.message}</span>}
                    </div>

                    {/* Precio */}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="precio">Precio</Label>
                        <Input
                            id="precio"
                            type="number"
                            step="0.01"
                            placeholder="Ej. 25.99"
                            {...register("precio", { valueAsNumber: true })}
                            min="0"
                            max={MAX_PRECIO}
                        />
                        {errors.precio && <span className="text-red-500 text-xs">{errors.precio.message}</span>}
                    </div>

                    {/* Cantidad */}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="cantidad">Cantidad</Label>
                        <Input
                            id="cantidad"
                            type="number"
                            step="1"
                            placeholder="Ej. 10"
                            {...register("cantidad", { valueAsNumber: true })}
                            min="1"
                            max={MAX_CANTIDAD}
                        />
                        {errors.cantidad && <span className="text-red-500 text-xs">{errors.cantidad.message}</span>}
                    </div>

                    <Button type="submit">Agregar</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
