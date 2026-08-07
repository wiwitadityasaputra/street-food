'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addToChart(formData: FormData) {
  console.log("dbg formData ", formData)
  revalidatePath('/dashboard/chart');
  redirect('/dashboard/chart');
}

export async function closeAddToCartModal() {
  redirect('/dashboard/menu');
}