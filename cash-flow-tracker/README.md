# Cash-Flow: Core Engineering & Logic Module

An enterprise-grade, framework-free financial dashboard built to demonstrate mastery over synchronous state management, DOM manipulation, browser data persistence, and third-party API integration using pure **Vanilla JavaScript**.

---

## Architectural Overview

The **Cash-Flow** module is built entirely using a single-state reactive architecture. Frameworks like React were intentionally stripped away to utilize manual DOM reconciliation, strict input data-type sanitization, and isolated application memory footprints.
##  Features & Engineering Phases

### Phase 1: Base MVP (Mandatory - P0)
* **Deterministic Forms:** Captures `Total Salary Base` updates and `Expense Log Entries` using strict numerical constraints.
* **Primitive Typecasting:** Prevents native DOM string concatenation failures by wrapping calculation vectors securely inside explicit arithmetic operators.
* **Automated Mathematical Balance Engine:** Real-time rendering of:
  $$\text{Net Balance} = \text{Total Salary} - \sum(\text{Logged Expenses})$$

### Phase 2: Data Persistence & Graphics (Priority 1)
* **State Serialization:** Automatically stringifies and hydra-saves active data structures down into the browser's `localStorage` on mutation events.
* **State Hydration:** Safely reads, parses, and error-recovers the structural local memory scope during the `DOMContentLoaded` lifecycle hook.
* **Canvas Remodeling Pipeline:** Integrates dynamic data charting using Chart.js CDNs. Employs explicit object lifecycle management by executing an intentional `.destroy()` protocol on stale canvas instances prior to drawing to mitigate memory leak behaviors.
* **Ledger Purge Operations:** Complete transaction removals by matching specific item `UUID` patterns, executing array filters, and flushing updates downstream to variables and view states instantly.

### Phase 3: Advanced Stretch Engineering (Priority 2)
* **Asynchronous Exchange Gateways:** Features live currency state switching (INR to USD) via real-time network requests utilizing async/await `fetch()` handshakes directly to the keyless Frankfurter API.
* **Structural Safety Failovers:** Includes a local backup fallback exchange mechanism to ensure calculation resilience if the client environment loses internet connection or runs into cross-origin (CORS) network timeouts.
* **System Threshold Warning Arrays:** Actively monitors capital ratios. If the remaining balance drops past a strict **10% threshold** of the established salary base, the core engine triggers an immediate visual override—injecting layout warnings and modifying CSS classes dynamically.
* **Structured PDF Exporting:** Utilizes UMD `jsPDF` library injections to compile balance cards and operational transaction sheets into clean, downloadable business document layouts.