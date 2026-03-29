import { type CreateNote, noteTags} from "@/types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NoteDraft {
    draft: CreateNote;
    updateDraft: (newNoteData: CreateNote) => void;
    clearDraft: () => void;
}

const initialNoteData: CreateNote = {
    title: "",
    content: "",
    tag: noteTags[1],
};

export const useNoteDraft = create<NoteDraft>()(
    persist(
        (set) => {
            return {
                draft: initialNoteData,
                updateDraft: (newNoteData) => {
                    set({
                        draft: newNoteData,
                    });
                },
                clearDraft: () => {
                    set({
                        draft: initialNoteData,
                    });
                },
            };
        },
        {
            name: "NoteDraft",
            partialize: (state) => ({ noteData: state.draft }),
        },
    ),
);