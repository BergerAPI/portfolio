import { PropsWithChildren } from "react"

export const Highlight = ({ children }: PropsWithChildren) => {
    return <strong className="font-serif tracking-tighter italic">{children}</strong>
}

export const Text = ({ children }: PropsWithChildren) => {
    return <p className="leading-8 tracking-tight font-medium">{children}</p>
}

export const CodeBlock = ({ children }: PropsWithChildren) => {
    return <code className="bg-gray-100 p-1 rounded-md">{children}</code>
}