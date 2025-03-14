"use client";

import { useState } from "react";

export default function Sidebar() {
    const [color, setColor] = useState("#000000");

    return (
        <>
            <h3 className="text-lg font-semibold">Personalización</h3>

            <div className="mt-4">
                <label className="block text-sm">Color del encabezado:</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10"
                />
            </div>
        </>
    );
}
