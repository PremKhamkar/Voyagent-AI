// The AI sometimes writes <br> tags inside markdown text,
// especially inside table cells. The markdown renderer shows
// them as literal text, so convert them into something that works.

export function cleanMarkdown(text) {
    if (!text || typeof text !== "string") {
        return "";
    }

    return text
        .split("\n")
        .map((line) => {
            const isTableRow = line.trimStart().startsWith("|");

            // A table cell can't contain a line break, so use a space.
            // Everywhere else, use a real markdown line break.
            return line.replace(
                /<br\s*\/?>/gi,
                isTableRow ? " " : "  \n"
            );
        })
        .join("\n");
}