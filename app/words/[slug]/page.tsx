import { NavigationWrapper } from '@/components/navigation-wrapper';
import { getPostBySlug } from '@/lib/markdown';
import { redirect } from 'next/navigation';
import { Text, Highlight, CodeBlock } from '@/components/text';
import React from 'react';
import Markdown from 'react-markdown';

interface WordsPageProps {
    params: {
        slug: string;
    }
}

export default function WordsPage({ params: { slug } }: WordsPageProps) {
    // Fetch blog data based on the slug
    // Render the blog content
    const post = getPostBySlug(slug);

    if (!post)
        redirect('/words');

    return (
        <main className="lg:flex justify-center">
            <NavigationWrapper linkText="Words" href="/words">
                <div className="w-full">
                    <h1 className="font-bold tracking-tighter font-serif italic">{post.title}</h1>

                    <Markdown components={{
                        p: Text,
                        strong: Highlight,
                    }} className={"prose"}>{post.content}</Markdown>
                </div>
            </NavigationWrapper >
        </main>
    );
};