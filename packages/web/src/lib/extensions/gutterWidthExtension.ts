import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view"

/**
 * Measures the width of the gutter and stores it in the plugin instance.
 */
export const gutterWidthExtension = ViewPlugin.fromClass(class {
    width: number = 0;

    constructor (view: EditorView) {
        this.measureWidth(view);
    }

    update = (update: ViewUpdate) => {
        if (update.geometryChanged) {
            this.measureWidth(update.view);
        }
    }
    
    measureWidth = (view: EditorView) => {
        const gutter = view.scrollDOM.querySelector('.cm-gutters') as HTMLElement;
        if (gutter) { 
            this.width = gutter.offsetWidth;
        }
    }
});
