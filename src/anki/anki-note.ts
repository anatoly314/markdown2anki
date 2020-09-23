import * as markdownIt from "markdown-it";
import * as hljs from "highlight.js";
import * as fs from "fs";
import * as path from "path";


export class AnkiNote {

    static md;
    static getMarkdownParser () {
        if (!AnkiNote.md) {
            AnkiNote.md = markdownIt({
                html: true,
                highlight: function (str, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            const highlighted = `<pre class="hljs"><code> ${hljs.highlight(lang, str, true).value} </code></pre>`;
                            return highlighted;
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    return '<pre class="hljs"><code>' + AnkiNote.md.utils.escapeHtml(str) + '</code></pre>';
                }
            });

            AnkiNote.md.renderer.rules.code_inline =  function (tokens, idx, options, env, slf) {
                const token = tokens[idx];
                const inline = `<code class="inline-code">${AnkiNote.md.utils.escapeHtml(token.content)}</code>`;
                return inline;
            };

            AnkiNote.md.renderer.rules.image = function (tokens, idx, options, env, self) {
                const token = tokens[idx];
                // const src = token.attrGet('src');
                // const file = fs.readFileSync(path.resolve(__dirname, src));
                // console.log("image");
                //
                // // pass token to default renderer.
                return "image here";
            };
        }

        return AnkiNote.md;
    }


    front;
    back;

    frontRaw;
    backRaw;

    constructor(frontRaw, backRaw) {
        this.frontRaw = frontRaw;
        this.backRaw = backRaw;

        this.front = AnkiNote.getMarkdownParser().render(frontRaw);
        this.back = AnkiNote.getMarkdownParser().render(backRaw);
    }
}
