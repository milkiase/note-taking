export type Note = {
    id?: string;
    title: string;
    description?: string;
    comments?: {
        author: string;
        content: string;
        date: string;
    }[]
};

export type NoteTypes = "todo" | "inProgress" | "done";