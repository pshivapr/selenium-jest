module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
            },
        }],
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverage: false,
    coverageProvider: 'v8',
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/**/*.d.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts',
    ],
    coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    verbose: true,
    testTimeout: 60000,
    maxWorkers: '50%',
    maxConcurrency: 5,
    testResultsProcessor: './custom-results-processor.js',
    reporters: [
        'default',
        ['jest-html-reporter', {
            pageTitle: 'ParaBank Selenium Test Report',
            outputPath: './test-results/test-report.html',
            includeFailureMsg: true,
            includeConsoleLog: true,
            includeScreenshots: true,
            screenshotPath: './test-results/screenshots',
            theme: 'defaultTheme',
            logo: '',
            executionTimeWarningThreshold: 5,
            dateFormat: 'yyyy-mm-dd HH:MM:ss',
            sort: 'status',
            useCssFile: false,
        }]
    ],
};
