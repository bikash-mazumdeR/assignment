# Playwright Automation Framework

![Playwright Tests](https://github.com/bikash-mazumdeR/assignment/actions/workflows/playwright-ci.yml/badge.svg)

This is a test automation framework for Web UI and API testing, built with Playwright, TypeScript, and Node.js.

## 🚀 Key Features

- **Unified Framework:** Handles both Web UI (`SauceDemo`) and API (`Restful-Booker`) testing.
- **Clean Architecture:** Implements Page Object Model (POM), Base Abstractions, and Service Layers.
- **Fixture-Based DI:** Uses Playwright Fixtures for clean dependency injection and state management.
- **Strict Typing:** Full TypeScript implementation with Zod schema validation for API contracts.
- **Parallel Execution:** Configured for high-speed parallel execution in CI/CD.
- **Enterprise Logging:** Structured logging with Winston (Console + File).
- **Consolidated Allure Reporting:** Integrated Allure reports with cross-job result aggregation and GitHub Pages hosting.
- **CI/CD Ready:** Complete GitHub Actions workflow with automatic report deployment.

## 📁 Project Structure

```text
├── .github/workflows/       # CI/CD Pipeline (GitHub Actions)
├── config/                  # Environment and Global Constants
├── src/
│   ├── core/                # BasePage, RequestWrapper, Logger, RedactionHelper
│   ├── pages/               # UI Page Objects (SauceDemo)
│   ├── api/                 # API Clients and Request Builders (Restful-Booker)
│   ├── schemas/             # Zod Validation Schemas
│   ├── fixtures/            # Custom Playwright Fixtures
│   └── constants/           # Centralized Selectors
├── tests/
│   ├── ui/                  # Web UI Spec Files
│   ├── api/                 # API Spec Files
│   └── setup/               # Global Authentication Setup
├── playwright.config.ts      # Framework Configuration
└── README.md                # Documentation
```

## 🛠️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bikash-mazumdeR/assignment.git
   cd assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install --with-deps
   ```

4. **Environment Configuration:**
   Create `.env.qa` in `config/env/` using the structure from `.env.example`.

## 🏃 Execution Commands

- **Run all tests:** `npm test`
- **Run UI tests only:** `npm run test:ui`
- **Run API tests only:** `npm run test:api`
- **Run Smoke tests:** `npm run test:smoke`
- **Local Allure Generation:**
  ```bash
  npx allure generate allure-results --clean -o allure-report
  npx allure open allure-report
  ```

## 🏗️ Architecture Decisions

### 1. Fixtures over Hooks
We avoid `beforeEach` for object instantiation. Instead, we use fixtures (e.g., `bookingClient`, `loginPage`) to lazily initialize dependencies.

### 2. Base Abstractions
`BasePage` and `RequestWrapper` provide a centralized layer for logging and smart waits.

### 3. Zod Schema Validation
API tests validate the entire response body against Zod schemas (e.g., `BookingSchema`, `BookingIdSchema`). This provides "Contract Testing" capabilities.

## 🔄 CI/CD Pipeline & Reporting

### Triggering Builds
- **Push:** Automatically triggers on every push to `main`.
- **Pull Request:** Automatically triggers when a PR is opened or updated targeting `main`.
- **Manual:** Can be triggered via the "Run workflow" button in the GitHub Actions tab.

### Accessing Reports
1. **Consolidated Allure Report:** After every successful run, the report is deployed to [GitHub Pages](https://bikash-mazumdeR.github.io/assignment/).
   - The root URL automatically redirects to the latest execution results.
   - History is maintained for the last 20 runs.
2. **Playwright Artifacts:** Raw HTML reports and failure traces/screenshots are available as artifacts in the GitHub Action run summary for 30 days.

## 🧪 API Test Strategy

### Approach
Our API testing (targeting `https://restful-booker.herokuapp.com`) follows a **layered validation** approach:

1. **Status Code Validation** (e.g., `200 OK` for creation, `403 Forbidden` for unauthorized delete)
2. **Schema Validation** using Zod (validating field types like `firstname: string`, `totalprice: number`)
3. **Data Integrity** (verifying that the `BookingBuilder` payload matches the created record)

### E2E Flow (Actual Implementation)
`tests/api/e2e-booking-flow.spec.ts`:
1. **Create Booking** (`POST /booking`)
2. **Verify Record** (`GET /booking/:id`)
3. **Update Record** (`PUT /booking/:id`)
4. **Delete Record** (`DELETE /booking/:id`)
5. **Verify Deletion** (`GET /booking/:id` -> `404 Not Found`)

## 🖥️ UI Test Strategy

### Approach
Our UI testing (targeting `https://www.saucedemo.com/`) focuses on user journey reliability across different platforms:

1. **Page Object Model (POM):** Every page (Login, Inventory, Cart, Checkout) is modeled as a class in `src/pages/`, encapsulating selectors and interactions.
2. **Global Authentication:** We use a `setup` project (`tests/setup/auth.setup.ts`) to login once and save the storage state. All subsequent tests reuse this state to save time and reduce flake.
3. **Cross-Browser Matrix:** Tests are executed in parallel across **Chromium**, **Firefox**, and **Webkit** (Safari) to ensure cross-platform compatibility.
4. **Resilient Selectors:** Prioritizing user-facing attributes (e.g., `data-test`) over fragile CSS/XPath.

### Coverage Matrix
| Feature | Project | Key Actions Validated |
|---|---|---|
| **Login** | `tests/ui/login.spec.ts` | Valid login, Error handling for locked-out users |
| **Catalog** | `tests/ui/catalog.spec.ts` | Product sorting, Adding items to cart, Badge updates |
| **Cart** | `tests/ui/cart.spec.ts` | Item persistence, Removal from cart, Navigation |
| **Checkout** | `tests/ui/checkout.spec.ts` | Multi-step form validation, Order completion |
| **E2E Journey**| `tests/ui/e2e-flow.spec.ts`| Full flow from login to order confirmation |

## 📖 Team Onboarding

For a deep dive into writing tests, adding new page objects, and understanding our coding conventions, please refer to the [Team Onboarding Guide](ONBOARDING.md).
