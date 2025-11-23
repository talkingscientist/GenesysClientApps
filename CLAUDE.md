# CLAUDE.md - AI Assistant Guide for GenesysClientApps

## Repository Overview

**GenesysClientApps** is a collection of starter applications for the Genesys Cloud Platform API. The repository provides browser-based, zero-build-tool starter templates for OAuth authentication and API integration.

**Current Status**: Initial repository with one starter file
**Primary Owner**: TalkingScientist
**License**: Not specified (check with owner before assuming open source)

---

## Repository Structure

```
GenesysClientApps/
├── gc-lac-starter.html    # Genesys Cloud Load-Auth-Cache (LAC) starter
└── CLAUDE.md              # This file - AI assistant guide
```

### File Inventory

#### `gc-lac-starter.html`
**Purpose**: Browser-only OAuth starter using Implicit Grant flow
**Tech Stack**: Vanilla JavaScript, Genesys Cloud Platform SDK
**Location**: `/home/user/GenesysClientApps/gc-lac-starter.html`

**What it does**:
- Loads the Genesys Cloud JavaScript SDK from CDN
- Implements OAuth 2.0 Implicit Grant flow (browser-based)
- Manages token storage and validation using localStorage
- Provides automatic token refresh detection
- Exposes authenticated SDK client globally for quick experimentation

**Key Features**:
- Zero build tools required - pure HTML/JS
- URL parameter-based configuration
- Token caching with expiration validation
- Debug mode for development
- Comprehensive inline documentation

---

## Architecture & Design Patterns

### Authentication Flow (Implicit Grant)

The LAC (Load-Auth-Cache) pattern follows this sequence:

1. **Load**: Dynamically load Genesys Cloud SDK from CDN
2. **Auth**: Check for existing valid token, or initiate OAuth flow
3. **Cache**: Store tokens in localStorage with expiration tracking

```
User visits page
    ↓
Check URL params (clientId, env, debug)
    ↓
Load/Check cached token
    ↓
Valid? → Set up client → Done
    ↓
Invalid/Missing? → Redirect to Genesys OAuth
    ↓
OAuth callback → Store token → Set up client → Done
```

### Token Management

- **JWT Tokens**: Decoded and validated using `exp` claim
- **Opaque Tokens**: Validated using stored expiry from `expires_in` parameter
- **Storage**: localStorage keys:
  - `gc_access_token`: The OAuth access token
  - `gc_token_expiry`: Expiration timestamp (milliseconds)
  - `gc_param_*`: Cached URL parameters (clientId, env, etc.)

### SDK Loading Strategy

Multi-tier fallback approach:
1. Check for existing global SDK instance
2. Load from CDN if not present
3. Poll for SDK availability (handles async timing)
4. Heuristic detection by finding objects with `ApiClient` and `UsersApi`

---

## Development Workflows

### Adding New Client Applications

When adding new starter files to this repository:

1. **Naming Convention**: Use prefix pattern `gc-{feature}-{type}.html`
   - Examples: `gc-notifications-listener.html`, `gc-analytics-reporter.html`

2. **Documentation Requirements**:
   - Include comprehensive inline comments
   - Specify OAuth requirements (grant type, scopes, redirect URIs)
   - Document all URL parameters
   - Provide security considerations
   - Link to relevant Genesys Cloud documentation

3. **Code Style**:
   - Use async/await for asynchronous operations
   - Implement robust error handling with user-friendly messages
   - Include debug/verbose logging mode (controlled by URL parameter)
   - Follow the LAC pattern where applicable

4. **Testing Checklist**:
   - Test with missing required parameters
   - Test with expired tokens
   - Test OAuth redirect flow
   - Test token caching and reuse
   - Test across different Genesys Cloud regions
   - Verify CSP (Content Security Policy) compatibility

### Modifying Existing Files

**Before making changes**:
- Read the entire file to understand current implementation
- Identify security-sensitive areas (token handling, OAuth flow)
- Note any region-specific or environment-specific logic

**Change guidelines**:
- Preserve existing security measures
- Maintain backward compatibility with cached tokens
- Update inline documentation if behavior changes
- Test OAuth flow end-to-end after changes

### Git Workflow

**Branch naming**: `claude/claude-md-{session-id}`
**Current branch**: `claude/claude-md-mibr6k7x266k75qe-013mEMHrQibtSnjVD6piuGNF`

**Commit message style**:
```
Add [feature/file]: Brief description

- Detail 1
- Detail 2
```

Example:
```
Add analytics dashboard starter

- Implement real-time conversation analytics
- Add configurable metrics display
- Include token refresh handling
```

---

## Key Conventions for AI Assistants

### Security First

**CRITICAL**: This repository handles OAuth tokens and authentication

1. **Never log sensitive data**:
   - Don't log full tokens (truncate or redact)
   - Don't log client secrets (never used in browser anyway)
   - Be cautious with PII from API responses

2. **OAuth Security Considerations**:
   - Implicit Grant is appropriate for POCs and simple apps
   - For production, recommend Authorization Code + PKCE
   - Always validate redirect URIs match exactly
   - Implement token expiration checking
   - Clear tokens on expiration, not just mark as invalid

