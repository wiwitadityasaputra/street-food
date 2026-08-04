import { redirect } from 'next/navigation';

export default async function AppPage() {
    redirect('/dashboard'); 
    return (<>
        redirect...
    </>);
}