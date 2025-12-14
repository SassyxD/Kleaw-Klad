# Contributing to Klaew Klad

Thank you for your interest in contributing to Klaew Klad! This document provides guidelines for contributing to the project.

## 🌊 Project Overview

Klaew Klad is an AI-powered flood forecasting and evacuation system for Hat Yai, Thailand, built for the Huawei MindSpore AI Innovation Competition.

## 🤝 How to Contribute

### Reporting Issues
- Use GitHub Issues
- Include clear description, steps to reproduce, expected vs actual behavior
- Add screenshots for UI issues
- Tag appropriately: `bug`, `enhancement`, `documentation`

### Feature Requests
- Check existing issues first
- Describe the problem your feature would solve
- Outline the proposed solution
- Consider implementation complexity

### Code Contributions

1. **Fork the Repository**
```bash
git fork https://github.com/your-org/Kleaw-Klad
git clone https://github.com/your-username/Kleaw-Klad
cd Kleaw-Klad
```

2. **Create a Feature Branch**
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/bug-description
```

3. **Follow Conventional Commits**
```
feat: add evacuation route optimization
fix: resolve JWT token expiration issue
docs: update API documentation
style: format code with prettier
refactor: reorganize flood service structure
test: add unit tests for auth service
chore: update dependencies
```

4. **Write Quality Code**
- Follow existing code style
- Add comments for complex logic
- Include TypeScript types
- Write self-documenting code

5. **Test Your Changes**
```bash
# Frontend
cd frontend
npm run type-check
npm run lint

# Backend Platform
cd backend-platform
bun run dev  # Manual testing

# Backend AI
cd backend-ai
python -m pytest  # If tests exist
```

6. **Commit and Push**
```bash
git add .
git commit -m "feat: add real-time WebSocket flood updates"
git push origin feat/your-feature-name
```

7. **Create Pull Request**
- Clear title following conventional commits
- Detailed description of changes
- Reference related issues
- Add screenshots for UI changes
- Request review from maintainers

## 📋 Development Guidelines

### Frontend (Next.js)
- Use TypeScript strictly
- Follow React best practices (hooks, functional components)
- Keep components small and focused
- Use Tailwind CSS for styling
- Ensure mobile responsiveness
- Optimize images and assets

### Backend Platform (Bun + Elysia.js)
- RESTful API design
- Proper error handling
- Input validation with schemas
- JWT authentication for protected routes
- Clear API documentation
- Return consistent response formats

### Backend AI (Python + FastAPI)
- Type hints for all functions
- Pydantic models for validation
- Async/await for I/O operations
- Proper error handling
- Document model architectures
- Include performance metrics

### General Principles
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
- **SOLID**: Follow SOLID principles
- **Security First**: Validate all inputs, sanitize outputs
- **Performance**: Consider optimization for production

## 🧪 Testing

### Unit Tests
```bash
# Frontend
npm test

# Backend (when implemented)
pytest tests/
```

### Integration Tests
- Test API endpoints
- Verify database interactions
- Check AI model responses

### E2E Tests
- User flows (login → dashboard → actions)
- Cross-browser testing
- Mobile responsiveness

## 📚 Documentation

When adding features:
- Update API documentation in `docs/API.md`
- Update architecture diagrams if needed
- Add inline code comments
- Update README if necessary
- Create migration guides for breaking changes

## 🎨 Code Style

### TypeScript/JavaScript
```typescript
// Use descriptive names
const calculateFloodRisk = (waterLevel: number): number => {
  // Implementation
};

// Prefer const over let
const MAX_WATER_LEVEL = 3.0;

// Use async/await over promises
async function fetchFloodData() {
  const data = await apiClient.getCurrentFloodStatus();
  return data;
}
```

### Python
```python
# Follow PEP 8
def calculate_risk_score(node: Node, flood_mask: np.ndarray) -> float:
    """Calculate risk score for infrastructure node.
    
    Args:
        node: Infrastructure node
        flood_mask: Binary flood mask
        
    Returns:
        Risk score between 0 and 1
    """
    # Implementation
    pass

# Type hints
from typing import List, Dict, Optional
```

## 🔄 Git Workflow

```
main (production-ready)
  ├── develop (integration branch)
  │   ├── feat/feature-1
  │   ├── feat/feature-2
  │   └── fix/bug-fix-1
  └── hotfix/critical-bug
```

### Branch Naming
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks
- `hotfix/` - Critical production fixes

## 🚀 Release Process

1. Merge `develop` into `main`
2. Tag release: `v1.0.0`
3. Generate changelog
4. Deploy to production
5. Monitor for issues

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Featured in project documentation

## 📞 Getting Help

- GitHub Discussions for questions
- Discord/Slack channel (if available)
- Email: support@klaewklad.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, helps improve flood safety for Hat Yai residents. Your work makes a real difference!
