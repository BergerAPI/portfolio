import { NavigationWrapper } from '@/components/navigation-wrapper';
import { getPostBySlug } from '@/lib/markdown';
import { redirect } from 'next/navigation';
import { Text, Highlight, CodeBlock } from '@/components/text';
import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';

interface WordsPageProps {
    params: Promise<{
        slug: string;
    }>
}

export async function generateMetadata(
    { params }: WordsPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Fetch blog data based on the slug
    // Render the blog content
    const post = await getPostBySlug((await params).slug);

    if (!post)
        return {
            title: 'Niclas Berger | Not Found',
        }

    const firstLine = post.content.split('\n').filter(line => line.length > 3)[0];

    return {
        title: `${post.title} | Niclas Berger`,
        description: firstLine,
    }
}

export default async function WordsPage({ params }: WordsPageProps) {
    // Fetch blog data based on the slug
    // Render the blog content
    const post = await getPostBySlug((await params).slug);

    if (!post)
        redirect('/words');

    return (
        <main className="lg:flex justify-center">
            <NavigationWrapper linkText="Words" href="/">
                <div className="w-full mb-80">
                    <h1 className="font-bold tracking-tighter font-serif italic">{post.title}</h1>

                    <div className={"prose"} dangerouslySetInnerHTML={{ __html: post.content }}></div>
                </div>
            </NavigationWrapper >
        </main>
    );
};