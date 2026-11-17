# Course Combinator v2.0 (Winter 2027 Edition)

A class schedule planner for Ahmedabad University students that generates valid, conflict-free course schedule combinations.

> [!NOTE]
> **Credits & Acknowledgements**:
> This project was originally created by **[Jeel Rajodiya](https://github.com/JeelRajodiya)** for freshman CSE100 at Ahmedabad University and has served over 1,000 students.
> - Upstream Repository: [JeelRajodiya/AU-ClassCombinator](https://github.com/JeelRajodiya/AU-ClassCombinator)
> - Live Demo: [classcombinator.vercel.app](https://classcombinator.vercel.app)
> 
> All core application code, UI/UX architecture, backtracking combinator algorithms, and database models are credited to **Jeel Rajodiya**.

---

### What's New in This Fork (Winter 2027 Update)

Updated and maintained by **[Ansh Mehta](https://github.com/anshmehta-20)**:
- **Winter 2027 Course Directory**: Added the complete Ahmedabad University Winter 2027 course catalog dataset (`Course_Directory_Winter_2027.xlsx` and `courses.json`) containing 328 courses with updated sections, slot timings, faculty allocations, and date ranges.
- **Automated Excel Parser**: Added `parser/parse_excel.py` using OpenPyXL to automatically parse and validate the official Auris Excel course directory exports directly into schema-compliant JSON for MongoDB synchronization.
- **Updated Default Semesters**: Updated frontend store defaults and UI fallbacks to **Winter 2027**.

---

## Features

- **Conflict Detection**: Checks pairwise section time clashes using 5-minute slot bitmasks and academic calendar day bitmasks.
- **Arc Consistency & Backtracking**: Employs AC-3 constraint satisfaction and backtracking algorithms to quickly find all clash-free timetable combinations.
- **Dynamic Semester Switching**: Supports browsing and combining schedules across semesters.
- **Local Storage State**: Automatically preserves selected courses and preferences across sessions.

---

## Getting Started

### Prerequisites

- Node.js (v18+) and npm / pnpm
- Python 3.9+
- MongoDB instance (local or MongoDB Atlas)

### Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/anshmehta-20/AU-ClassCombinator.git
   cd AU-ClassCombinator
   ```

2. **Environment Configuration**:
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## Data Ingestion & Parser

To update or re-parse the course directory data:

```bash
# Install python parser dependencies
pip install openpyxl jsonschema pymongo python-dotenv

# Parse Winter 2027 Excel Directory into validated courses.json
python3 parser/parse_excel.py Course_Directory_Winter_2027.xlsx -o parser/courses.json --semester Winter --year 2027

# Push to MongoDB
python3 parser/sync_to_db.py parser/courses.json
```

---

## Attribution & Credits

- **Original Creator & Lead Developer**: [Jeel Rajodiya](https://github.com/JeelRajodiya)
- **Winter 2027 Data & Parser Update**: [Ansh Mehta](https://github.com/anshmehta-20)
- **Course Data**: [Ahmedabad University Auris Portal](https://auris.ahduni.edu.in)

If you find this project helpful, please give a star to both the [original repository](https://github.com/JeelRajodiya/AU-ClassCombinator) and this [fork](https://github.com/anshmehta-20/AU-ClassCombinator)!
