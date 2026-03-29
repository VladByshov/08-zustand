import {
    QueryClient,
    HydrationBoundary,
    dehydrate,
} from "@tanstack/react-query";
import { fetchNotes} from "@/lib/api";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";
import { NoteTag} from "@/types/note";
import {Metadata} from "next";

interface SlugProps {
    params: Promise<{ slug: string[] }>,
}

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
    const { slug } = await params;
    const category = slug?.[0] === "all" ? undefined : (slug?.[0] as NoteTag);
    const title = category ? `NoteHub: ${category}` : "NoteHub: All Notes";
    const description = category
        ? `Browse ${category.toLowerCase()} notes in NoteHub.`
        : "Browse all notes in NoteHub.";
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: category
                ? `https://08-zustand-opal-ten.vercel.app/notes/filter/${category}`
                : "https://08-zustand-opal-ten.vercel.app/notes/filter/all",
            siteName: "NoteHub",
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: "NoteHub app",
                },
            ],
        },
    };
}


export default async function NotesPage({params}:SlugProps) {
    const queryClient = new QueryClient();

    const {slug} = await params;
    const chosenTag = (slug[0] === "all" ? undefined : slug[0]) as NoteTag | undefined;

    await queryClient.prefetchQuery({
        queryKey: ["notes", 1, "", chosenTag],
        queryFn: () => fetchNotes({page:1, perPage: 12, search:"", tag: chosenTag}),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={chosenTag} />
        </HydrationBoundary>
    );
}