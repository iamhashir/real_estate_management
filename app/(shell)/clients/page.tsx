"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SplitPane } from "@/components/layout/SplitPane";
import { EmptyState, Modal, useToast } from "@/components/ui";
import { ClientList } from "@/components/clients/ClientList";
import { ClientProfile } from "@/components/clients/ClientProfile";
import { ClientFormDrawer } from "@/components/forms/ClientFormDrawer";
import { useClient, useDeleteClient } from "@/hooks/useClients";
import type { Client } from "@/lib/types";
import { fullName } from "@/lib/utils";
import { shellNav } from "@/lib/shellNav";

export default function ClientsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteClient = useDeleteClient();
  const toast = useToast();

  useEffect(() => shellNav.client.register((id) => setSelectedId(id)), []);

  // Load the full client object when we need it for the edit drawer
  const selectedClient = useClient(selectedId) as Client | null | undefined;

  const handleDeleteConfirm = async () => {
    if (!selectedId || !selectedClient) return;
    setDeleteLoading(true);
    try {
      await deleteClient({ id: selectedId as never });
      toast.success(`${fullName(selectedClient.firstName, selectedClient.lastName)} removed`);
      setShowDelete(false);
      setSelectedId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete client");
    } finally {
      setDeleteLoading(false);
    }
  };

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
        detail={
          selectedId ? (
            <ClientProfile
              key={selectedId}
              clientId={selectedId}
              onEdit={() => selectedClient && setEditing(selectedClient)}
              onDelete={() => setShowDelete(true)}
            />
          ) : null
        }
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
      <ClientFormDrawer
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        initialData={editing ?? undefined}
      />
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title={selectedClient ? `Delete ${fullName(selectedClient.firstName, selectedClient.lastName)}?` : "Delete client?"}
        description="All deals linked to this client will lose this party. This cannot be undone."
        confirmLabel="Delete Client"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
      />
    </PageShell>
  );
}
