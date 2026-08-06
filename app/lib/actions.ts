'use server';import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addToChart(formData: FormData) {
    console.log("dbg formData ", formData)

  revalidatePath('/dashboard/checkout');
  redirect('/dashboard/checkout');
}