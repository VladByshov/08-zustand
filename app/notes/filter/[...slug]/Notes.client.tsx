"use client";

import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import NoNotes from "@/components/NoNotes/NoNotes";
import {NoteTag} from "@/types/note";

interface NoteCLientProps {
    tag?: NoteTag;
}

export default function NotesClient({ tag }:NoteCLientProps) {
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { data, error, isError } = useQuery({
        queryKey: ["notes", page, searchQuery, tag],
        queryFn: () => fetchNotes({ page, perPage: 12, search: searchQuery, tag:tag }),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });
    if (isError) throw error;

    const updateSearchQuery = useDebouncedCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
            setPage(1);
        },
        400,
    );

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 0;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onChange={updateSearchQuery} />
                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
                <button className={css.button} onClick={openModal}>
                    Create note +
                </button>
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        <NoteForm onClose={closeModal} />
                    </Modal>
                )}
            </header>
            {data && data.notes.length === 0 && <NoNotes />}
            {notes.length > 0 && <NoteList notes={notes} />}
        </div>
    );
}