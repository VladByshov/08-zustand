"use client";

type Props = {
    error: Error;
    reset: ()=>void;
};

export default function Error({ error }: Props) {
    return <p>Could not open modal window {error.message}</p>;
}