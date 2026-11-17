# Usage

The parser folder contains code to parse course directory data from Excel (.xlsx) or HTML files into structured JSON and push that data into the MongoDB database.

The project uses `uv` (or standard `pip`) for managing python packages.

To install the required packages:

```bash
uv sync
# or with pip:
pip install openpyxl jsonschema pymongo python-dotenv
```

### Parsing Excel Files (e.g. Course_Directory_Winter_2027.xlsx)

To parse an Auris Excel course directory and validate against schema:

```bash
python3 parser/parse_excel.py Course_Directory_Winter_2027.xlsx -o parser/courses.json --semester Winter --year 2027
```

### Parsing HTML Files

To parse an Auris HTML course directory file:

```bash
uv run parser2.py courses.html -o courses.json
```

### Syncing to MongoDB

Push the parsed JSON data to the database:

```bash
python3 parser/sync_to_db.py parser/courses.json
```

Make sure your MongoDB environment variables are configured in `.env`:
- `MONGO_URI`
- `CLIENT_DB`
- `CLIENT_COLLECTION`
