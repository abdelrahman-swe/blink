import type { ReactNode } from "react";

type LegalLayoutProps = {
    children: ReactNode;
};

export default function LegalLayout({ children }: LegalLayoutProps) {
    return (
        <div className="bg-[#F9F9F9] flex flex-col grow min-h-[50vh]">
            {children}
        </div>
    );
}
