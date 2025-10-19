# PickMyFit 

**Find it. Love it. Wear it.**

An AI-powered personal stylist that curates fashion recommendations based on your style preferences. Built with React, TypeScript, and OpenAI integration.

## 🌐 Live Demo

**[https://pick-my-start.vercel.app](https://pick-my-start.vercel.app)** ✨

*Currently running with rule-based recommendations. AI features available on request.*

## Features

- **Smart Questionnaire**: 5-question style assessment (name, favorite color, daily wear, age, preferred combinations)
- **Smart Recommendations**: Rule-based scoring with optional AI enhancement (OpenAI integration ready)
- **Multi-Retailer Support**: Ready for Myntra, Ajio, Amazon Fashion APIs
- **Dark/Light Theme**: Professional UI with theme persistence
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Personalized Results**: Greets users by name and shows tailored picks

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI**: OpenAI GPT-4o-mini for style analysis (optional enhancement)
- **Serverless**: Vercel Edge Functions
- **Styling**: CSS Variables with theme system
- **State Management**: React Hooks

## Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd retail-stylist

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## AI Integration

### Local Development (No API Key)
The app works out of the box with rule-based recommendations. AI features are disabled by default.

### Enable AI Re-ranking

1. **Get OpenAI API Key**: Sign up at [OpenAI Platform](https://platform.openai.com)

2. **Local Development**:
   ```bash
   # Create .env.local
   echo "VITE_ENABLE_AI=true" >> .env.local
   echo "OPENAI_API_KEY=your_key_here" >> .env.local
   
   # Run with Vercel CLI (serves API routes)
   npm i -g vercel
   vercel dev
   ```

3. **Production Deployment**:
   - Deploy to Vercel
   - Add environment variables in project settings:
     - `VITE_ENABLE_AI=true`
     - `OPENAI_API_KEY=your_key_here`

## Project Structure

```
retail-stylist/
├── api/
│   └── rerank.ts              # Serverless AI re-ranking function
├── src/
│   ├── modules/
│   │   ├── components/
│   │   │   ├── Questionnaire.tsx  # Style preference form
│   │   │   └── Results.tsx        # Product recommendations grid
│   │   └── services/
│   │       └── recommendation.ts  # Core logic & mock data
│   ├── App.tsx                # Main app component
│   ├── main.tsx              # React entry point
│   └── style.css             # Theme system & component styles
├── package.json
└── README.md
```

## How It Works

1. **User Input**: Collects style preferences via questionnaire
2. **Local Filtering**: Rule-based scoring filters relevant products
3. **AI Enhancement**: (Optional) OpenAI re-ranks results for personal fit
4. **Results Display**: Shows top 8 recommendations with retailer links

### Recommendation Algorithm

```typescript
// Rule-based scoring (always active)
- Color match: +3 points
- Category match: +2 points  
- Style combo hints: +3 points
- Age-based preferences: +1 point

// AI re-ranking (when enabled)
- Sends top 20 candidates to OpenAI
- Returns personalized ranking with reasons
- Falls back to local scoring on API failure
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git remote add origin <your-github-repo>
   git push -u origin master
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - New Project → Import your repo
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

3. **Environment Variables** (in Vercel dashboard):
   ```
   VITE_ENABLE_AI=true
   OPENAI_API_KEY=your_key_here
   ```

### Alternative Hosting
- **Netlify**: Drag `dist/` folder or connect GitHub
- **Cloudflare Pages**: Connect repo, build command `npm run build`
- **GitHub Pages**: Static hosting (no serverless functions)

## Retailer Integration

Currently uses mock data. Ready for integration with:

- **Myntra API**: Fashion marketplace
- **Ajio API**: Lifestyle products  
- **Amazon Fashion**: Global catalog

### Integration Points

```typescript
// Extend this interface in recommendation.ts
export interface RetailerProvider {
  search(query: string): Promise<Product[]>
}

// Implementation example
class MyntraProvider implements RetailerProvider {
  async search(query: string): Promise<Product[]> {
    // Call Myntra search API
    // Normalize to Product interface
  }
}
```

## Business Model

- **Affiliate Commissions**: 2-8% on purchases through recommendations
- **Premium Subscriptions**: Advanced styling, seasonal updates
- **Brand Partnerships**: Featured placements, sponsored content
- **Data Insights**: Anonymized trend reports for fashion brands

## Market Opportunity

- **India Fashion E-commerce**: ₹1.3L crores, growing 25% annually
- **Target Audience**: 18-35 year olds struggling with choice overload
- **Problem**: 2-3 hours per shopping session, 40% return rate
- **Solution**: Personalized discovery in under 2 minutes

## Contributing

We're looking for co-founders and contributors! Areas of focus:

- **Business Development**: Retailer partnerships, revenue strategy
- **Design/UX**: User experience, brand identity
- **AI/ML**: Recommendation improvements, personalization
- **Marketing**: User acquisition, content strategy

## Roadmap

### Phase 1 (Month 1)
- [ ] Real retailer API integration
- [ ] User accounts and preferences
- [ ] Analytics and A/B testing
- [ ] Mobile app (React Native)

### Phase 2 (Month 2-3)
- [ ] Advanced filters (price, size, brand)
- [ ] Social features (sharing, reviews)
- [ ] Subscription model
- [ ] Influencer partnerships

### Phase 3 (Month 4-6)
- [ ] Computer vision (upload photos)
- [ ] Seasonal collections
- [ ] Multi-city expansion
- [ ] Series A fundraising

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contact

**Founder**: [Your Name]  
**Email**: [your.email@domain.com]  
**LinkedIn**: [Your LinkedIn Profile]  
**Demo**: [Live App URL]

---

**Built with ❤️ for fashion lovers who want to find their perfect style.**
