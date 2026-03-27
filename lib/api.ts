import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const API_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const ENDPOINT = "/notes";

const apiClient = axios.create({
    baseURL: "https://notehub-public.goit.study/api",
    headers: {
        Authorization: `Bearer ${API_KEY}`,
    },
});

interface FetchNotesParams {
    search?: string;
    tag?: NoteTag;
    page?: number;
    perPage?: number;
    sortBy?: string;
}

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

interface CreateNoteBody {
    title: string;
    content: string;
    tag: NoteTag;
}

export async function fetchNotes(
    params: FetchNotesParams,
): Promise<FetchNotesResponse> {
    const {data} = await apiClient.get<FetchNotesResponse>(ENDPOINT, {
        params,
    });
    return data;
}

export async function createNote(body: CreateNoteBody): Promise<Note> {
    const {data} = await apiClient.post<Note>(ENDPOINT, body);
    return data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
    const {data} = await apiClient.delete<Note>(`${ENDPOINT}/${id}`);
    return data;
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
    const {data} = await apiClient.get<Note>(`${ENDPOINT}/${id}`);
    return data;
}