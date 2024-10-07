import { EditorSelection, Extension, StateEffect, StateField, Text, Transaction } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { SearchResultRange } from "../types";

const setMatchState = StateEffect.define<{
    selectedMatchIndex: number,
    ranges: SearchResultRange[],
}>();

const convertToCodeMirrorRange = (range: SearchResultRange, document: Text) => {
    const { Start, End } = range;
    const from = document.line(Start.LineNumber).from + Start.Column - 1;
    const to = document.line(End.LineNumber).from + End.Column - 1;
    return { from, to };
}


const matchHighlighter = StateField.define<DecorationSet>({
    create () {
        return Decoration.none;
    },
    update (highlights: DecorationSet, transaction: Transaction) {
        highlights = highlights.map(transaction.changes);

        for (const effect of transaction.effects) {
            if (effect.is(setMatchState)) {
                const { ranges, selectedMatchIndex } = effect.value;

                const decorations = ranges
                    .sort((a, b) => {
                        return a.Start.ByteOffset - b.Start.ByteOffset;
                    })
                    .map((range, index) => {
                        const { from, to } = convertToCodeMirrorRange(range, transaction.newDoc);
                        const mark = index === selectedMatchIndex ? selectedMatchMark : matchMark;
                        return mark.range(from, to);
                    });

                highlights = Decoration.set(decorations)
            }
        }

        return highlights;
    },
    provide: (field) => EditorView.decorations.from(field),
});

const matchMark = Decoration.mark({
    class: "cm-searchMatch"
});
const selectedMatchMark = Decoration.mark({
    class: "cm-searchMatch-selected"
});

export const highlightRanges = (selectedMatchIndex: number, ranges: SearchResultRange[], view: EditorView) => {
    const setState = setMatchState.of({
        selectedMatchIndex,
        ranges,
    });
    
    const effects = []
    effects.push(setState);

    if (selectedMatchIndex >= 0 && selectedMatchIndex < ranges.length) {
        const { from, to } = convertToCodeMirrorRange(ranges[selectedMatchIndex], view.state.doc);
        const selection = EditorSelection.range(from, to);
        effects.push(EditorView.scrollIntoView(selection, {
            y: "start",
        }));
    };

    view.dispatch({ effects });
}

export const searchResultHighlightExtension = (): Extension => {
    return [
        matchHighlighter,
    ]
}
