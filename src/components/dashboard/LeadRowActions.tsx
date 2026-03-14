"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { resendLeadEmails } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { shouldAllowLeadEmailRetry } from "@/lib/email-automation";
import type { Lead } from "@/lib/supabase/database.types";

interface LeadRowActionsProps {
  lead: Lead;
  disabledReason?: string;
}

export default function LeadRowActions({ lead, disabledReason }: LeadRowActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(async () => {
      try {
        setFeedback(null);
        await resendLeadEmails(lead.id);
        setFeedback("Automatizacion de email relanzada.");
      } catch (error) {
        setFeedback(
          error instanceof Error ? error.message : "No se pudo relanzar el email del lead.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex justify-end gap-2">
        {shouldAllowLeadEmailRetry(lead) ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending || Boolean(disabledReason)}
            title={disabledReason}
            onClick={handleRetry}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Reenviar email
          </Button>
        ) : null}
      </div>
      {feedback ? <p className="max-w-xs text-right text-xs text-zinc-400">{feedback}</p> : null}
    </div>
  );
}
