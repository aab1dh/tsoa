export interface blogPost {
    id: number;
    slug: string;
    status: "published" | "unpublished";
    content: string;
    author: {
        email: string;
        name: string;
        phoneNumbers?: string[];
    }
}