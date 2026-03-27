"use client";

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
import { noteTags, type NoteTag } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import * as Yup from "yup";
import { useId } from "react";

interface NoteFormValues {
    title: string;
    content: string;
    tag: NoteTag;
}

const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
};

interface NoteFormProps {
    onClose: () => void;
}

const schema = Yup.object({
    title: Yup.string()
        .min(3, "Min 3 characters")
        .max(50, "Max 50 characters")
        .required("Title is required"),
    content: Yup.string().max(500, "Max 500 characters"),
    tag: Yup.mixed<NoteTag>()
        .oneOf(noteTags, "Invalid tag")
        .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();
    const id = useId();

    const { mutate, isPending } = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
    });

    const handleSubmit = (
        values: NoteFormValues,
        actions: FormikHelpers<NoteFormValues>
    ) => {
        mutate(values, {
            onSuccess: () => {
                actions.resetForm();
            },
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={schema}
        >
            {({ isSubmitting }) => (
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor={`${id}-title`}>Title</label>
                        <Field
                            id={`${id}-title`}
                            type="text"
                            name="title"
                            className={css.input}
                        />
                        <ErrorMessage
                            name="title"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor={`${id}-content`}>Content</label>
                        <Field
                            as="textarea"
                            id={`${id}-content`}
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage
                            name="content"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor={`${id}-tag`}>Tag</label>
                        <Field
                            as="select"
                            id={`${id}-tag`}
                            name="tag"
                            className={css.select}
                        >
                            {noteTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage
                            name="tag"
                            component="span"
                            className={css.error}
                        />
                    </div>

                    <div className={css.actions}>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={onClose}
                            disabled={isSubmitting || isPending}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={isSubmitting || isPending}
                        >
                            {isPending ? "Creating..." : "Create notes"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}