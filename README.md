
# Vulnerable Node.js App

## Overview
This is an intentionally vulnerable Node.js application designed for training purposes in application security.

## Features
1. **SAST Vulnerabilities**: Includes insecure code patterns for static analysis.
2. **Hard-Coded Secrets**: Simulates bad practices with hard-coded credentials.
3. **Vulnerable Dependencies**: Includes known vulnerable versions of libraries.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Run the application:
   ```
   npm start
   ```

## Instructions
- Use static analysis tools (e.g., SonarQube, Semgrep) to identify vulnerabilities.
- Identify and replace hard-coded secrets using environment variables.
- Use tools like `npm audit` or `OWASP Dependency-Check` to detect vulnerable dependencies.

## License
MIT License.
