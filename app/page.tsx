import { NavigationWrapper } from "@/components/navigation-wrapper";
import Link from "next/link";
import { PropsWithChildren } from "react";

const Highlight = ({ children }: PropsWithChildren) => {
  return <strong className="font-serif tracking-tighter italic">{children}</strong>
}

const Text = ({ children }: PropsWithChildren) => {
  return <p className="leading-8 tracking-tight font-medium">{children}</p>
}

export default function Home() {
  return (
    <main className="flex justify-center">
      <NavigationWrapper>
        <div className="space-y-4">
          <section id="introduction">
            <h1 className="font-bold tracking-tighter font-serif italic">Niclas Berger</h1>

            <Text>
              Hello there! I am <Highlight>Niclas</Highlight>. Currently a <Highlight>part-time software engineer</Highlight> studying <Highlight>economics</Highlight>.
              Working at <Highlight>GISA GmbH in Halle, Germany</Highlight>. Sometimes coding something and contibuting to <Highlight>open-source</Highlight>.
              Trying to be the best version of myself.
            </Text>
          </section>

          <section>
            <h2 className="font-bold tracking-tighter font-serif italic">Sometimes I write...</h2>

            <Text>If you want to read some words of mine, feel free to check out my <Highlight><Link className="underline" href="/words">words</Link></Highlight>.</Text>
          </section>
        </div>
      </NavigationWrapper >
    </main >
  );
}
