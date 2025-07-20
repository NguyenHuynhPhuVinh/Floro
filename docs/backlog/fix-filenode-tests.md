# Backlog Item: Fix FileNode Test Suite Configuration

## Priority: Medium

**Created**: 2025-07-20
**Estimated Effort**: 2-4 hours
**Assignee**: Dev Team
**Epic**: [Story 2.1 - File Node Drag & Drop](../stories/2.1.story.md)
**Related Architecture**: [Testing Standards](../architecture/11-coding-standards.md#testing-standards)

## Problem Statement

FileNode test suite is currently disabled due to complex Jest mock configuration conflicts with react-konva components.

**Business Context**: FileNode is a critical component in the drag-and-drop file upload workflow, allowing users to create persistent file nodes on the canvas by dragging files from their computer. This component handles file visualization, download functionality, and canvas integration - making it essential for the core user experience.

While the functionality works perfectly in production, the test suite needs to be restored for proper CI/CD pipeline coverage and regression prevention.

## Root Cause Analysis

### 1. JavaScript Hoisting Issues

- Mock function definitions conflicting with Jest hoisting behavior
- Variables accessed before initialization in jest.mock() callbacks

### 2. Konva Component Mocking Complexity

- react-konva components require special mock handling
- Props filtering needed for DOM compatibility
- Complex component hierarchy (Group > Rect/Text/Circle/Path)

### 3. Jest Mock Function Tracking

- Mock functions not properly tracked across test assertions
- Call signature mismatches between expected and actual
- Multiple component instances causing call order issues

### 4. Test Environment Stability

- Bus errors during test execution
- Memory issues with complex mock setups
- Node.js compatibility problems

## Technical Requirements

### Must Fix

1. **Resolve Jest Mock Hoisting**: Implement proper mock function definitions that work with Jest hoisting
2. **Konva Component Mocking**: Create stable mock implementations for all react-konva components
3. **Mock Function Tracking**: Ensure Jest can properly track and assert mock function calls
4. **Test Environment**: Eliminate bus errors and memory issues

### Should Fix

1. **Test Performance**: Optimize test execution speed
2. **Mock Reusability**: Create reusable mock utilities for other Konva components
3. **Test Maintainability**: Simplify test setup and assertions

## Acceptance Criteria

- [ ] All FileNode tests execute without errors
- [ ] Mock functions properly track component calls with correct signatures
- [ ] Test assertions match actual component behavior
- [ ] No bus errors or memory issues during test execution
- [ ] Full test coverage restored (>95%)
- [ ] Tests run in reasonable time (<30 seconds)
- [ ] Mock setup is maintainable and reusable

## Technical Approach Options

### Option 1: Simplified Mock Strategy

- Use basic jest.fn() mocks without complex implementations
- Focus on call tracking rather than DOM rendering
- Minimal props filtering

### Option 2: Custom Test Renderer

- Create custom test renderer for Konva components
- Bypass DOM rendering entirely
- Focus on component logic testing

### Option 3: Integration Test Approach

- Reduce unit test complexity
- Focus on integration tests with real Konva components
- Use jsdom with canvas polyfills

## Files Affected

- `apps/web/src/components/nodes/__tests__/FileNode.test.tsx` - Main test file to fix
- `apps/web/jest.setup.js` - May need Jest configuration updates
- `apps/web/src/components/nodes/FileNode.tsx` - Component under test
- `apps/web/src/components/nodes/FileNodeIcon.tsx` - Sub-component under test

## Reference Documentation

- **Epic Context**: [Story 2.1 Implementation Details](../stories/2.1.story.md#task-7-comprehensive-unit-testing)
- **Current Testing Patterns**: See existing test files in `apps/web/src/components/canvas/__tests__/` for Konva testing examples
- **Architecture Standards**: [Testing Guidelines](../architecture/11-coding-standards.md#testing-standards)
- **Mock Patterns**: Reference `CanvasDragDropHandler.test.tsx` for successful Konva component mocking

## Success Metrics

- [ ] Test suite passes consistently
- [ ] No flaky tests or intermittent failures
- [ ] Test coverage maintained at >95%
- [ ] CI/CD pipeline includes FileNode tests
- [ ] Developer experience improved (fast, reliable tests)

## Dependencies

- Jest configuration
- react-konva library compatibility
- @testing-library/react setup
- Node.js test environment

## Risk Assessment

**Low Risk**: Functionality already works in production, this is purely a testing infrastructure issue.

**Mitigation**: If fix proves too complex, consider alternative testing strategies like visual regression tests or E2E tests for FileNode functionality.

## Definition of Done

- [ ] All FileNode tests pass consistently
- [ ] Test coverage reports include FileNode component
- [ ] CI/CD pipeline runs FileNode tests successfully
- [ ] Documentation updated with any new testing patterns
- [ ] Code review completed and approved
- [ ] No regression in other test suites
