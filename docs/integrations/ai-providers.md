# AI Provider Integrations

DomusAI supports multiple AI providers, allowing users to choose the best model for their specific needs. This guide covers setup and configuration for all supported providers.

## 🤖 Supported Providers

### OpenAI
- **Models**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, GPT-4 Vision
- **Features**: Chat, embeddings, function calling, vision
- **Pricing**: Pay-per-token
- **Rate Limits**: Tier-based

### Anthropic Claude
- **Models**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Features**: Long context, analysis, coding
- **Pricing**: Pay-per-token
- **Rate Limits**: Request-based

### Google AI
- **Models**: Gemini Pro, Gemini Pro Vision, PaLM 2
- **Features**: Multimodal, reasoning, code generation
- **Pricing**: Free tier + pay-per-use
- **Rate Limits**: Generous free tier

### Azure OpenAI
- **Models**: GPT-4, GPT-3.5, Embeddings
- **Features**: Enterprise security, compliance
- **Pricing**: Committed use discounts
- **Rate Limits**: Configurable

### Mistral AI
- **Models**: Mistral 7B, Mixtral 8x7B, Mistral Medium/Large
- **Features**: Multilingual, efficient
- **Pricing**: Competitive rates
- **Rate Limits**: Flexible

### Additional Providers
- **Groq** - Ultra-fast inference
- **Perplexity** - Search-augmented responses
- **OpenRouter** - Access to multiple models
- **Local Models** - Ollama integration

## 🔑 API Key Setup

### OpenAI Configuration

1. **Get API Key:**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create account or sign in
   - Navigate to API Keys section
   - Create new secret key

2. **Add to DomusAI:**
   ```env
   OPENAI_API_KEY=sk-...your_key_here
   OPENAI_ORGANIZATION_ID=org-...your_org_id (optional)
   ```

3. **User Configuration:**
   - Go to Profile Settings
   - Add OpenAI API Key
   - Test connection

**Environment Variables:**
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION_ID=org-...
OPENAI_BASE_URL=https://api.openai.com/v1 (optional)
```

### Anthropic Claude Setup

1. **Get API Key:**
   - Visit [Anthropic Console](https://console.anthropic.com/)
   - Create account and verify
   - Generate API key

2. **Configuration:**
   ```env
   ANTHROPIC_API_KEY=sk-ant-...your_key_here
   ```

3. **Model Access:**
   - Claude 3 models require approval
   - Check model availability in console
   - Monitor usage and limits

### Google AI Configuration

1. **Setup:**
   - Visit [Google AI Studio](https://makersuite.google.com/)
   - Create or select project
   - Enable Generative AI API
   - Generate API key

2. **Environment Setup:**
   ```env
   GOOGLE_GEMINI_API_KEY=...your_key_here
   ```

3. **Model Selection:**
   - Gemini Pro for text
   - Gemini Pro Vision for images
   - Configure safety settings

### Azure OpenAI Setup

1. **Azure Resource:**
   - Create Azure OpenAI resource
   - Deploy models (GPT-4, GPT-3.5)
   - Note endpoint and keys

2. **Configuration:**
   ```env
   AZURE_OPENAI_API_KEY=...your_key
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   
   # Model Deployment IDs
   AZURE_OPENAI_GPT4_DEPLOYMENT_ID=gpt-4
   AZURE_OPENAI_GPT35_DEPLOYMENT_ID=gpt-35-turbo
   AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_ID=text-embedding-ada-002
   ```

3. **User Setup:**
   - Enable "Use Azure OpenAI" in profile
   - Add deployment IDs
   - Configure endpoint

### Mistral AI Configuration

1. **API Access:**
   - Sign up at [Mistral AI](https://mistral.ai/)
   - Get API key from dashboard
   - Choose subscription plan

2. **Setup:**
   ```env
   MISTRAL_API_KEY=...your_key_here
   ```

## 🔧 Model Configuration

### Model Selection

Each provider offers different models with varying capabilities:

```typescript
// Model configuration example
const modelConfig = {
  openai: {
    'gpt-4': {
      contextLength: 8192,
      maxTokens: 4096,
      temperature: 0.7,
      supportsFunctions: true,
      supportsVision: false
    },
    'gpt-4-vision-preview': {
      contextLength: 128000,
      maxTokens: 4096,
      temperature: 0.7,
      supportsFunctions: false,
      supportsVision: true
    }
  },
  anthropic: {
    'claude-3-opus-20240229': {
      contextLength: 200000,
      maxTokens: 4096,
      temperature: 0.7,
      supportsFunctions: false,
      supportsVision: true
    }
  }
}
```

### Default Settings

Configure default models per workspace:

```sql
-- Set workspace default model
UPDATE workspaces 
SET default_model = 'gpt-4',
    default_temperature = 0.7,
    default_context_length = 8192
WHERE id = 'workspace_uuid';
```

### Model Fallbacks

Configure fallback models for reliability:

```typescript
const modelFallbacks = {
  'gpt-4': ['gpt-4-turbo', 'gpt-3.5-turbo'],
  'claude-3-opus': ['claude-3-sonnet', 'claude-3-haiku'],
  'gemini-pro': ['gpt-3.5-turbo']
}
```

## 📊 Usage Monitoring

### Token Tracking

Monitor token usage across providers:

```sql
-- Token usage by provider
SELECT 
  model,
  COUNT(*) as requests,
  SUM(prompt_tokens) as prompt_tokens,
  SUM(completion_tokens) as completion_tokens,
  SUM(prompt_tokens + completion_tokens) as total_tokens
