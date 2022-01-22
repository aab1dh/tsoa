export interface blogPost {
    id: number;
    email: string;
    name: string;
    status?: "Happy" | "Sad";
    phoneNumbers?: string[];
    article: string;
}