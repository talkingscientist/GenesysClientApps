# GenesysClientApps

Browser-based starter applications for the Genesys Cloud CX Platform API. Zero build tools. Just copy, configure, and go.

## 🚀 Quick Start

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/talkingscientist/GenesysClientApps.git
   cd GenesysClientApps
   ```

2. **Create an OAuth client in Genesys Cloud**
   - Navigate to **Admin → Integrations → OAuth**
   - Click **Add Client**
   - Select **Token Implicit Grant (Browser)** as the grant type
   - Add your redirect URI (exact URL where you'll host the HTML file)
   - Grant required scopes (see individual app requirements below)
   - Save and copy your **Client ID**

3. **Open any application with URL parameters**
   ```
   ?clientId=YOUR_CLIENT_ID&env=YOUR_REGION&debug=true
   ```

4. **Example**:
   ```
   https://yoursite.com/QueueSpectrometer.html?clientId=abc123&env=usw2.pure.cloud&debug=true
   ```

## 📱 Applications

### QueueSpectrometer
**Real-time queue analytics dashboard with skill-based breakdowns**

- 🔴 **File**: `QueueSpectrometer.html`
- 🎯 **Purpose**: Monitor queue activity, waiting interactions, and routing patterns in real-time
- 📊 **Features**:
  - Live WebSocket updates
  - Overall activity metrics
  - Per-queue breakdowns
  - Skill-based grouping
  - 10-second polling fallback
- 🔐 **Required Scopes**:
  - `analytics` - For conversation activity queries
  - `routing:readonly` - For queue and skill lookups
  - `notifications` - For WebSocket subscriptions
- 🎨 **Theme**: TalkingScientist dark theme with red accents
- 📖 **Documentation**: Built on the [LAC pattern](https://www.talkingscientist.com/2025/10/16/gc-lac-starter-load-auth-cache-implicit-browser/)

### gc-lac-starter
**OAuth authentication template using the LAC (Load-Auth-Cache) pattern**

- 🔴 **File**: `gc-lac-starter.html`
- 🎯 **Purpose**: Minimal OAuth Implicit Grant starter for browser apps
- 📊 **Features**:
  - SDK auto-loading from CDN
  - Token caching with expiration validation
  - Parameter persistence in localStorage
  - Debug logging mode
  - JWT and opaque token support
- 🔐 **Required Scopes**: Based on your use case
- 📖 **Documentation**: [Blog post](https://www.talkingscientist.com/2025/10/16/gc-lac-starter-load-auth-cache-implicit-browser/)

### Dashboard
**Original queue monitoring dashboard with skill breakdowns**

- 🔴 **File**: `Dashboard.html`
- 🎯 **Purpose**: Real-time queue dashboard prototype
- 📊 **Features**:
  - Real-time queue monitoring
  - Skill-based activity breakdown
  - WebSocket notifications
- 🔐 **Required Scopes**:
  - `analytics`
  - `routing:readonly`
  - `notifications`

## 🌍 Genesys Cloud Regions

Use the base domain for your region (no `https://`, no `apps.`, no `login.`):

| Region | env Parameter | Description |
|--------|---------------|-------------|
| US West 2 | `usw2.pure.cloud` | Primary US West |
| US East 2 | `use2.pure.cloud` | US East |
| US East 1 | `mypurecloud.com` | Primary US region |
| Canada | `cac1.pure.cloud` | Canada Central |
| Europe (Ireland) | `mypurecloud.ie` | EU Ireland |
| Europe (Frankfurt) | `mypurecloud.de` | EU Frankfurt |
| Europe (London) | `euw2.pure.cloud` | EU London |
| Asia Pacific (Tokyo) | `mypurecloud.jp` | Japan |
| Asia Pacific (Seoul) | `apne2.pure.cloud` | South Korea |
| Asia Pacific (Sydney) | `mypurecloud.com.au` | Australia |

