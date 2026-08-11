import { Suspense } from "react";
import { redirect } from "next/navigation";

import { QueueAllSkeleton } from "@/src/ui/queue/all/queue-all.skeleton";
import { QueueAllWrapper } from "@/src/ui/queue/all/queue-all.wrapper";
import { ALLOWED_SIZE } from "@/src/ui/queue/queue-menu/queue-menu.definition";

export default async function QueueAll(props: {
  searchParams?: Promise<{
    page?: number;
    size?: number;
  }>;
}) {

  let validPage = false;
  let validSize = false;
  const searchParams = await props.searchParams;

  if (searchParams && searchParams.page) {
    const page = Number(searchParams.page);
    if (page > 0) {
      validPage = true;
    } else {
      redirect(`/queue/all?page=1&size=5`);
    }
  } else {
    redirect(`/queue/all?page=1&size=5`);
  }

  if (searchParams && searchParams.size) {
    const size = Number(searchParams.size);
    validSize = ALLOWED_SIZE.includes(size);
  }

  if (validPage && validSize) {
    return (<>
        <Suspense fallback={<QueueAllSkeleton />}>
            <QueueAllWrapper
              page={Number(searchParams.page)}
              size={Number(searchParams.size)}/>
        </Suspense>
    </>);
  } else {
    redirect(`/queue/all?page=1&size=5`);
  }
}