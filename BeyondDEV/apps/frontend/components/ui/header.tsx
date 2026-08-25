export default function Header({ title, subtitle }: { title: string, subtitle: string }): React.ReactNode {
    return (
        <>
            <div className="my-4">
                <h1 className="text-[24px] color-white font-bold text-[#efc704]">
                    {title}
                </h1>
                <p className="text-slate-400 color-white">{subtitle}</p>
            </div>
        </>
    );
}