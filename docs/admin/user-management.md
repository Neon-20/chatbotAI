# User Management

This guide covers user management, role-based access control, and administrative functions in DomusAI.

## 👥 User Roles

DomusAI implements a three-tier role system:

### User (Default)
- Access to chat interface
- Create and manage own workspaces
- Upload and manage files
- Use AI models within limits
- View own analytics

**Permissions:**
- ✅ Chat with AI models
- ✅ Create workspaces
- ✅ Upload files (up to quota)
- ✅ Use suggestion tiles
- ❌ Access admin panel
- ❌ Manage other users
- ❌ View system analytics

### Admin
- All user permissions
- Manage users and roles
- Access system analytics
- Configure system settings
- Monitor usage and performance

**Additional Permissions:**
- ✅ Access admin dashboard
- ✅ Manage user accounts
- ✅ View system analytics
- ✅ Configure workspace settings
- ✅ Monitor system health
- ❌ Manage other admins
- ❌ Access superadmin features

### Superadmin
- All admin permissions
- Manage admin accounts
- System configuration
- Database management
- Security settings

**Additional Permissions:**
- ✅ Manage admin accounts
- ✅ System configuration
- ✅ Database access
- ✅ Security settings
- ✅ Billing management
- ✅ API key management

## 🔐 Access Control

### Role Assignment

**Automatic Assignment:**
- New users get "user" role by default
- First user becomes superadmin
- Invitations can specify initial role

**Manual Assignment:**
```sql
-- Update user role (superadmin only)
UPDATE profiles 
SET roles = 'admin' 
WHERE id = 'user_uuid';
```

**Bulk Role Updates:**
```sql
-- Promote multiple users to admin
UPDATE profiles 
SET roles = 'admin' 
WHERE id IN ('uuid1', 'uuid2', 'uuid3');
```

### Permission Checks

The system uses Row Level Security (RLS) policies:

```sql
-- Example: Admin can view all profiles
CREATE POLICY "Admin access to profiles" ON profiles
  FOR SELECT USING (
    (SELECT roles FROM profiles WHERE id = auth.uid()) 
    IN ('admin', 'superadmin')
  );
```

### API Access Control

```typescript
// Middleware for role checking
export function requireRole(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await getCurrentUser(req)
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    
    next()
  }
}

// Usage in routes
app.get('/api/admin/users', requireRole(['admin', 'superadmin']), getUserList)
```

## 👤 User Management Interface

### Admin Dashboard

Access the admin dashboard at `/admin` (admin+ only):

**User Overview:**
- Total user count
- Active users (last 30 days)
- New registrations
- Role distribution

**Quick Actions:**
- Search users
- Filter by role
- Bulk operations
- Export user data

### User List

The user management interface provides:

**User Information:**
- Display name and email
- Registration date
- Last activity
- Current role
- Usage statistics

**Available Actions:**
- Edit user profile
- Change user role
- Reset password
- Suspend account
- Delete account

### User Details

Click on any user to view detailed information:

**Profile Information:**
```json
{
  "id": "user_uuid",
  "display_name": "John Doe",
  "email": "john@example.com",
  "bio": "Software Developer",
  "roles": "user",
  "created_at": "2024-01-01T00:00:00Z",
  "last_active": "2024-01-15T10:30:00Z",
  "has_onboarded": true
}
```

**Usage Statistics:**
- Total messages sent
- Files uploaded
- Workspaces created
- API calls made
- Storage used

**Activity Log:**
- Login history
- Chat activity
- File uploads
- Settings changes

## 🔧 User Operations

### Creating Users

**Manual Creation:**
1. Go to Admin Dashboard
2. Click "Add User"
3. Fill in user details:
   - Email address
   - Display name
   - Initial role
   - Send invitation email

**Bulk Import:**
```csv
email,display_name,role
john@example.com,John Doe,user
jane@example.com,Jane Smith,admin
```

**API Creation:**
```typescript
POST /api/admin/users
{
  "email": "user@example.com",
  "display_name": "New User",
  "role": "user",
  "send_invitation": true
}
```

### Modifying Users

**Role Changes:**
```typescript
PUT /api/admin/users/{userId}/role
{
  "role": "admin"
}
```

**Profile Updates:**
```typescript
PUT /api/admin/users/{userId}
{
  "display_name": "Updated Name",
  "bio": "Updated bio"
}
```

**Password Reset:**
```typescript
POST /api/admin/users/{userId}/reset-password
{
  "send_email": true
}
```

### Account Suspension

**Temporary Suspension:**
```sql
-- Disable user account
UPDATE auth.users 
SET banned_until = NOW() + INTERVAL '30 days'
WHERE id = 'user_uuid';
```

**Permanent Suspension:**
```sql
-- Permanently disable account
UPDATE auth.users 
SET banned_until = '2099-12-31'
WHERE id = 'user_uuid';
```

