import { NavigationWrapper } from "@/components/navigation-wrapper";
import Link from "next/link";
import { PropsWithChildren } from "react";

const Highlight = ({ children }: PropsWithChildren) => {
    return <strong className="font-serif tracking-tighter italic">{children}</strong>
}

const Text = ({ children }: PropsWithChildren) => {
    return <p className="leading-8 tracking-tight font-medium">{children}</p>
}

export default function Words() {
    return (
        <main className="flex justify-center">
            <NavigationWrapper linkText="Home" href="/">
                <h1 className="font-bold tracking-tighter font-serif italic">My words</h1>

                <Text>
                    Find out some interesting stuff here.
                </Text>
            </NavigationWrapper >
        </main >
    );
}
