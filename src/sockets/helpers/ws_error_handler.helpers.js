export function onSocketPreError(e) {
  console.error("Socket pre-upgrade error:", e.message);
}

export function onSocketPostError(e) {
  console.error("Socket post-upgrade error:", e.message);
}
