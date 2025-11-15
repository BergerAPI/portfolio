import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="mt-12 pb-6 border-t pt-6">
            <div className="flex">
                <div className="flex gap-6 items-center text-slate-600">
                    <Link
                        href="https://github.com/BergerAPI"
                        className="font-serif italic tracking-tighter hover:text-slate-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </Link>
                    <span className="text-slate-400">·</span>
                    <Link
                        href="https://youtube.com/@bergerbtw"
                        className="font-serif italic tracking-tighter hover:text-slate-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        YouTube
                    </Link>
                </div>
            </div>
        </footer>
    );
};