3. **localStorage Security**:
   - Warn about XSS vulnerabilities if user adds third-party scripts
   - Recommend HTTPS for production deployments
   - Consider token theft mitigation strategies

4. **Scope Hygiene**:
   - Use principle of least privilege
   - Document required scopes for each feature
   - Never request write scopes unless necessary

### Code Modification Guidelines

When asked to modify or extend code:

1. **Read First**: Always read the target file completely before suggesting changes
   ```
   ✅ Read gc-lac-starter.html → Understand flow → Make changes
   ❌ Make changes based on filename alone
   ```

2. **Preserve Patterns**: Maintain established patterns
   - URL parameter parsing strategy
   - Token validation approach
   - Error messaging style
   - Logging conventions (use `log()` function for debug mode)

3. **Minimal Changes**: Don't over-engineer
   - Don't add frameworks if vanilla JS works
   - Don't add build tools unless absolutely necessary
   - Don't refactor working code "for style"
   - Keep the "copy-paste-go" simplicity

4. **Documentation Updates**: If you change behavior, update:
   - Inline code comments
   - URL parameter documentation
   - Quick start examples
   - Security footnotes if applicable

### Common Tasks

#### Task: Add a new OAuth scope requirement

```javascript
// In the header comment, update the scope example:
*       Scope:  Only what you need (least privilege).
*         Example: analytics conversations notifications NEW_SCOPE users:readonly
```

Then document why the new scope is needed and what it enables.

#### Task: Add a new URL parameter

1. Document it in the header comments under "URL parameters LAC understands"
2. Parse it in the `getAllUrlParams()` flow
3. Decide if it should be cached (non-sensitive) via `saveParamsToStorage()`
4. Implement the feature that uses it
5. Update the "Quick start example URL"

#### Task: Debug authentication issues

Check in order:
1. `clientId` parameter present and correct
2. `env` parameter matches actual Genesys Cloud region
3. OAuth client in Genesys Cloud admin configured correctly:
   - Grant Type: Token Implicit Grant
   - Redirect URI matches EXACTLY (including protocol, subdomain, path)
   - Required scopes are granted
4. Browser console for SDK loading errors
5. Network tab for OAuth redirect responses
6. localStorage for token presence and validity

#### Task: Add API integration example

Pattern to follow:
```javascript
// After LAC completes and window.gcClient is available
const usersApi = new window.gcPlatformClient.UsersApi();
try {
  const me = await usersApi.getUsersMe();
  console.log('Authenticated user:', me);
} catch (err) {
  console.error('API call failed:', err);
  // Check token validity, scope permissions
}
```

Always wrap API calls in try-catch and handle errors gracefully.

### Genesys Cloud Specific Knowledge

#### Regions and Environments

The `env` parameter expects base domains only (no protocol, no subdomains):

| Region | Base Domain | Description |
|--------|-------------|-------------|
| US East | `mypurecloud.com` | Primary US region |
| US West | `usw2.pure.cloud` | US West 2 |
| Canada | `cac1.pure.cloud` | Canada Central |
| Europe (Ireland) | `mypurecloud.ie` | EU Ireland |
| Europe (Frankfurt) | `mypurecloud.de` | EU Frankfurt |
| Europe (London) | `euw2.pure.cloud` | EU London |
| Asia Pacific (Tokyo) | `mypurecloud.jp` | Japan |
| Asia Pacific (Seoul) | `apne2.pure.cloud` | South Korea |
| Asia Pacific (Sydney) | `mypurecloud.com.au` | Australia |

Full list: https://help.mypurecloud.com/articles/required-genesys-cloud-domains/

#### OAuth Grant Types

- **Implicit Grant** (current): Browser-only, token in URL fragment, no refresh tokens
- **Authorization Code** (recommended for production): Server-side, supports refresh tokens
- **Client Credentials**: Machine-to-machine, not for user auth
- **SAML2 Bearer**: Enterprise SSO integration

Reference: https://developer.genesys.cloud/authorization/platform-auth/

#### Common Scopes

Format: `resource` or `resource:action`

Examples:
- `analytics` - Full analytics access
- `conversations:readonly` - Read conversation data
- `users:readonly` - Read user information
- `routing:readonly` - Read routing config
- `notifications` - Subscribe to platform notifications

Full list: https://help.mypurecloud.com/articles/about-oauth-scopes-for-applications/

### JavaScript SDK References

**SDK Repository**: https://github.com/MyPureCloud/platform-client-sdk-javascript

**CDN URLs**:
- Latest (POC only): `https://sdk-cdn.mypurecloud.com/javascript/latest/purecloud-platform-client-v2.min.js`
- Pinned version (production): `https://sdk-cdn.mypurecloud.com/javascript/{version}/purecloud-platform-client-v2.min.js`

**Common APIs**:
- `UsersApi` - User management and queries
- `ConversationsApi` - Conversation data and control
- `AnalyticsApi` - Historical and real-time analytics
- `NotificationsApi` - WebSocket notification subscriptions
- `RoutingApi` - ACD routing configuration

---

## Testing & Validation

### Manual Testing Steps

