import {
    QueryClient,
    HydrationBoundary,
    dehydrate,
} from "@tanstack/react-query";
import { fetchNotes} from "@/lib/api";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";
import {Note, NoteTag} from "@/types/note";

interface SlugProps {
    params: Promise<{ slug: string[] }>,
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