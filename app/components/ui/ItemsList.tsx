import { useQuoteStore } from "@/app/store/useQuoteStore";
import { AddItemSheet } from "./AddItemSheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

export default function ItemsList() {
    const { items, removeItem } = useQuoteStore();

    return (
        <>
            <AddItemSheet />
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[500px]">Descripcion Item</TableHead>
                        <TableHead className="text-center">Precio</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        items.length > 0 ? (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="text-wrap">
                                            <p className="font-bold">{item.nombre}</p>
                                            <p className="font-light italic text-xs">{item.descripcion}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">${item.precio.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">{item.cantidad}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 items-center place-content-end">
                                            ${(item.precio * item.cantidad).toFixed(2)}

                                            <button className="text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No hay ítems</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    )
}