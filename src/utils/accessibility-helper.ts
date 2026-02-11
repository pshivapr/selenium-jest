import { WebDriver } from 'selenium-webdriver';
import AxeBuilder from '@axe-core/webdriverjs';
import { createHtmlReport } from 'axe-html-reporter';
import * as fs from 'fs';

export interface AccessibilityTestResult {
    violations: any[];
    passes: any[];
    incomplete: any[];
    criticalViolations: any[];
    reportPath: string;
}

export class AccessibilityHelper {
    private static reportsDir = 'test-results/accessibility';

    static ensureReportsDirectory(): void {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    static async runAccessibilityScan(
        driver: WebDriver,
        reportFileName: string
    ): Promise<AccessibilityTestResult> {
        this.ensureReportsDirectory();

        const results = await new AxeBuilder(driver).analyze();


        const reportPath = `${this.reportsDir}/${reportFileName}`;
        createHtmlReport({
            results,
            options: {
                outputDir: this.reportsDir,
                reportFileName: reportFileName,
            },
        });

        console.log(`\nAccessibility report generated: ${reportPath}`);
        console.log(`Violations found: ${results.violations.length}`);
        console.log(`Passes: ${results.passes.length}`);
        console.log(`Incomplete: ${results.incomplete.length}`);

        if (results.violations.length > 0) {
            this.logViolations(results.violations);
        }

        const criticalViolations = results.violations.filter(
            v => v.impact === 'critical' || v.impact === 'serious'
        );

        return {
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete,
            criticalViolations,
            reportPath,
        };
    }

    private static logViolations(violations: any[]): void {
        console.log('\nAccessibility Violations:');
        violations.forEach((violation, index) => {
            console.log(`\n${index + 1}. ${violation.id} (${violation.impact})`);
            console.log(`   Description: ${violation.description}`);
            console.log(`   Help: ${violation.help}`);
            console.log(`   Affected elements: ${violation.nodes.length}`);
        });
    }

    static assertNoCriticalViolations(result: AccessibilityTestResult): void {
        if (result.criticalViolations.length > 0) {
            const summary = result.criticalViolations
                .map(v => `${v.id} (${v.impact})`)
                .join(', ');
            throw new Error(
                `Found ${result.criticalViolations.length} critical/serious accessibility violations: ${summary}`
            );
        }
    }

    static getReportsDirectory(): string {
        return this.reportsDir;
    }
}
