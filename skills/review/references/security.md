# Security Checklist

Security-focused review criteria. All items are P0 or P1 when violated.

## Untrusted User Input

### Open Redirects

```
?next=/dashboard      -> OK (relative)
?next=//evil.com      -> BLOCK (protocol-relative)
?next=https://x.com   -> CHECK against allowlist
```

**Fix:** Validate against trusted domain list.

```javascript
// BAD
res.redirect(req.query.next);

// GOOD
const allowed = ['example.com', 'app.example.com'];
const url = new URL(req.query.next, 'https://example.com');
if (!allowed.includes(url.hostname)) {
  throw new Error('Invalid redirect');
}
res.redirect(url.toString());
```

### SQL Injection

```sql
-- BAD
"SELECT * FROM users WHERE id = " + userId

-- GOOD
"SELECT * FROM users WHERE id = $1", [userId]
```

**Fix:** Always use parameterized queries. Never interpolate.

### SSRF (Server-Side Request Forgery)

```javascript
// BAD
fetch(userProvidedUrl)

// GOOD
const url = new URL(userProvidedUrl);
const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
if (blockedHosts.some(h => url.hostname.includes(h))) {
  throw new Error('Blocked host');
}
// Also: intercept DNS to block internal IPs (10.x, 192.168.x, etc.)
```

**Fix:** Allowlist hosts, block internal ranges, validate resolved IPs.

### XSS (Cross-Site Scripting)

```javascript
// BAD
element.innerHTML = userInput;

// GOOD
element.textContent = userInput;
```

**Fix:** Escape, don't sanitize. Use `textContent`, not `innerHTML`.

### Command Injection

```javascript
// BAD
exec(`convert ${userFilename} output.png`);

// GOOD
execFile('convert', [userFilename, 'output.png']);
```

**Fix:** Use `execFile` with array args, never string interpolation.

### Path Traversal

```javascript
// BAD
fs.readFile(`uploads/${userPath}`);

// GOOD
const safePath = path.join('uploads', path.basename(userPath));
if (!safePath.startsWith('uploads/')) throw new Error('Invalid path');
fs.readFile(safePath);
```

**Fix:** Validate paths stay within allowed directory.

## Authentication & Authorization

- [ ] Session tokens: `httpOnly`, `secure`, `sameSite`
- [ ] Auth checks on every protected route
- [ ] Permission checks before data access
- [ ] Rate limiting on auth endpoints
- [ ] Timing-safe comparison for secrets
- [ ] Password hashing with bcrypt/argon2 (not MD5/SHA1)

## Data Handling

- [ ] Sensitive data not logged
- [ ] PII encrypted at rest
- [ ] Secrets not in code/config files
- [ ] Error messages don't leak internals
- [ ] Debug endpoints disabled in production

## Common Patterns to Flag

| Pattern | Risk | Priority |
|---------|------|----------|
| `eval(userInput)` | RCE | P0 |
| `new Function(userInput)` | RCE | P0 |
| String SQL concatenation | SQLi | P0 |
| `innerHTML = userInput` | XSS | P0 |
| `dangerouslySetInnerHTML` | XSS | P1 |
| `fetch(userUrl)` without validation | SSRF | P1 |
| `fs.readFile(userPath)` | Path traversal | P1 |
| `exec(cmd + userInput)` | Command injection | P0 |
| Hardcoded secrets | Credential leak | P1 |
| `JSON.parse(untrusted)` without limits | DoS | P2 |

## Framework-Specific

### React
- Check `dangerouslySetInnerHTML` usage
- Verify `href` values aren't user-controlled (`javascript:`)

### Node.js
- Check `child_process` usage
- Verify `require()` paths aren't user-controlled

### SQL/ORM
- Check for raw queries with interpolation
- Verify ORM methods use parameterization

## Quick Security Audit

For any user input flow:

1. **Where does it enter?** (req.body, req.query, req.params, headers)
2. **Is it validated?** (type, format, length, allowlist)
3. **Is it escaped for context?** (HTML, SQL, shell, URL)
4. **Where does it go?** (database, file system, external service, response)
