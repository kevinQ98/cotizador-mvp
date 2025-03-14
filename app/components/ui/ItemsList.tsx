import { useQuoteStore } from "@/app/store/useQuoteStore";
import { AddItemSheet } from "./AddItemSheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

export default function ItemsList() {
    const { items, removeItem } = useQuoteStore();

    return (
        <>
            <AddItemSheet />
            <div className="overflow-x-auto mt-4">
                <Table className="w-full">
                    <TableHeader className="bg-muted">
                        <TableRow className="">
                            <TableHead className="w-[300px] text-left text-sm font-semibold">Descripción</TableHead>
                            <TableHead className="text-center text-sm font-semibold">Precio</TableHead>
                            <TableHead className="text-center text-sm font-semibold">Cantidad</TableHead>
                            <TableHead className="text-right text-sm font-semibold">Total</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            items.length > 0 ? (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="py-3">
                                            <p className="font-medium text-sm capitalize">{item.nombre}</p>
                                            <p className="text-xs text-gray-500">{item.descripcion}</p>
                                        </TableCell>
                                        <TableCell className="text-center text-sm">${item.precio.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-sm">{item.cantidad}</TableCell>
                                        <TableCell className="text-right text-sm font-semibold">
                                            ${(item.precio * item.cantidad).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <button
                                                className="text-red-500 hover:text-red-700 p-1 transition duration-200"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <X size={18} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-400">No hay ítems</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </>
    )
}