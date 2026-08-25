'use client';

export default function Form({ title, labels, inputs }: { title: string, labels: string[], inputs: any[] }) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
            <div className="bg-[#0a0f19] border border-white/10 rounded-xl p-8 max-w-[650px] w-full shadow-2xl">
                <h2 className='text-center pb-5'>{title}</h2>
                <div className="flex flex-col justify-center gap-2">
                    <form action="">
                        {labels.map((label, index) => (
                            <div className="flex justify-center gap-4" key={index}>
                                <label htmlFor={label}>{label}</label>
                                <br></br>
                                {inputs[index]}
                            </div>
                        ))}
                    </form>
                </div>
            </div>
        </div>
    );
}