FROM messages 
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND model IS NOT NULL
GROUP BY model
ORDER BY total_tokens DESC;
```

### Cost Estimation

Calculate costs based on provider pricing:

```typescript
const providerPricing = {
  'gpt-4': {
    promptPrice: 0.03 / 1000,    // $0.03 per 1K tokens
    completionPrice: 0.06 / 1000  // $0.06 per 1K tokens
  },
  'claude-3-opus': {
    promptPrice: 0.015 / 1000,
    completionPrice: 0.075 / 1000
  },
  'gemini-pro': {
    promptPrice: 0.0005 / 1000,
    completionPrice: 0.0015 / 1000
  }
}

function calculateCost(model: string, promptTokens: number, completionTokens: number) {
  const pricing = providerPricing[model]
  if (!pricing) return 0
  
  return (promptTokens * pricing.promptPrice) + 
         (completionTokens * pricing.completionPrice)
}
```

### Rate Limit Management

Handle rate limits gracefully:

```typescript
class RateLimitManager {
  private limits = new Map<string, RateLimit>()
  
  async checkLimit(provider: string): Promise<boolean> {
    const limit = this.limits.get(provider)
    if (!limit) return true
    
    return limit.canMakeRequest()
  }
  
  updateLimit(provider: string, headers: Record<string, string>) {
    // Update rate limit info from response headers
    const remaining = parseInt(headers['x-ratelimit-remaining'] || '0')
    const reset = parseInt(headers['x-ratelimit-reset'] || '0')
    
    this.limits.set(provider, new RateLimit(remaining, reset))
  }
}
```

## 🔒 Security Best Practices

### API Key Management

1. **Environment Variables:**
   - Store keys in environment variables
   - Never commit keys to version control
   - Use different keys for dev/prod

2. **Key Rotation:**
   - Rotate keys regularly (monthly)
   - Monitor for unauthorized usage
   - Revoke compromised keys immediately

3. **Access Control:**
   - Limit key permissions where possible
   - Use organization-level controls
   - Monitor usage patterns

### Request Security

```typescript
// Secure API request handling
class SecureAPIClient {
  private apiKey: string
  private baseURL: string
  
  constructor(apiKey: string, baseURL: string) {
    this.apiKey = this.validateKey(apiKey)
    this.baseURL = baseURL
  }
  
  private validateKey(key: string): string {
    if (!key || key.length < 20) {
      throw new Error('Invalid API key')
    }
    return key
  }
  
  async makeRequest(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'DomusAI/1.0'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return response.json()
  }
}
```

## 🚀 Performance Optimization

### Response Streaming

Implement streaming for better UX:

```typescript
async function streamResponse(model: string, messages: any[]) {
  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true
  })
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}
```

### Caching Strategy

Cache responses for repeated queries:

```typescript
class ResponseCache {
  private cache = new Map<string, CachedResponse>()
  
  generateKey(model: string, messages: any[]): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify({ model, messages }))
      .digest('hex')
  }
  
  get(key: string): CachedResponse | null {
    const cached = this.cache.get(key)
    if (!cached || Date.now() > cached.expiresAt) {
      this.cache.delete(key)
      return null
    }
    return cached
  }
  
  set(key: string, response: any, ttl: number = 3600000) {
    this.cache.set(key, {
      response,
      expiresAt: Date.now() + ttl
    })
  }
}
```

### Load Balancing

Distribute requests across providers:

```typescript
class LoadBalancer {
  private providers: Provider[]
  private currentIndex = 0
  
  async getNextProvider(): Promise<Provider> {
    // Round-robin selection
    const provider = this.providers[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.providers.length
    
    // Check if provider is healthy
    if (await provider.isHealthy()) {
      return provider
    }
    
    // Find next healthy provider
    return this.findHealthyProvider()
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**API Key Errors:**
```
Error: Invalid API key
Solution: Verify key format and permissions
```

**Rate Limit Exceeded:**
```
Error: Rate limit exceeded
Solution: Implement exponential backoff
```

**Model Not Available:**
```
Error: Model not found
Solution: Check model availability and spelling
```

### Error Handling

```typescript
class APIErrorHandler {
  static handle(error: any, provider: string) {
    switch (error.status) {
      case 401:
        throw new Error(`Invalid API key for ${provider}`)
      case 429:
        throw new Error(`Rate limit exceeded for ${provider}`)
      case 503:
        throw new Error(`${provider} service unavailable`)
      default:
        throw new Error(`${provider} API error: ${error.message}`)
    }
  }
}
```

### Health Checks

Monitor provider availability:

```typescript
async function checkProviderHealth(provider: string): Promise<boolean> {
  try {
    const response = await fetch(`${provider.baseURL}/health`, {
      timeout: 5000
    })
    return response.ok
  } catch {
    return false
  }
}
```

## 📈 Analytics and Reporting

### Usage Analytics

Track provider performance:

```sql
-- Provider performance metrics
SELECT 
  model,
  AVG(response_time_ms) as avg_response_time,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN error IS NULL THEN 1 END) as successful_requests,
  (COUNT(CASE WHEN error IS NULL THEN 1 END) * 100.0 / COUNT(*)) as success_rate
FROM api_requests 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY model
ORDER BY total_requests DESC;
```

### Cost Analysis

Monitor spending across providers:

```typescript
function generateCostReport(startDate: Date, endDate: Date) {
  return {
    totalCost: calculateTotalCost(startDate, endDate),
    costByProvider: getCostByProvider(startDate, endDate),
    costByModel: getCostByModel(startDate, endDate),
    projectedMonthlyCost: projectMonthlyCost(),
    recommendations: getCostOptimizationTips()
  }
}
```

This comprehensive integration guide ensures optimal setup and management of AI providers in DomusAI, maximizing performance while maintaining security and cost efficiency.
