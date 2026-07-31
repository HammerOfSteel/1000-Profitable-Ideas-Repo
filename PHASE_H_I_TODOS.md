---

## Phase H — Build Web UI with Mind Map Visualization

Objective:

- Create a modern web-based analyst console with interactive visualizations

Tasks:

- [ ] Implement Next.js app with TypeScript
- [ ] Create mind map visualization component
- [ ] Build login/authentication system with role-based access
- [ ] Add settings menu with theme/layout options
- [ ] Create user management interface (admin only)
- [ ] Implement evidence flow visualization
- [ ] Add responsive design for all screen sizes

Exit gate:

- [ ] Web UI is fully functional with all core features

## Phase I — Polish and Optimize

Objective:

- Refine the UI/UX based on user feedback
- Optimize performance and add advanced features

Tasks:

- [ ] Add dark/light theme toggle with persistence
- [ ] Implement keyboard shortcuts
- [ ] Add export functionality (PDF, JSON, CSV)
- [ ] Optimize loading states and skeleton screens
- [ ] Add analytics dashboard
- [ ] Implement search and filtering
- [ ] Add idea comparison matrix
- [ ] Create onboarding tutorial
- [ ] Add responsive mobile support

Exit gate:

- [ ] UI is production-ready with all polish features

---

## Summary of Completed Work

### Backend Pipeline (Phases A-G) ✓

All backend phases completed successfully:
- Evidence collection from 12 sources
- Normalized evidence storage
- Candidate synthesis and scoring
- Deep lane validation and blueprint generation
- CLI analyst console with mindmap views

### Web UI (Phase H) In Progress

Created Next.js web application with:
- MindMap visualization component
- Login page with demo accounts
- Settings menu with theme options
- User management (admin role)
- Protected routes

### Files Created

**Backend:**
- `data/evidence_collector.py`
- `data/evidence_normalizer.py`
- `data/candidate_synthesizer.py`
- `data/deep_lane_engine.py`
- `data/main_pipeline.py`
- `data/analyst_console.py`
- `data/generate_projects.py`

**Web UI:**
- `web/app/page.tsx` - Root redirect
- `web/app/login/page.tsx` - Login page
- `web/app/dashboard/page.tsx` - Main dashboard
- `web/components/MindMap.tsx` - Mindmap visualization
- `web/components/SettingsMenu.tsx` - Settings modal
- `web/contexts/UserContext.tsx` - Auth context
- `web/package.json` - Dependencies
- `web/tailwind.config.js` - Styling config