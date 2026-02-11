# Selenium Jest Test Automation Framework

A comprehensive Selenium WebDriver test automation framework built with TypeScript, Jest, and Page Object Model (POM) pattern for testing ParaBank Parasoft website user registration.

## 🚀 Features

- **TypeScript**: Strong typing and modern JavaScript features
- **Jest**: Popular testing framework with built-in assertions and test runners
- **Parallel Execution**: Tests run in parallel using Jest workers (~27% faster)
- **HTML Test Reports**: Beautiful HTML reports with jest-html-reporter
- **Accessibility Testing**: Automated WCAG compliance checking with axe-core
- **Axe HTML Reports**: Detailed accessibility violation reports
- **Selenium WebDriver**: Browser automation for E2E testing
- **Page Object Model**: Maintainable and reusable test architecture
- **Dynamic Test Data**: Custom test data generator for unique usernames
- **Docker Support**: Containerized test execution
- **GitHub Actions**: CI/CD integration
- **Multi-browser Support**: Chrome and Firefox browsers
- **Headless Mode**: Run tests in headless mode for CI/CD

## 📁 Project Structure

```
selenium-jest/
├── .github/
│   └── workflows/
│       └── test.yml          # GitHub Actions workflow
├── src/
│   ├── config/
│   │   └── test-config.ts    # Test configuration
│   ├── pages/
│   │   ├── base-page.ts      # Base page class with common methods
│   │   └── registration-page.ts  # Registration page object
│   └── utils/
│       ├── driver-manager.ts # WebDriver management (parallel-safe)
│       └── test-data-generator.ts  # Test data generation
├── tests/
│   ├── registration-success.test.ts     # Success scenarios (2 tests)
│   ├── registration-validation.test.ts  # Validation tests (3 tests)
│   ├── registration-navigation.test.ts  # Navigation tests (2 tests)
│   └── accessibility.test.ts            # Accessibility tests (2 tests)
├── Dockerfile                # Docker image configuration
├── docker-compose.yml        # Docker Compose configuration
├── jest.config.js            # Jest configuration (with parallel settings)
├── tsconfig.json             # TypeScript configuration
├── package.json              # Node.js dependencies
├── PARALLELIZATION.md        # Parallel execution documentation
└── README.md                 # This file
```

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Chrome or Firefox browser
- Docker (optional, for containerized testing)

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd selenium-jest
```

1. Install dependencies:

```bash
npm install
```

1. Build the TypeScript code:

```bash
npm run build
```

## 🧪 Running Tests

### Local Execution

Run tests in parallel mode (default):

```bash
npm test
```

Run tests and view HTML report:

```bash
npm run test:report         # Run tests and open report
npm run test:report:open    # Open latest report
```

Run tests with custom parallelization:

```bash
npm run test:parallel       # 4 workers
jest --maxWorkers=2         # 2 workers
```

Run tests sequentially:

```bash
npm run test:sequential
```

Run tests in headed mode (browser visible):

```bash
npm run test:headed
```

Run in watch mode:

```bash
npm run test:watch
```

Run specific test file:

```bash
npx jest tests/registration-success.test.ts
```

Run tests with specific browser:

```bash
BROWSER=chrome npm test
BROWSER=firefox npm test
```

> **Note:** Tests run in parallel by default using Jest workers. HTML reports are automatically generated in `./test-results/test-report.html`

### Docker Execution

Build and run tests in Docker:

```bash
docker build -t selenium-jest-tests .
docker run --rm selenium-jest-tests
```

Run tests with Docker Compose:

```bash
docker-compose up --abort-on-container-exit
```

 (split across 3 files for parallel execution):

### Successful Registration Scenarios (2 tests)

The test suite includes the following scenarios:

### Successful Registration Scenarios

- ✅ Register a new user with valid data
- ✅ Display success message after registration
- ✅ Register multiple unique users

### Validation Error Scenarios (3 tests)

- ❌ Show validation errors when all fields are empty
- ❌ Show error when username is missing
- ❌ Show error when passwords do not match

### Page Navigation Tests (2 tests)

- 🔍 Navigate to registration page successfully
- 🔍 Display all registration form fields

## 🎯 Test Data Generation

The framework uses `@faker-js/faker` to generate random test data for each test run, ensuring:

- Unique usernames for each registration
- Realistic test data (names, addresses, phone numbers)
- Repeatable test patterns with different data

## 🔧 Configuration

### Test Configuration (src/config/test-config.ts)

```typescript
export const config = {
  baseUrl: 'https://parabank.parasoft.com/parabank',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS !== 'false',
  timeout: 30000,
};
```

### Environment Variables

- `BROWSER`: Browser to use (chrome, firefox) - default: chrome
- `HEADLESS`: Run in headless mode (true, false) - default: true

## 🐳 Docker Configuration

The project includes:

- **Dockerfile**: Creates a containerized test environment with Chrome
- **docker-compose.yml**: Sets up Selenium Grid with hub and Chrome node

## 🔄 CI/CD Integration

GitHub Actions workflow automatically:

- Runs tests on push and pull requests
- Tests with multiple Node.js versions (18.x, 20.x)
- Runs tests in both standalone and Docker modes
- Uploads test results as artifacts

## 📊 Test Reports

### HTML Test Reports

Test results are automatically generated as HTML reports using `jest-html-reporter`.

**Report Location:** `./test-results/test-report.html`

**Features:**

- Beautiful, easy-to-read HTML format
- Test execution summary with pass/fail counts
- Detailed test results with timing information
- Console logs for each test
- Failure messages and stack traces
- Sortable by status, duration, or test name
- Execution time warnings for slow tests (>5s)
- Timestamp of test execution

**View Reports:**

```bash
# Run tests and automatically open report
npm run test:report

