"use client"

import * as React from "react"
import { ArrowUpIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { assistantSuggestions, mockAssistantReply } from "@/lib/mock-data"

type Message = { id: number; role: "user" | "assistant"; text: string }

const greeting: Message = {
  id: 0,
  role: "assistant",
  text: "Hi! Ask me about revenue, customers or retention on this dashboard.",
}

function useMockAssistant() {
  const [messages, setMessages] = React.useState<Message[]>([greeting])
  const [pending, setPending] = React.useState(false)
  const nextId = React.useRef(1)

  const send = React.useCallback(
    (text: string) => {
      const prompt = text.trim()
      if (!prompt || pending) return
      setMessages((m) => [
        ...m,
        { id: nextId.current++, role: "user", text: prompt },
      ])
      setPending(true)
      // Simulated latency; swap for a real model call later.
      window.setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            id: nextId.current++,
            role: "assistant",
            text: mockAssistantReply(prompt),
          },
        ])
        setPending(false)
      }, 700)
    },
    [pending],
  )

  return { messages, pending, send }
}

function AssistantChat({ className }: { className?: string }) {
  const { messages, pending, send } = useMockAssistant()
  const [draft, setDraft] = React.useState("")
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages, pending])

  function submit(event?: React.FormEvent) {
    event?.preventDefault()
    send(draft)
    setDraft("")
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 pr-3" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                message.role === "user"
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start bg-muted",
              )}
            >
              {message.text}
            </div>
          ))}
          {pending && (
            <div className="self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <div className="flex flex-wrap gap-2">
        {assistantSuggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="xs"
            disabled={pending}
            onClick={() => send(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      <form onSubmit={submit} className="relative">
        <label htmlFor="assistant-input" className="sr-only">
          Ask the assistant
        </label>
        <Textarea
          id="assistant-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) submit(e)
          }}
          placeholder="Ask about your metrics…"
          className="min-h-20 resize-none pr-12"
        />
        <Button
          type="submit"
          size="icon-sm"
          className="absolute right-2 bottom-2"
          disabled={pending || !draft.trim()}
          aria-label="Send"
        >
          <ArrowUpIcon />
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Demo assistant · replies use mock data.
      </p>
    </div>
  )
}

/** Docked side panel, shown on wide screens. */
export function AssistantPanel() {
  return (
    <Card className="sticky top-4 flex h-[calc(100svh-6rem)] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" />
          AI assistant
        </CardTitle>
        <CardDescription>Ask questions about this dashboard</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        <AssistantChat />
      </CardContent>
    </Card>
  )
}

/** Slide-over version of the panel for narrower screens. */
export function AssistantSheetTrigger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="xl:hidden">
          <SparklesIcon data-icon="inline-start" />
          Ask AI
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SparklesIcon className="size-4" />
            AI assistant
          </SheetTitle>
          <SheetDescription>Ask questions about this dashboard</SheetDescription>
        </SheetHeader>
        <AssistantChat className="px-4 pb-4" />
      </SheetContent>
    </Sheet>
  )
}
