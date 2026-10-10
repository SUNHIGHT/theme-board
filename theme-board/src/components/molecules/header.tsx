import type { ReactNode } from "react";

type HeaderProps = {
    children: ReactNode;
};


export default function Header({ children }: HeaderProps) {
    return (
        <div className="app-header" style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>自分の行動・成長・詰まりを可視化するアプリ</h1>
            {children}
        </div>
    );
}