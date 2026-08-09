import { redirect } from 'next/navigation';

import "@/app/queue/queue.css";

export default function Queue() {
    redirect(`/queue/me`);
}