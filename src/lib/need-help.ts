type Listener = () => void;

let open = false;
let email = "";
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeNeedHelp(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getNeedHelpOpen() {
  return open;
}

export function getNeedHelpEmail() {
  return email;
}

export function setNeedHelpEmail(nextEmail: string) {
  email = nextEmail.trim();
  emit();
}

export function openNeedHelp(nextEmail?: string) {
  if (typeof nextEmail === "string") {
    email = nextEmail.trim();
  }
  open = true;
  emit();
}

export function setNeedHelpOpen(nextOpen: boolean) {
  open = nextOpen;
  emit();
}
