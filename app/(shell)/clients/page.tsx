"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SplitPane } from "@/components/layout/SplitPane";
import { EmptyState } from "@/components/ui";
import { ClientList } from "@/components/clients/ClientList";
import { ClientProfile } from "@/components/clients/ClientProfile";
import { ClientFormDrawer } from "@/components/forms/ClientFormDrawer";

export default function ClientsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <PageShell bleed>
      <SplitPane
        hasSelection={!!selectedId}
        onBack={() => setSelectedId(null)}
        list={
          <ClientList
            selectedId={selectedId}
            onSelect={setSelectedId}
            onCreate={() => setAdding(true)}
          />
        }
        detail={selectedId ? <ClientProfile key={selectedId} clientId={selectedId} /> : null}
        placeholder={
          <div className="h-full grid place-items-center">
            <EmptyState
              icon={<Users size={22} />}
              title="Select a client"
              description="Choose someone from the list to see their profile, deals, and activity."
            />
          </div>
        }
      />

      <ClientFormDrawer
        isOpen={adding}
        onClose={() => setAdding(false)}
        onCreated={(id) => setSelectedId(id)}
      />
    </PageShell>
  );
}
