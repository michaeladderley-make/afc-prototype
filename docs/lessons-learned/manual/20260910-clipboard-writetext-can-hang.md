# Clipboard writeText can hang instead of rejecting

- In the Cursor browser tab, `navigator.clipboard.writeText` may never resolve (permission pending) rather than reject. Awaiting it before UI feedback leaves Copy buttons stuck on the idle label.
- Flash Copied or Download started first, then run the clipboard or download work without blocking the label change.
