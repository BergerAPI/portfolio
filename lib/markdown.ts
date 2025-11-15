import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content');

interface PostType { slug: string, date: Date, title: string, content: string }

/**
 * Getting all markdown files from the content folder
 */
export function getSortedPostsData() {
    const allPosts = fs.readdirSync(postsDirectory).map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            slug,
            date: new Date(matterResult.data.date),
            title: matterResult.data.title,
        } as PostType;
    });

    return allPosts.sort((a, b) => (a.date < b.date) ? 1 : -1);
}

export async function getPostBySlug(slug: string): Promise<PostType | null> {
    const postPath = path.join(postsDirectory, `${slug}.md`);

    // Checking whether the file exists
    if (!fs.existsSync(postPath))
        return null;

    const content = fs.readFileSync(postPath, 'utf8');
    const matterResult = matter(content);

    const processedContent = await remark()
        .use(html)
        .use(remarkGfm)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        content: contentHtml,
        date: matterResult.data.date,
        title: matterResult.data.title
    };
}