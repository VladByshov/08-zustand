"use client"

import {useParams, useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {fetchNoteById} from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css"

export default function NotePreviewClient(){
    const router = useRouter();

    const onClose = () => router.back();

    const { id } = useParams<{ id: string }>()

    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey:["notes", id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });
    if (isLoading) return <p>Loading, please wait...</p>;

    if (isError || !data) return <p>Something went wrong.</p>;

    return(
        <>
            <Modal onClose={onClose}>
                {isLoading && <p>Loading, please wait...</p>}
                {(isError || !data) && <p>Something went wrong.</p>}
                <div className={css.container}>
                    <div className={css.item}>
                        <div className={css.header}>
                            <h2>{data.title}</h2>
                        </div>
                        <p className={css.tag}>{data.tag}</p>
                        <p className={css.content}>{data.content}</p>
                        <p className={css.date}>{data.createdAt}</p>
                    </div>
                </div>
            </Modal>
        </>
    );
}