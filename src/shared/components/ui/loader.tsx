import { Loader2 } from 'lucide-react'

interface LoaderProps {
  text?: string
}

export function Loader({ text }: LoaderProps) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        {text && <p className="mt-4 text-lg font-medium text-slate-700">{text}</p>}
      </div>
    </div>
  )
}