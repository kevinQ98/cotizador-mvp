// components/ClientInfoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';

const MAX_NOMBRE = 75;
const MAX_EMPRESA = 75;
const MAX_EMAIL = 75;
const MAX_DESCRIPCION = 150;

const clientInfoSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    empresa: z.string().optional(),
    email: z.string().email("Correo electrónico inválido"),
    descripcion: z.string().max(MAX_DESCRIPCION, `Máximo ${MAX_DESCRIPCION} caracteres`)
        .optional(),
});

type ClientInfoFormValues = z.infer<typeof clientInfoSchema>;

export function ClientInfoForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ClientInfoFormValues>({
        resolver: zodResolver(clientInfoSchema),
    });

    const [descripcionLength, setDescripcionLength] = useState(0);
    const [nameLength, setNameLength] = useState(0);
    const [empresaLength, setEmpresaLength] = useState(0);
    const [emailLength, setEmailLength] = useState(0);

    const onSubmit = (data: ClientInfoFormValues) => {
        console.log("Datos del cliente:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="grid col-span-2 md:col-span-1 w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="nombre">Nombre del Cliente</Label>
                    <div className="relative">
                        <Input
                            id="nombre"
                            type="text"
                            autoComplete="off"
                            maxLength={MAX_NOMBRE}
                            placeholder="Juan Pérez"
                            className="pb-8 pt-5"
                            {...register("nombre")}
                            onChange={(e) => setNameLength(e.target.value.length)}
                        />
                        <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                            {nameLength}/{MAX_NOMBRE}
                        </span>
                    </div>
                    {errors.nombre && <span className="text-red-500">{errors.nombre.message}</span>}
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="empresa">Empresa (Opcional)</Label>
                    <div className="relative">
                        <Input
                            id="empresa"
                            type="text"
                            autoComplete="organization"
                            maxLength={MAX_EMPRESA}
                            placeholder="ABC S.A."
                            className="pb-8 pt-5"
                            {...register("empresa")}
                            onChange={(e) => setEmpresaLength(e.target.value.length)}
                        />
                        <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                            {empresaLength}/{MAX_EMPRESA}
                        </span>
                    </div>
                    {errors.empresa && <span className="text-red-500">{errors.empresa.message}</span>}
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email (Opcional)</Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            maxLength={MAX_EMAIL}
                            placeholder="ejemplo@correo.com"
                            className="pb-8 pt-5"
                            {...register("email")}
                            onChange={(e) => setEmailLength(e.target.value.length)}
                        />
                        <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                            {emailLength}/{MAX_EMAIL}
                        </span>
                    </div>
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="descripcion">Descripción de la Cotización (Opcional)</Label>
                <div className="relative">
                    <Input
                        type="text"
                        id="descripcion"
                        autoComplete="off"
                        maxLength={MAX_DESCRIPCION}
                        placeholder="Escribe una descripción de la cotización"
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
        </form>
    );
}