"use client";

import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watch: any;
};

export default function ProductList({ control }: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Productos</h3>

            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-3 gap-4 mb-2">
                    <input
                        {...control.register(`products.${index}.name`)}
                        placeholder="Producto"
                        className="border p-2"
                    />
                    <input
                        {...control.register(`products.${index}.quantity`, { valueAsNumber: true })}
                        type="number"
                        placeholder="Cantidad"
                        className="border p-2"
                    />
                    <input
                        {...control.register(`products.${index}.price`, { valueAsNumber: true })}
                        type="number"
                        placeholder="Precio"
                        className="border p-2"
                    />
                    <Button onClick={() => remove(index)} variant="destructive">Eliminar</Button>
                </div>
            ))}

            <Button onClick={() => append({ name: "", quantity: 1, price: 0 })}>
                + Agregar Producto
            </Button>
        </div>
    );
}
