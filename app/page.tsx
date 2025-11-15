import { NavigationWrapper } from "@/components/navigation-wrapper";
import Link from "next/link";
import { Highlight, Text } from "@/components/text";
import { getSortedPostsData } from "@/lib/markdown";

export default function Home() {
  const posts = getSortedPostsData();

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

            <div className="grid mt-2 gap-2 grid-cols-1 sm:grid-cols-2">
              {posts.map(post =>
                <Link key={post.title} href={`/words/${post.slug}`}>
                  <h2 className="tracking-tighter font-serif italic font-medium">{post.title}</h2>
                  <p className="text-sm tracking-tight">{post.date.toLocaleDateString()}</p>
                </Link>
              )}
            </div>
          </section>

        </div>
      </NavigationWrapper >
    </main >
  );
}
