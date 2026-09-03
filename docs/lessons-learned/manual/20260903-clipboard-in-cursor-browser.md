# Clipboard writes cannot be verified in the Cursor browser tab

- The automated tab reports `document.hasFocus() === false`, so `navigator.clipboard.writeText` rejects with `NotAllowedError` and `document.execCommand("copy")` returns `false`. Both failures are environmental, not code defects — a copy button that looks broken there can still work for a user.
- To verify a copy interaction, stub the API in the page (`Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (t) => { captured = t } } })`) via CDP `Runtime.evaluate`, click the button, and assert on the captured string plus the resulting icon/label state.
- `navigator.clipboard.readText()` is blocked for the same focus reason, so never use clipboard read-back as the assertion.
