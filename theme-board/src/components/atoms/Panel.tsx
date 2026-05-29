import './Panel.css'

export default function Panel({ children }: { children: React.ReactNode }) {

    return (
        <div className="panel">
            {children}
        </div>
    );
}