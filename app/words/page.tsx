import { NavigationWrapper } from "@/components/navigation-wrapper";
import { getSortedPostsData } from "@/lib/markdown";
import Link from "next/link";
import { Text } from "@/components/text";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Niclas Berger | My Words',
    description: 'Read about some interesting stuff, that I wrote, here.',
}

export default async function Words() {
    const posts = getSortedPostsData();

    return (
        <main className="lg:flex justify-center">
            <NavigationWrapper linkText="Home" href="/">
                <div className="w-full">
                    <h1 className="font-bold tracking-tighter font-serif italic">My words</h1>

                    <Text>
                        Find out some interesting stuff here.
                    </Text>

                    <div className="grid mt-2 gap-2 grid-cols-1 sm:grid-cols-2">
                        {posts.map(post =>
                            <Link key={post.title} href={`/words/${post.slug}`}>
                                <h2 className="tracking-tighter font-serif italic font-medium">{post.title}</h2>
                                <p className="text-sm tracking-tight">{post.date.toLocaleDateString()}</p>
                            </Link>
                        )}
                    </div>
                </div>
            </NavigationWrapper >
        </main>
    );
}
