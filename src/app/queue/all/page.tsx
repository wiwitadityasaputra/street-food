import { Suspense } from "react";

import { redirect } from "next/navigation";

import { QueueAllSkeleton } from "@/src/ui/queue/all/queue-all.skeleton";
import { QueueAllWrapper } from "@/src/ui/queue/all/queue-all.wrapper";

export default async function QueueAll(props: {
  searchParams?: Promise<{
    page?: number;
  }>;
}) {
    
    const searchParams = await props.searchParams;
    if (searchParams && searchParams.page) {
      const page = Number(searchParams.page);
      if (page > 0) {
        return (<>
            <Suspense fallback={<QueueAllSkeleton />}>
                <QueueAllWrapper page={page}/>
            </Suspense>
        </>);
      } else {
        redirect(`/queue/all?page=1`);
      }
    } else {
      redirect(`/queue/all?page=1`);
    }


}