import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="cursor-pointer px-1 underline hover:animate-pulse hover:text-black">
          Privacy Policy
        </p>
      </DialogTrigger>
      <DialogContent className="w-[70vw] overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
          <div className="prose max-w-none">
            <h1 className="items-center text-2xl font-semibold">TBA</h1>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
