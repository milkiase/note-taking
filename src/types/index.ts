export type Note = {
    id?: string;
    title: string;
    description?: string;
    comments?: {
        author: string;
        content: string;
        createdAt: string;
    }[],
    createdBy ?: string;
    updatedBy ?: string;
    createdAt ?: string;
    updatedAt ?: string;
};

export type NoteTypes = "todo" | "inProgress" | "done";