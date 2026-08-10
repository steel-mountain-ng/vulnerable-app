# Vulnerable Node.js App

## Overview
This is an intentionally vulnerable Node.js application designed for training purposes in application security. It contains various OWASP Top 10 vulnerabilities and common security anti-patterns that can be discovered using SAST (Static Application Security Testing) tools.

## Security Vulnerabilities
This application includes the following intentional security issues:

1. **Injection Flaws**
   - SQL Injection (CWE-89)
   - Command Injection (CWE-78)
   - Path Traversal (CWE-22)

2. **Authentication & Session Issues**
   - Weak Session Configuration
   - Missing Rate Limiting (CWE-307)
   - Insecure Direct Object References (IDOR) (CWE-639)

3. **Cryptographic Issues**
   - Weak Cryptography Implementation (CWE-326)
   - Hardcoded Encryption Keys (CWE-321)
   - Weak Password Hashing (CWE-916)
   - Insecure Random Number Generation (CWE-338)

4. **Data Exposure**
   - Information Exposure through Error Messages (CWE-200)
   - Hardcoded Credentials (CWE-798)
   - Cross-Site Scripting (XSS) (CWE-79)

5. **Other Vulnerabilities**
   - XML External Entity Processing (XXE) (CWE-611)
   - Insecure Deserialization (CWE-502)
   - Open Redirect (CWE-601)

6. **Container Security Issues**
   - Outdated base image (node:14.0.0)
   - Vulnerable system packages
   - Running as root
   - Excessive directory permissions
   - Unnecessary installed packages

## Security Scanning Setup
Security CI is provided by reusable workflows in
[`steel-mountain-ng/security-workflows`](https://github.com/steel-mountain-ng/security-workflows)
via [`.github/workflows/security.yml`](.github/workflows/security.yml):

1. **SAST** — CodeQL (`security-and-quality`, JavaScript) — no Semgrep token required
2. **SCA** — Trivy filesystem scan (fails on CRITICAL/HIGH)
3. **IaC** — Trivy config scan for Dockerfile / misconfigurations (fails on CRITICAL/HIGH)
4. **Secrets** — Trivy secret scan (fails on findings)
5. **Container image** — local Docker build + Trivy image scan (fails on CRITICAL/HIGH)
6. **Supply chain** — [RoguePkg](https://github.com/radioactivetobi/roguepkg) malware detection

The orchestrator ends with a **Security Gate** job. This app is intentionally vulnerable, so the gate is expected to fail — that is the demo.

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

## Training Instructions

### 1. Running Security Scans
- Trigger GitHub Actions workflows manually or through PRs
- Review scan results in:
  - GitHub Actions logs
  - PR comments
  - Security tab
  - Downloaded artifacts (for detailed reports)

### 2. Vulnerability Analysis
- Identify security issues using provided tools
- Cross-reference findings with OWASP Top 10
- Review CWE (Common Weakness Enumeration) references

### 3. Remediation Practice
- Create fixes for identified vulnerabilities
- Submit PRs with security improvements
- Review how security tools validate fixes

### 4. Running Security Scans
- For container scanning:
  ```bash
  # Build the container
  docker build -t vulnerable-nodejs-app .
  
  # Run Trivy scan locally
  trivy image vulnerable-nodejs-app
  ```

## Container Security Issues
The Dockerfile includes several intentional security anti-patterns:
1. Using an outdated base image with known vulnerabilities
2. Installing unnecessary packages
3. Running the container as root
4. Setting excessive directory permissions (777)
5. Including vulnerable system packages

## Best Practices Demonstrated
- Automated security scanning in CI/CD
- Multiple security tool integration
- Security feedback in development workflow
- Vulnerability management process

## Warning
This application contains intentional security vulnerabilities. Do not deploy in a production environment or expose to the internet.

## License
MIT License
