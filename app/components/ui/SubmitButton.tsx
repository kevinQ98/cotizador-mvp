import { useQuoteStore } from "@/app/store/useQuoteStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useState } from "react";
// Function to filter out unsupported characters
const filterText = (text: string) => {
    console.log('Received text:', text);

    // Regex to remove emojis (but keep letters, numbers, punctuation, spaces, and accents)
    const unsupportedChars = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    const filteredText = text.replace(unsupportedChars, ''); // Remove only emojis
    console.log('Filtered text:', filteredText);
    return filteredText;
};

const splitTextIntoLines = (text: string, maxWidth: number, fontSize: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = testLine.length * (fontSize * 0.1); // Aproximación del ancho del texto

        if (testWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
};

export function PdfButton() {
    const { items, subtotal, descuento, total } = useQuoteStore();
    const [logo, setLogo] = useState<ArrayBuffer | null>(null);
    // const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!["image/png"].includes(file.type)) {
                alert("Solo se permiten imágenes PNG.");
                return;
            }

            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
                if (e.target?.result) {
                    setLogo(e.target.result as ArrayBuffer);
                }
            };
        }
    };

    const generatePDF = async (print = false) => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4 size
        const { width, height } = page.getSize();

        let yOffset = height - 50; // Start from the top
        const margin = 40; // Margin for content

        // Add Date
        const date = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        page.drawText(`Fecha: ${date}`, {
            x: width - 160,
            y: yOffset,
            size: 10,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color: rgb(0, 0, 0),
        });

        yOffset -= 30;

        // Add logo
        if (logo) {
            const image = await pdfDoc.embedPng(logo);

            // Calculate the aspect ratio of the logo
            const { width: imgWidth, height: imgHeight } = image.scale(1); // Get original dimensions

            // Define the max size for the image (cover effect)
            const maxSize = 50; // Max size for the logo

            // Calculate the aspect ratio to avoid distortion
            const aspectRatio = imgWidth / imgHeight;

            let finalWidth = maxSize;
            let finalHeight = maxSize;

            // Adjust width and height based on aspect ratio
            if (imgWidth > imgHeight) {
                finalHeight = maxSize / aspectRatio;
            } else {
                finalWidth = maxSize * aspectRatio;
            }

            // Draw the image on the PDF
            page.drawImage(image, {
                x: margin,
                y: yOffset - finalHeight,
                width: finalWidth,
                height: finalHeight,
            });
        }

        // Title "Cotización"
        page.drawText("Cotización", {
            x: logo ? margin + 70 : margin,
            y: yOffset - 20,
            size: 24,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            color: rgb(0, 0, 0),
        });

        yOffset -= 60;

        // Customer Information
        const clientInfo = {
            nombre: (document.getElementById("nombre") as HTMLInputElement)?.value || "Sin Nombre",
            empresa: (document.getElementById("empresa") as HTMLInputElement)?.value || "",
            email: (document.getElementById("email") as HTMLInputElement)?.value || "",
        };

        console.log(clientInfo, 'aqui evr si pasa')

        // Calcular la altura del box de información del cliente
        const clientInfoLines = [
            clientInfo.nombre,
            clientInfo.empresa,
            clientInfo.email,
        ].filter(Boolean).length; // Contar cuántos campos tienen datos
        const boxHeight = 30 + clientInfoLines * 20; // Ajustar la altura según los datos

        // Draw client info box (solo borde, sin fondo)
        page.drawRectangle({
            x: margin,
            y: yOffset - boxHeight,
            width: width - 2 * margin,
            height: boxHeight,
            borderColor: rgb(0.8, 0.8, 0.8),
            borderWidth: 1,
        });

        page.drawText("Información del Cliente", {
            x: margin + 10,
            y: yOffset - 20,
            size: 12,
            font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        });

        let clientYOffset = yOffset - 40;
        page.drawText(`Nombre: ${filterText(clientInfo.nombre)}`, {
            x: margin + 10,
            y: clientYOffset,
            size: 10,
        });

        if (clientInfo.empresa) {
            clientYOffset -= 20;
            page.drawText(`Empresa: ${filterText(clientInfo.empresa)}`, {
                x: margin + 10,
                y: clientYOffset,
                size: 10,
            });
        }

        if (clientInfo.email) {
            clientYOffset -= 20;
            page.drawText(`Email: ${filterText(clientInfo.email)}`, {
                x: margin + 10,
                y: clientYOffset,
                size: 10,
            });
        }

        yOffset -= boxHeight + 35;

        // Description
        const descripcion = (document.getElementById("descripcion") as HTMLInputElement)?.value || "";
        if (descripcion) {
            page.drawText("Descripción:", {
                x: margin,
                y: yOffset,
                size: 12,
                font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            });

            // Dividir el texto en líneas más pequeñas
            const maxLineWidth = width - 2 * margin; // Ancho máximo por línea
            const lineHeight = 12; // Espaciado entre líneas
            const lines = splitTextIntoLines(descripcion, maxLineWidth, 10); // Dividir el texto

            // Dibujar cada línea
            let descYOffset = yOffset - 15;
            lines.forEach((line) => {
                page.drawText(line, {
                    x: margin,
                    y: descYOffset,
                    size: 10,
                    lineHeight: lineHeight,
                    maxWidth: maxLineWidth,
                });
                descYOffset -= lineHeight; // Ajustar la posición Y para la siguiente línea
            });

            yOffset -= lines.length * lineHeight + 50; // Ajustar el yOffset para el siguiente elemento
        }

        // Table Header
        const tableYStart = yOffset;
        const rowHeight = 20;

        page.drawText("#", { x: margin, y: tableYStart, size: 12, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
        page.drawText("Descripción", { x: margin + 30, y: tableYStart, size: 12, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
        page.drawText("Precio", { x: width - 200, y: tableYStart, size: 12, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
        page.drawText("Cant.", { x: width - 130, y: tableYStart, size: 12, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });
        page.drawText("Total", { x: width - 70, y: tableYStart, size: 12, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });

        yOffset -= rowHeight;

        // Table Rows
        items.forEach((item, index) => {
            // Dibujar el número del ítem
            page.drawText((index + 1).toString(), { x: margin, y: yOffset, size: 10 });

            // Dibujar el nombre del ítem
            const nombreLines = splitTextIntoLines(filterText(item.nombre), width - 270, 12); // Dividir el nombre en líneas
            let nombreYOffset = yOffset;
            nombreLines.forEach((line) => {
                page.drawText(line, {
                    x: margin + 30,
                    y: nombreYOffset,
                    size: 12,
                    lineHeight: 12, // Espaciado entre líneas
                    maxWidth: width - 270,
                });
                nombreYOffset -= 12; // Ajustar la posición Y para la siguiente línea
            });

            // Dibujar la descripción del ítem (si existe)
            let descYOffset = nombreYOffset; // Comenzar debajo del nombre
            if (item.descripcion) {
                const descripcionLines = splitTextIntoLines(filterText(item.descripcion), width - 280, 8); // Dividir la descripción en líneas
                descripcionLines.forEach((line) => {
                    page.drawText(line, {
                        x: margin + 30,
                        y: descYOffset - 15, // Espacio entre nombre y descripción
                        size: 8,
                        lineHeight: 10, // Espaciado entre líneas
                        maxWidth: width - 280,
                    });
                    descYOffset -= 10; // Ajustar la posición Y para la siguiente línea
                });
            }

            // Dibujar precio, cantidad y total
            page.drawText(`$${item.precio.toFixed(2)}`, { x: width - 200, y: yOffset, size: 10 });
            page.drawText(`${item.cantidad}`, { x: width - 130, y: yOffset, size: 10 });
            page.drawText(`$${(item.precio * item.cantidad).toFixed(2)}`, { x: width - 70, y: yOffset, size: 10 });

            // Calcular la posición Y de la línea separadora
            const separatorY = item.descripcion ? descYOffset - 25 : nombreYOffset - 10;

            // Dibujar separador gris suave entre filas
            page.drawLine({
                start: { x: margin, y: separatorY },
                end: { x: width - margin, y: separatorY },
                thickness: 0.5,
                color: rgb(0.9, 0.9, 0.9),
            });

            // Ajustar yOffset para el siguiente ítem
            yOffset = separatorY - 23; // Espacio adicional antes del siguiente ítem
        });

        yOffset -= 30;

        // Totals
        page.drawText(`Subtotal: $${subtotal.toFixed(2)}`, { x: width - 128, y: yOffset, size: 12 });
        if (descuento > 0) {
            page.drawText(`Descuento: $${descuento.toFixed(2)}`, { x: width - 140, y: yOffset - 15, size: 12 });
            yOffset -= 15;
        }
        page.drawText(`Total: $${total.toFixed(2)}`, { x: width - 138, y: yOffset - 35, size: 16, font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) });

        yOffset -= 80;

        // Notas
        const notas = (document.getElementById("notas") as HTMLInputElement)?.value || "";
        if (notas) {
            page.drawText("Notas Adicionales:", {
                x: margin,
                y: yOffset,
                size: 12,
                font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
            });
            page.drawText(notas, {
                x: margin,
                y: yOffset - 15,
                size: 10,
                maxWidth: width - 2 * margin,
            });
        }

        // Footer
        // const footerText = "Gracias por confiar en nosotros. ¡Esperamos hacer negocios contigo!";
        const footerText = `Gracias por usar nuestro cotizador. Desarrollado por @qosmo__.`;
        page.drawText(footerText, {
            x: margin,
            y: 40,
            size: 10,
            color: rgb(0.5, 0.5, 0.5),
        });

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        if (print) {
            // setPreviewUrl(pdfUrl);
            const iframe = document.createElement("iframe");
            iframe.src = pdfUrl;
            iframe.style.position = "absolute";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "none";
            document.body.appendChild(iframe);
            iframe.contentWindow?.print();
        } else {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = "cotizacion.pdf";
            link.click();
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
            <div className="grid w-full items-center gap-3">
                {/* Title with additional instruction */}
                <Label htmlFor="logoU" className="font-bold text-gray-700">
                    Subir Logo (Se recomienda cuadrado)
                </Label>
                <p className="text-sm text-gray-500 mb-2">
                    Por favor, sube una imagen PNG. El logo debe ser cuadrado para una mejor calidad de visualización.
                </p>
                <Input
                    type="file"
                    id="logoU"
                    accept="image/png"
                    onChange={handleLogoUpload}
                />
            </div>

            {/* Buttons for actions */}
            <div className="flex flex-col gap-4 mt-4">
                <Button onClick={() => generatePDF(true)} className="w-full hidden lg:flex">
                    Imprimir
                </Button>
                <Button onClick={() => generatePDF(false)} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Descargar PDF
                </Button>
            </div>

            {/* Preview iframe */}
            {/* {previewUrl && (
                <div className="mt-6">
                    <iframe
                        src={previewUrl}
                        className="w-full h-96 border-2 border-gray-200 rounded-md shadow-sm"
                    ></iframe>
                </div>
            )} */}
        </div>
    );
}