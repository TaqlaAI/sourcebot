import { Compartment } from "@codemirror/state";
import { lineNumbers } from "@codemirror/view";

const gutter = new Compartment();

/**
 * Offsets the line numbers by the given amount
 * @see: https://discuss.codemirror.net/t/codemirror-6-offset-line-numbers/2675/8
 */
export const lineOffsetExtension = (lineOffset: number) => {
    const lines = lineNumbers({
        formatNumber: (n) => {
            return (n + lineOffset).toString();
        }
    });

    return [
        gutter.of(lines)
    ]
}