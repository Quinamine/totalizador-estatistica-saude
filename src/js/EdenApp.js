import { EdenSidebar } from "./components/EdenSidebar.js";
import { EdenReportEntry } from "./components/EdenReportEntry.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenReportEntry.init();
    }
}

EdenApp.init();


window.addEventListener('report-inject', () => {
    document.body.classList.add('has-eden-toolbar');
});

window.addEventListener('report-clear', () => {
    document.body.classList.remove('has-eden-toolbar');
})