[Full region list](https://help.mypurecloud.com/articles/required-genesys-cloud-domains/)

## 🔧 URL Parameters

All applications support these parameters:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `clientId` | ✅ Yes | OAuth Client ID from Admin → OAuth | `abc123def456` |
| `env` | ✅ Yes | Genesys Cloud region base domain | `usw2.pure.cloud` |
| `debug` | ❌ No | Enable verbose console logging | `true` |

Parameters are cached in localStorage after first use, so you only need to provide them once per browser.

## 🎨 Theme & Styling

Applications use the **TalkingScientist theme** with:
- Dark-first design (Lab Night background)
- Signal Red accents (`#ff0000`)
- Space Grotesk typography
- 8pt spacing grid
- Responsive layout

**Theme file**: `assets/css/main.css`
**Style guide**: [styleguide.md](styleguide.md)

## 🛠️ Development

### Local Testing

Serve files via HTTP (required for OAuth, `file://` won't work):

```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js
npx http-server -p 8080
```

Then visit: `http://localhost:8080/QueueSpectrometer.html?clientId=...&env=...&debug=true`

### OAuth Configuration Checklist

✅ Grant Type: **Token Implicit Grant (Browser)**
✅ Redirect URI: **Exact URL** (including protocol, domain, path)
✅ Scopes: Grant **only what's needed** (least privilege)
✅ Client Secret: **Not used** in browser (never expose it)

### Creating New Applications

1. Copy `gc-lac-starter.html` as your base
2. Add your application logic after authentication completes
3. Use CSS variables from `assets/css/main.css`
4. Scope custom styles to avoid conflicts
5. Document required scopes and URL parameters
6. Test OAuth flow end-to-end

## 🔒 Security Notes

### OAuth Best Practices

- **Implicit Grant** is suitable for POCs and simple browser apps
- For production web apps, prefer **Authorization Code + PKCE**:
  - [Auth Code Guide](https://developer.genesys.cloud/authorization/platform-auth/guides/oauth-auth-code-guide)
- Never commit OAuth client secrets to version control
- Use HTTPS for production deployments
- Implement token refresh flows for long sessions

### Token Storage

- Tokens are stored in `localStorage` by default
- Be aware of XSS vulnerabilities if loading third-party scripts
- Consider more secure storage for production (e.g., httpOnly cookies via backend)
- Tokens expire based on OAuth client configuration

### Scope Hygiene

- Grant **read-only** scopes when possible
- Audit scopes regularly
- Remove unused scopes from OAuth clients
- Document why each scope is required

## 📚 Resources

### Genesys Cloud Documentation
- [Developer Center](https://developer.genesys.cloud/)
- [Platform API Reference](https://developer.genesys.cloud/devapps/api-explorer)
- [JavaScript SDK](https://developer.genesys.cloud/devapps/sdk/docexplorer/purecloudjavascript/)
- [OAuth Guide](https://developer.genesys.cloud/authorization/platform-auth/)
- [Create OAuth Client](https://help.mypurecloud.com/articles/create-an-oauth-client/)
- [OAuth Scopes](https://help.mypurecloud.com/articles/about-oauth-scopes-for-applications/)

### TalkingScientist
- [LAC Pattern Blog Post](https://www.talkingscientist.com/2025/10/16/gc-lac-starter-load-auth-cache-implicit-browser/)
- [Website](https://www.talkingscientist.com/)

### Repository Documentation
- [CLAUDE.md](CLAUDE.md) - AI assistant development guide
- [styleguide.md](styleguide.md) - CSS theme reference

## 🐛 Troubleshooting

### "Could not load Genesys Cloud SDK"
**Cause**: SDK CDN unreachable or CSP blocking script loading
**Fix**:
- Check browser console for network errors
- Verify CSP allows `https://sdk-cdn.mypurecloud.com`
- Check internet connectivity

### "Missing clientId" or "Missing env"
**Cause**: URL parameters not provided or localStorage cleared
**Fix**:
- Add `?clientId=YOUR_ID&env=YOUR_REGION` to URL
- Check parameter names (case-sensitive)
- Verify localStorage is enabled

### OAuth redirect loops
**Cause**: Redirect URI mismatch or OAuth client misconfigured
**Fix**:
- Verify **exact** redirect URI in OAuth client config
- Check protocol (`http` vs `https`)
- Check for trailing slashes
- Confirm grant type is "Token Implicit Grant (Browser)"

### API calls return 403 Forbidden
**Cause**: Token expired, insufficient scopes, or wrong region
**Fix**:
- Check token expiration in console (debug mode)
- Verify OAuth client has required scopes
- Confirm `env` parameter matches OAuth client's region
- Review API documentation for required permissions

### WebSocket disconnects
**Cause**: Network issues, token expiration, or firewall blocking
**Fix**:
- Check browser console for WebSocket errors
- Verify token is still valid
- Check firewall allows WebSocket connections
- Apps have 10s polling fallback for resilience

## 📝 License

**Owner**: TalkingScientist

If it breaks, I fix it. If it works, you buy coffee. ☕

## 🤝 Contributing

This is a collection of starter templates maintained by TalkingScientist. Contributions, suggestions, and feedback are welcome!

- Report issues on GitHub
- Share your use cases
- Submit pull requests for improvements

## 🎯 Use Cases

These starters are perfect for:
- **Proof of concepts** - Quick API exploration
- **Internal tools** - Dashboards and monitors for admins
- **Training & demos** - Teaching Genesys Cloud API integration
- **Prototyping** - Fast iteration on ideas
- **Learning** - Understanding OAuth and Platform API patterns

Not recommended for:
- ❌ Production customer-facing applications (use Auth Code + PKCE)
- ❌ High-security environments (token in localStorage)
- ❌ Mobile apps (use native OAuth flows)

---

**Contact centers × Science × Controlled chaos.**

[TalkingScientist.com](https://www.talkingscientist.com/)
