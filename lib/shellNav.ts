type Handler = (id: string) => void;

function createNavTarget() {
  let handler: Handler | null = null;
  let pending: string | null = null;

  return {
    fire(id: string) {
      if (handler) { handler(id); }
      else { pending = id; }
    },
    register(fn: Handler): () => void {
      handler = fn;
      if (pending !== null) { fn(pending); pending = null; }
      return () => { handler = null; };
    },
  };
}

export const shellNav = {
  client: createNavTarget(),
  deal:   createNavTarget(),
};
