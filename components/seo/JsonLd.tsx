import React from "react";

interface JsonLdProps {
    data: Record<string, unknown>[] | undefined | null;
}

export function JsonLd({ data }: JsonLdProps) {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return (
        <>
            {data.map((ld, idx) => (
                <script
                    key={idx}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
                />
            ))}
        </>
    );
}
