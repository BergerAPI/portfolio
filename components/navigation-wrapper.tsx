import Link from "next/link";
import { PropsWithChildren } from "react";

export const NavigationWrapper = ({
    children, href, linkText
}: PropsWithChildren & {
    href?: string, linkText?: string
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[theme(spacing.24)_theme(screens.sm)_theme(spacing.24)] lg:gap-0 ">
            <nav>
                {(href && linkText) && (
                    <Link className="sticky top-16" href={href}>
                        <div className="m-auto flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>

                            <span className="italic font-serif tracking-tighter">{linkText}</span>
                        </div>
                    </Link>
                )}
            </nav>
            <div>{children}</div>
        </div>
    )
}