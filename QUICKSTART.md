# 🚀 Quick Start Guide

Get Klaew Klad running in 5 minutes!

## ⚡ Super Quick Start (3 commands)

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

---

## 📦 Step-by-Step Instructions

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- Zustand (state management)
- MapLibre GL (maps)
- Recharts (charts)
- Tailwind CSS
- TypeScript
- And all other dependencies

**Expected time**: 2-3 minutes

### 3. Set Up Environment Variables (Optional for demo)

```bash
cp .env.example .env.local
```

For basic demo, you can skip this step. For full functionality:

```bash
# Edit .env.local and add:
NEXT_PUBLIC_MAPTILER_KEY=get_free_key_from_maptiler.com
```

### 4. Run Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### 5. Open in Browser

Visit: **http://localhost:3000**

You should see the landing page with two options:
- **Executive Dashboard** → Click to view Page A
- **Operation Map** → Click to view Page B

---

## 🎯 What You'll See

### Landing Page (/)
Beautiful gradient page with:
- "Klaew Klad" branding
- Two role-selection cards
- Powered by Huawei MindSpore branding

### Executive Dashboard (/dashboard)
- System status cards (Normal/Alert/Critical)
- Rainfall prediction (24h forecast)
- People at risk counter
- Water level forecast chart
- District risk assessment
- AI recommendations panel

### Operation Map (/map)
- Full-screen interactive map
- Left sidebar with:
  - Monitor tab (flooded districts)
  - Simulation tab (time-travel slider)
- Right toolbar with layer controls
- Bottom evacuation planner

---

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution**: Make sure you have Node.js 18+ installed
```bash
node --version  # Should be v18.x.x or higher
```

### Issue: Port 3000 is already in use

**Solution**: Use a different port
```bash
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

### Issue: Maps not showing

**Reason**: Maptiler API key not set (expected for first run)

**Solution**:
1. Get free API key from https://cloud.maptiler.com/
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MAPTILER_KEY=your_key_here
   ```
3. Restart dev server

### Issue: "Module not found" errors

**Solution**: Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. ✅ **You are here**: Running the app locally
2. 📖 Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) to understand the design
3. 🛠️ Read [docs/PROJECT_SETUP_GUIDE.md](docs/PROJECT_SETUP_GUIDE.md) for detailed setup
4. 🏆 Read [docs/RECOMMENDATIONS_AND_IMPROVEMENTS.md](docs/RECOMMENDATIONS_AND_IMPROVEMENTS.md) for competition tips
5. 🔌 Connect to your backend APIs (see setup guide)
6. 🗺️ Add real Maptiler API key for map functionality
7. 🚀 Deploy to production (Vercel, Huawei Cloud, etc.)

---

## 🎓 Learning Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Zustand Guide](https://zustand-demo.pmnd.rs/)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🆘 Need Help?

- Check [docs/PROJECT_SETUP_GUIDE.md](docs/PROJECT_SETUP_GUIDE.md) troubleshooting section
- Open an issue on GitHub
- Contact the team

---

**Happy coding! 🎉**