1. **Fresh Auth Flow**:
   ```
   - Clear localStorage
   - Visit page with ?clientId=...&env=...&debug=true
   - Should redirect to Genesys login
   - After login, should return with token
   - Console should show "Authentication complete"
   ```

2. **Token Reuse**:
   ```
   - With valid token in storage, reload page
   - Should NOT redirect to login
   - Console should show "Reusing valid token"
   ```

3. **Token Expiration**:
   ```
   - Manually modify gc_token_expiry to past timestamp
   - Reload page
   - Should clear token and re-initiate auth flow
   ```

4. **Multi-region**:
   ```
   - Test with different env values
   - Verify API calls go to correct region
   ```

### Browser Compatibility

Minimum requirements:
- ES6+ support (async/await, Promises, arrow functions)
- localStorage API
- URLSearchParams API
- Fetch API (used by SDK)

Recommended: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

---

## Common Issues & Solutions

### Issue: "Could not load Genesys Cloud SDK"

**Causes**:
- CDN unreachable (network/firewall)
- CSP blocking script loading
- Very slow connection timeout

**Solutions**:
- Check browser console for network errors
- Verify CSP allows `https://sdk-cdn.mypurecloud.com`
- Try pinned SDK version instead of "latest"

### Issue: "Missing clientId" or "Missing env"

**Causes**:
- URL parameters not provided
- localStorage cleared
- Typo in parameter names

**Solutions**:
- Verify URL includes `?clientId=...&env=...`
- Check localStorage for `gc_param_clientId` and `gc_param_env`
- Parameter names are case-sensitive

### Issue: OAuth redirect loops

**Causes**:
- Redirect URI mismatch
- OAuth client misconfigured
- State parameter issues

**Solutions**:
- Verify Admin → OAuth → Client → Authorized redirect URIs contains EXACT page URL
- Check protocol (http vs https)
- Check for trailing slashes
- Verify grant type is "Token Implicit Grant (Browser)"

### Issue: API calls return 403 Forbidden

**Causes**:
- Token expired
- Insufficient scopes
- Wrong region

**Solutions**:
- Check token expiration in console (debug mode)
- Verify OAuth client has required scopes granted
- Verify `env` parameter matches where OAuth client was created
- Check API documentation for required permissions

---

## Future Expansion Ideas

Potential additional starters to add:

1. **gc-notifications-listener.html**: WebSocket notification subscriber
2. **gc-analytics-query.html**: Historical analytics query builder
3. **gc-presence-updater.html**: User presence management
4. **gc-queue-observer.html**: Real-time queue statistics
5. **gc-conversation-monitor.html**: Active conversation viewer
6. **gc-authcode-pkce.html**: Authorization Code + PKCE example (requires backend)

Each should follow the LAC pattern and maintain the zero-build-tool philosophy.

---

## AI Assistant Quick Reference

### Before Any Code Change

- [ ] Read the entire file being modified
- [ ] Understand the current authentication flow
- [ ] Identify security-sensitive code sections
- [ ] Check for region-specific logic
- [ ] Note existing error handling patterns

### When Adding Features

- [ ] Maintain vanilla JS approach (no frameworks)
- [ ] Follow LAC pattern (Load → Auth → Cache)
- [ ] Add debug logging for new features
- [ ] Update header documentation
- [ ] Test OAuth flow end-to-end
- [ ] Document required scopes if calling new APIs
- [ ] Verify token validation still works

### When Debugging

- [ ] Enable debug mode (`?debug=true`)
- [ ] Check browser console first
- [ ] Verify localStorage contents
- [ ] Check Network tab for OAuth redirects
- [ ] Validate region/environment settings
- [ ] Review OAuth client configuration in Genesys admin

### When Writing Documentation

- [ ] Use present tense, active voice
- [ ] Provide specific examples with actual values
- [ ] Link to official Genesys documentation
- [ ] Include security considerations
- [ ] Show common error messages and fixes

---

## Resources

### Genesys Cloud Documentation
- Platform API: https://developer.genesys.cloud/
- OAuth Guide: https://developer.genesys.cloud/authorization/platform-auth/
- JavaScript SDK: https://developer.genesys.cloud/devapps/sdk/docexplorer/purecloudjavascript/
- Create OAuth Client: https://help.mypurecloud.com/articles/create-an-oauth-client/
- OAuth Scopes: https://help.mypurecloud.com/articles/about-oauth-scopes-for-applications/
- Required Domains: https://help.mypurecloud.com/articles/required-genesys-cloud-domains/

### Relevant RFCs & Standards
- OAuth 2.0: https://datatracker.ietf.org/doc/html/rfc6749
- JWT: https://datatracker.ietf.org/doc/html/rfc7519
- OAuth 2.0 for Browser-Based Apps: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps

---

## Changelog

### 2025-11-23
- Initial CLAUDE.md creation
- Documented gc-lac-starter.html architecture
- Established conventions for future client apps
- Added comprehensive troubleshooting guide

---

**Document maintained by**: AI assistants working with TalkingScientist
**Last updated**: 2025-11-23
**Repository**: https://github.com/talkingscientist/GenesysClientApps
