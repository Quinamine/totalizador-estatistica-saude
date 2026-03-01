import { EdenSidebar } from "./components/EdenSidebar.js";
import { EdenReportEntry } from "./components/EdenReportEntry.js";

const EdenApp = {
    init() {
        EdenSidebar.init();
        EdenReportEntry.init();
    }
}

EdenApp.init();