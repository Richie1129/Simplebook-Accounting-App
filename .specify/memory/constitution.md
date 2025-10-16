<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- This is the initial constitution establishment for 個人記帳本WebApp (Personal Accounting Web App)
- Added principles:
  * Code Quality (Modern JavaScript/TypeScript Best Practices)
  * Testing Standards (Unit Testing for Critical Features)
  * User Experience (Responsive Design)
  * Performance Requirements (Fast Loading & Offline Support)
  * Data Security (Local Storage & Privacy Protection)
  * Accessibility (Keyboard & ARIA Support)
- Added sections:
  * Development Standards
  * Quality Gates
  * Governance
- Templates requiring updates: ✅ No updates required (templates are generic and compatible)
- Follow-up TODOs: None
-->

# 個人記帳本WebApp Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

**Modern JavaScript/TypeScript Best Practices**

All code MUST adhere to the following standards:
- Use modern ES6+ features (arrow functions, destructuring, async/await, modules)
- TypeScript MUST be used for type safety where applicable
- Variable names MUST be clear and descriptive (use camelCase for variables/functions, PascalCase for classes/components)
- Functions MUST remain concise (target: <50 lines, exception: complex business logic requiring justification)
- Avoid code duplication - extract reusable logic into utility functions or shared modules
- Use meaningful comments for complex logic, but prefer self-documenting code

**Rationale**: Modern best practices ensure maintainability, reduce bugs, and make onboarding new developers easier. Clear naming and concise functions improve code readability and reduce cognitive load.

### II. Testing Standards

**Unit Testing for Critical Features**

Testing requirements:
- Critical features MUST have unit tests (financial calculations, data transformations, core business logic)
- Data calculation accuracy MUST be verified with test cases covering edge cases
- Test coverage target: minimum 80% for calculation and business logic modules
- Tests MUST be written before or alongside implementation (Test-Driven Development encouraged)
- Each test MUST be independent and repeatable
- Use descriptive test names that explain the scenario being tested

**Rationale**: Financial applications require high accuracy. Unit tests prevent regressions and ensure calculation correctness, building user trust in the application.

### III. User Experience

**Responsive Design & Intuitive Operations**

User experience requirements:
- Application MUST support responsive design for mobile phones, tablets, and desktop screens
- Minimum supported screen widths: 320px (mobile), 768px (tablet), 1024px (desktop)
- Touch targets MUST be minimum 44×44px for mobile usability
- Navigation MUST be intuitive - users should complete primary tasks without documentation
- Visual feedback MUST be provided for all user actions (loading states, success/error messages)
- Forms MUST have clear labels and validation with helpful error messages
- Loading states MUST be shown during data operations

**Rationale**: A personal accounting app must be accessible on all devices users carry. Intuitive design reduces friction and encourages consistent usage habits.

### IV. Performance Requirements

**Fast Loading & Offline Support**

Performance standards:
- Initial page load time MUST be under 2 seconds on 4G connection
- Data query operations MUST complete within 500ms for typical datasets (<1000 records)
- Application MUST support offline functionality using Service Workers or similar technology
- Data synchronization MUST be optimized (only sync changed records)
- Images and assets MUST be optimized (lazy loading, compression, appropriate formats)
- Code splitting MUST be implemented to reduce initial bundle size

**Rationale**: Users access financial data frequently and in various network conditions. Fast performance and offline support ensure the app is always available when needed.

### V. Data Security (NON-NEGOTIABLE)

**Local Storage & Privacy Protection**

Security requirements:
- All financial data MUST be stored locally (browser storage, IndexedDB, or local files)
- No financial data MAY be transmitted to remote servers without explicit user consent
- Sensitive data MUST be encrypted at rest if browser environment permits
- Application MUST not collect or transmit personally identifiable information (PII)
- No third-party analytics or tracking scripts MAY be included without explicit user notice
- Security audits MUST be conducted before major releases
- Dependencies MUST be regularly updated to patch security vulnerabilities

**Rationale**: Financial data is highly sensitive. Local-first storage protects user privacy and builds trust. Users have full control over their data.

### VI. Accessibility

**Keyboard Navigation & ARIA Support**

Accessibility requirements:
- All interactive elements MUST be keyboard accessible (Tab, Enter, Escape, Arrow keys)
- Logical tab order MUST be maintained throughout the application
- ARIA labels MUST be provided for icon buttons and dynamic content
- ARIA live regions MUST announce important state changes to screen readers
- Color contrast MUST meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text)
- Focus indicators MUST be clearly visible for keyboard navigation
- Forms MUST have proper label associations and error announcements

**Rationale**: Financial independence requires accessible tools. Keyboard navigation and screen reader support ensure the app is usable by people with disabilities.

## Development Standards

### Code Review Requirements

- All code changes MUST be reviewed before merging to main branch
- Reviewers MUST verify compliance with all Core Principles
- Pull requests MUST include description of changes and testing performed
- Breaking changes MUST be documented in PR description
- Code reviews MUST check for security vulnerabilities and performance issues

### Documentation Requirements

- README MUST contain setup instructions and basic usage guide
- Complex business logic MUST have inline documentation
- API/component interfaces MUST be documented with JSDoc or TypeScript types
- Architecture decisions MUST be documented in ADR (Architecture Decision Records) format if significant

### Version Control Practices

- Commit messages MUST follow conventional commits format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Branch naming: `feature/description`, `fix/description`, `refactor/description`
- Main branch MUST always be in deployable state

## Quality Gates

### Pre-Merge Checklist

Before merging any feature branch, the following MUST be verified:

- [ ] All unit tests pass
- [ ] Code follows style guidelines (linter passes)
- [ ] Performance requirements met (load time, query speed)
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] Keyboard navigation verified
- [ ] No new security vulnerabilities introduced (dependency check)
- [ ] Data privacy requirements maintained (no unexpected network calls)
- [ ] Code reviewed and approved

### Pre-Release Checklist

Before any production release:

- [ ] Full regression testing completed
- [ ] Performance benchmarks meet targets
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Security audit completed
- [ ] Offline functionality verified
- [ ] Cross-browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] User documentation updated
- [ ] Release notes prepared

## Governance

### Amendment Procedure

This constitution MAY be amended through the following process:

1. Proposed amendment MUST be documented with rationale
2. Amendment MUST be reviewed by project maintainers
3. Impact analysis MUST be conducted (affected code, required migrations)
4. Amendment requires approval from majority of active maintainers
5. Version number MUST be incremented according to semantic versioning
6. All dependent templates and documentation MUST be updated

### Versioning Policy

Constitution versions follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Backward incompatible changes (principle removal, fundamental governance changes)
- **MINOR**: New principles added or material expansions to existing principles
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

### Compliance Review

- All feature specifications MUST reference applicable principles
- Implementation plans MUST include constitution compliance check
- Non-compliance MUST be explicitly justified in Complexity Tracking section
- Regular audits SHOULD be conducted to ensure ongoing compliance

### Complexity Justification

When a feature requires deviation from constitutional principles:

- Deviation MUST be documented in implementation plan
- Rationale MUST explain why principle cannot be followed
- Alternative approaches MUST be documented and rejection reasons provided
- Approval from maintainers required before implementation

**Version**: 1.0.0 | **Ratified**: 2025-10-16 | **Last Amended**: 2025-10-16
