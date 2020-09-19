import markdownIt from "markdown-it";
import hljs from "highlight.js";

export class AnkiNote {

    static md = markdownIt({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
                } catch (e) {
                    console.error(e);
                }
            }

            return '<pre class="hljs"><code>' + AnkiNote.md.utils.escapeHtml(str) + '</code></pre>';
        }
    });

    front;
    back;

    frontRaw;
    backRaw;

    canBeAdded = true;

    constructor(frontRaw, backRaw) {
        this.frontRaw = frontRaw;
        this.backRaw = backRaw;
        this.front = AnkiNote.md.render(frontRaw);
        this.back = AnkiNote.md.render(backRaw);
    }
}