**Reactivation:**
```sql
-- Reactivate suspended account
UPDATE auth.users 
SET banned_until = NULL
WHERE id = 'user_uuid';
```

### Account Deletion

**Soft Delete (Recommended):**
- Marks account as deleted
- Preserves data for audit
- Can be restored if needed

```sql
UPDATE profiles 
SET deleted_at = NOW()
WHERE id = 'user_uuid';
```

**Hard Delete (Permanent):**
- Completely removes user data
- Cannot be undone
- Triggers cascade deletion

```sql
DELETE FROM auth.users 
WHERE id = 'user_uuid';
```

## 📊 User Analytics

### Usage Metrics

**Individual User Metrics:**
- Messages per day/week/month
- Tokens consumed
- Files uploaded
- Active hours
- Favorite models

**Aggregate Metrics:**
- Total active users
- Average session duration
- Peak usage times
- Feature adoption rates
- Retention statistics

### Reporting

**Built-in Reports:**
- User activity summary
- Usage trends
- Feature adoption
- Performance metrics

**Custom Reports:**
```sql
-- Example: Most active users
SELECT 
  p.display_name,
  COUNT(m.id) as message_count,
  SUM(m.prompt_tokens + m.completion_tokens) as total_tokens
FROM profiles p
JOIN chats c ON p.id = c.user_id
JOIN messages m ON c.id = m.chat_id
WHERE m.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id, p.display_name
ORDER BY message_count DESC
LIMIT 10;
```

**Export Options:**
- CSV for spreadsheet analysis
- JSON for programmatic access
- PDF for executive reports

## 🔒 Security Management

### Authentication Settings

**Password Policies:**
- Minimum length: 8 characters
- Require special characters
- Password expiration (optional)
- Prevent password reuse

**Two-Factor Authentication:**
- TOTP (Time-based One-Time Password)
- SMS verification (optional)
- Backup codes
- Recovery options

**Session Management:**
- Session timeout settings
- Concurrent session limits
- Device tracking
- Force logout capabilities

### API Key Management

**User API Keys:**
- View encrypted keys (last 4 digits)
- Revoke compromised keys
- Set usage limits
- Monitor API usage

**System API Keys:**
- Manage service integrations
- Rotate keys regularly
- Monitor for unusual activity
- Set rate limits

### Audit Logging

**Tracked Events:**
- User login/logout
- Role changes
- Data access
- Configuration changes
- Security events

**Log Format:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "user_id": "user_uuid",
  "action": "role_change",
  "details": {
    "target_user": "target_uuid",
    "old_role": "user",
    "new_role": "admin"
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

## 🚨 Incident Response

### Account Compromise

**Immediate Actions:**
1. Suspend affected account
2. Revoke all sessions
3. Reset password
4. Review audit logs
5. Check for data access

**Investigation Steps:**
1. Analyze login patterns
2. Review recent activities
3. Check for unauthorized changes
4. Identify potential data exposure
5. Document findings

### Bulk Operations

**Mass Password Reset:**
```sql
-- Force password reset for all users
UPDATE auth.users 
SET password_change_required = true;
```

**Emergency Lockdown:**
```sql
-- Temporarily suspend all non-admin users
UPDATE profiles 
SET suspended_until = NOW() + INTERVAL '1 hour'
WHERE roles = 'user';
```

## 📋 Best Practices

### User Onboarding

1. **Welcome Email** - Send clear instructions
2. **Profile Setup** - Guide through initial configuration
3. **Feature Tour** - Highlight key capabilities
4. **Support Resources** - Provide help documentation

### Role Management

1. **Principle of Least Privilege** - Grant minimum necessary permissions
2. **Regular Reviews** - Audit roles quarterly
3. **Separation of Duties** - Distribute admin responsibilities
4. **Documentation** - Maintain role assignment records

### Monitoring

1. **Regular Audits** - Review user activities monthly
2. **Anomaly Detection** - Monitor for unusual patterns
3. **Performance Tracking** - Watch for system impact
4. **Compliance Reporting** - Generate required reports

### Data Protection

1. **Privacy by Design** - Minimize data collection
2. **Encryption** - Protect sensitive information
3. **Access Controls** - Limit data exposure
4. **Retention Policies** - Delete old data appropriately

## 🔧 Troubleshooting

### Common Issues

**Users Can't Login:**
- Check account status
- Verify email confirmation
- Review password policies
- Check for IP restrictions

**Permission Errors:**
- Verify role assignments
- Check RLS policies
- Review API permissions
- Clear cached sessions

**Performance Issues:**
- Monitor user activity
- Check resource usage
- Review database queries
- Optimize heavy operations

### Support Procedures

1. **Ticket System** - Track user issues
2. **Escalation Path** - Define support levels
3. **Knowledge Base** - Maintain solution database
4. **Training** - Keep support team updated

This comprehensive user management system ensures secure, scalable, and efficient administration of DomusAI users while maintaining compliance and security standards.
