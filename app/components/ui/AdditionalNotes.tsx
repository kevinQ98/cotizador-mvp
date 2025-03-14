// components/AdditionalNotes.tsx
import { useForm } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function AdditionalNotes() {
    const { register } = useForm();

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea id="notas" {...register('notas')} placeholder="Añade instrucciones o comentarios aquí..." />
        </div>
    );
}