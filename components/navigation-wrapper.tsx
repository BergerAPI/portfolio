import Link from "next/link";
import { PropsWithChildren } from "react";
import { Footer } from "./footer";

export const NavigationWrapper = ({
    children, href, linkText
}: PropsWithChildren & {
    href?: string, linkText?: string
}) => {
    return (
        <div className="max-w-2xl mx-auto">
            {(href && linkText) && (
                <nav className="mb-8">
                    <Link href={href} className="inline-flex gap-2 items-center text-slate-600 hover:text-slate-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        <span className="italic font-serif tracking-tighter">{linkText}</span>
                    </Link>
                </nav>
            )}
            <div>{children}</div>
            <Footer />
        </div>
    )
}