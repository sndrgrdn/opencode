# Review Rubric

Detailed guidelines for code review findings.

## Determining What to Flag

Flag issues that:
1. Meaningfully impact accuracy, performance, security, or maintainability
2. Are discrete and actionable (not general or combined)
3. Don't demand rigor inconsistent with the codebase
4. Were **introduced in the changes** (not pre-existing bugs)
5. Author would likely fix if aware
6. Don't rely on unstated assumptions
7. Have provable impact on other code (not speculation)
8. Are clearly not intentional changes

## Comment Guidelines

1. Be clear about WHY it's a problem
2. Communicate severity appropriately - don't exaggerate
3. Be brief - at most 1 paragraph
4. Code snippets under 3 lines
5. Explicitly state scenarios where issue arises
6. Matter-of-fact tone - helpful, not accusatory
7. Write for quick comprehension
8. Avoid "Great job, but..." patterns

## Review Priorities

1. **New dependencies** - Call out, explain why needed
2. **Simplicity** - Prefer direct solutions over unnecessary wrappers
3. **Fail-fast** - Avoid log-and-continue patterns that hide errors
4. **Predictability** - Crash > silent degradation
5. **Back pressure** - Critical to system stability
6. **System thinking** - Flag operational risk increases
7. **Error handling** - Check error codes/types, not messages

## Priority Definitions

### [P0] - Drop Everything

- Security vulnerability (injection, auth bypass)
- Data loss or corruption
- Blocking production/release
- Universal impact (affects all users)

### [P1] - Urgent

- Should fix in next cycle
- Pattern violations creating tech debt
- Missing tests for critical paths
- Architectural misfit

### [P2] - Normal

- Fix eventually
- Edge case handling
- Performance improvements
- Minor refactoring

### [P3] - Nice to Have

- Alternative approaches
- Future improvements
- Style suggestions beyond linter
- Documentation gaps

## Decision Framework

| Verdict | When |
|---------|------|
| **Looks good** | No P0/P1; P2/P3 minor; follows patterns |
| **Needs attention** | Any P0/P1; multiple P2 in same area; pattern violations |

## Output Format

```markdown
#### [P1] <short title>

**File:** `path/file.ext:123`

**Issue:** <1-2 sentences explaining the problem>

**Fix:**
```code
suggested fix or approach
```
```

## When to Question vs Be Direct

**Use questions when:**
- Teaching opportunity exists
- Intent unclear
- Multiple valid approaches

**Be direct when:**
- Clear pattern violation
- Missing required element
- Obvious bug
- Unnecessary code