# Open the latest report
npm run test:report:open

# Or manually open: ./test-results/test-report.html
```

### Console Output

Test results are also displayed in the console with:

- Test suite names
- Individual test case results
- Execution time
- Pass/fail status

## ♿ Accessibility Testing

The framework includes automated accessibility testing using **axe-core** and **axe-html-reporter** to ensure web accessibility compliance.

**Features:**

- Automated WCAG 2.0/2.1 compliance checking
- Detailed HTML reports for accessibility violations
- Tests for critical and serious accessibility issues
- Coverage of registration and home pages

**Report Location:** `./test-results/accessibility/`

**Run Accessibility Tests:**

```bash
# Run accessibility tests only
npm run test:a11y

# Open accessibility reports folder
npm run test:a11y:open
```

**What Gets Tested:**

- Color contrast ratios
- ARIA attributes and roles
- Keyboard navigation
- Form labels and inputs
- Semantic HTML structure
- Screen reader compatibility

**Report Contents:**

Each HTML report includes:

- Total violations count with severity levels (critical, serious, moderate, minor)
- Detailed violation descriptions
- Affected HTML elements
- Remediation guidance
- WCAG success criteria references
- Screenshots of affected areas

**Severity Levels:**

- 🔴 **Critical**: Must be fixed (blocks assistive technology)
- 🟠 **Serious**: Should be fixed (significant barriers)
- 🟡 **Moderate**: Should be fixed (some barriers)
- 🟢 **Minor**: Good to fix (minor barriers)

> **Note:** Tests fail if critical or serious violations are found, ensuring baseline accessibility standards are maintained.

## 🏗️ Page Object Model Structure

### BasePage

- Common methods for all pages (click, type, wait, etc.)
- Reusable locator strategies
- WebDriver wait implementations

### RegistrationPage

- Registration-specific locators
- Methods for form interaction
- Validation error handling
- Success message verification

## 🔍 Best Practices

1. **Unique Test Data**: Each test generates unique data to avoid conflicts
2. **Wait Strategies**: Explicit waits for element visibility
3. **Error Handling**: Graceful error handling with try-catch blocks
4. **Clean Code**: TypeScript for type safety and better IDE support
5. **Isolation**: Tests can run independently
6. **Reusability**: POM pattern for maintainable code

## 🐛 Troubleshooting

### Common Issues

1. **ChromeDriver version mismatch**: Update chromedriver

   ```bash
   npm update chromedriver
   ```

2. **Timeout errors**: Increase timeout in test-config.ts

3. **Element not found**: Check locators in registration-page.ts

4. **Tests fail in headless mode**: Try running in headed mode first

   ```bash
   npm run test:headed
   ```

## 📚 Technologies Used

- **TypeScript**: 5.9.3
- **Selenium WebDriver**: 4.40.0
- **Jest**: 30.2.0
- **ts-jest**: 29.4.6
- **@faker-js/faker**: 10.3.0
- **chromedriver**: 145.0.1
- **Node.js**: 18.x / 20.x

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- ParaBank Parasoft for providing the test application
- Selenium WebDriver community
- Jest testing framework contributors
