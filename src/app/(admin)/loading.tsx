import { Spinner } from "@/components/ui/spinner"

export default function AdminLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <Spinner className="size-8" />
    </div>
  )
}
