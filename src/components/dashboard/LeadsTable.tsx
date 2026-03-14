import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDate } from "@/lib/utils";
import type { Lead } from "@/lib/supabase/database.types";

import DashboardEmptyState from "./DashboardEmptyState";
import LeadRowActions from "./LeadRowActions";
import LeadStatusMenu from "@/components/forms/LeadStatusMenu";

interface LeadsTableProps {
  leads: Lead[];
  disabledReason?: string;
}


export default function LeadsTable({ leads, disabledReason }: LeadsTableProps) {
  if (!leads.length) {
    return (
      <DashboardEmptyState
        title="Todavia no hay leads"
        description="Cuando alguien complete el formulario publico, aparecera aqui con su estado y fecha de entrada."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => {

          return (
            <TableRow key={lead.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="mt-1 max-w-xl truncate text-sm text-zinc-400" title={lead.message}>
                    {lead.message}
                  </p>
                </div>
              </TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.company || "Sin empresa"}</TableCell>
              <TableCell>
                <LeadStatusMenu
                  leadId={lead.id}
                  currentStatus={lead.status}
                  disabledReason={disabledReason}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={lead.notification_sent_at ? "success" : "warning"}>
                      {lead.notification_sent_at ? "Aviso interno" : "Aviso pendiente"}
                    </Badge>
                    <Badge variant={lead.autoresponder_sent_at ? "success" : "warning"}>
                      {lead.autoresponder_sent_at ? "Autorespuesta" : "Autorespuesta pendiente"}
                    </Badge>
                    <Badge variant="muted">{lead.locale.toUpperCase()}</Badge>
                  </div>
                  {lead.email_last_error ? (
                    <p className="max-w-xs text-xs text-red-300" title={lead.email_last_error}>
                      {lead.email_last_error}
                    </p>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>{formatShortDate(lead.created_at)}</TableCell>
              <TableCell className="text-right">
                <LeadRowActions lead={lead} disabledReason={disabledReason} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
