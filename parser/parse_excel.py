import argparse
import json
import os
import re
from datetime import datetime
from collections import defaultdict
import openpyxl
from jsonschema import validate

def convert_date(date_str):
    """Converts a DD-MM-YYYY date to YYYY-MM-DD (ISO format)."""
    try:
        return datetime.strptime(date_str, '%d-%m-%Y').strftime('%Y-%m-%d')
    except (ValueError, TypeError):
        return None

def generate_five_minute_bitmask(day, start_time, end_time):
    """
    Generates a 2016-bit binary string representing a time slot in the week.
    Each bit represents 5 minutes.
    """
    day_map = {
        'Mon': 0,
        'Tue': 1,
        'Wed': 2,
        'Thu': 3,
        'Fri': 4,
        'Sat': 5,
        'Sun': 6
    }
    bitmask = ['0'] * 2016
    day_offset = day_map.get(day, 0)
    
    start_hour, start_minute = map(int, start_time.split(':'))
    end_hour, end_minute = map(int, end_time.split(':'))
    
    start_total_minutes = start_hour * 60 + start_minute
    end_total_minutes = end_hour * 60 + end_minute
    
    day_bit_offset = day_offset * 288
    start_bit_in_day = start_total_minutes // 5
    end_bit_in_day = end_total_minutes // 5
    
    start_bit = day_bit_offset + start_bit_in_day
    end_bit = day_bit_offset + end_bit_in_day
    
    for i in range(start_bit, end_bit):
        if i < 2016:
            bitmask[i] = '1'
            
    return ''.join(bitmask)

def generate_one_day_bitmask(start_date_str, end_date_str):
    """
    Generates a 366-bit binary string representing which days of the academic year
    a course runs. The academic year starts on August 1st (bit 0).
    """
    if not start_date_str or not end_date_str:
        return '0' * 366
        
    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except (ValueError, TypeError):
        return '0' * 366
        
    bitmask = ['0'] * 366
    
    # Determine the academic year start (August 1st of the appropriate year)
    if start_date.month < 8:
        academic_year_start = datetime(start_date.year - 1, 8, 1)
    else:
        academic_year_start = datetime(start_date.year, 8, 1)
        
    start_day_offset = (start_date - academic_year_start).days
    end_day_offset = (end_date - academic_year_start).days
    
    for day in range(start_day_offset, end_day_offset + 1):
        if 0 <= day < 366:
            bitmask[day] = '1'
            
    return ''.join(bitmask)

def parse_schedule_text(schedule_text):
    """
    Parses the schedule text from an Excel cell into a list of section objects.
    Format: Section 1 | 08:00-09:30 (Wed) (04-01-2027 to 18-04-2027)
    """
    if not schedule_text:
        return []
    sched_clean = str(schedule_text).strip()
    if sched_clean in ['TBA', 'Not added', '']:
        return []
        
    section_groups = defaultdict(list)
    pattern = re.compile(
        r'Section\s+(\S+)\s*\|\s*([\d:]{5})-([\d:]{5})\s+\(([A-Za-z]+)\)\s+\(([\d]{2}-[\d]{2}-[\d]{4})\s+to\s+([\d]{2}-[\d]{2}-[\d]{4})\)'
    )
    
    for line in sched_clean.split('\n'):
        line = line.strip()
        if not line:
            continue
        match = pattern.search(line)
        if match:
            sec_id = match.group(1)
            st, et, day, s_date, e_date = match.group(2), match.group(3), match.group(4), match.group(5), match.group(6)
            section_groups[sec_id].append({
                'day': day,
                'startTime': st,
                'endTime': et,
                'startDate': convert_date(s_date),
                'endDate': convert_date(e_date),
            })

    sections = []
    # Sort section IDs naturally (1, 2, 3...)
    sorted_sec_ids = sorted(section_groups.keys(), key=lambda x: int(x) if x.isdigit() else x)
    
    for sec_id in sorted_sec_ids:
        slot_list = section_groups[sec_id]
        combined_five_min = 0
        date_masks = []
        starts = []
        ends = []
        slots_data = []
        seen_slots = set()
        
        for s in slot_list:
            slot_key = (s['day'], s['startTime'], s['endTime'])
            if slot_key not in seen_slots:
                seen_slots.add(slot_key)
                slots_data.append({
                    'day': s['day'],
                    'startTime': s['startTime'],
                    'endTime': s['endTime'],
                })
            
            # Combine 5-minute bitmask
            bm = generate_five_minute_bitmask(s['day'], s['startTime'], s['endTime'])
            combined_five_min |= int(bm, 2)
            
            # Combine one-day bitmask
            if s['startDate'] and s['endDate']:
                day_bm = generate_one_day_bitmask(s['startDate'], s['endDate'])
                date_masks.append(int(day_bm, 2))
                starts.append(s['startDate'])
                ends.append(s['endDate'])
        
        combined_day_int = 0
        for dm in date_masks:
            combined_day_int |= dm
            
        min_start = min(starts) if starts else "2027-01-01"
        max_end = max(ends) if ends else "2027-04-30"
        
        sections.append({
            'sectionId': sec_id,
            'quarter': None,
            'fiveMinuteBitMask': format(combined_five_min, '02016b'),
            'dateRange': {
                'start': min_start,
                'end': max_end,
                'oneDayBitMask': format(combined_day_int, '0366b'),
            },
            'slots': slots_data,
        })
        
    return sections

def parse_course_directory_excel(excel_path, default_semester="Winter", default_year=2027):
    """
    Parses a Course Directory Excel workbook into a list of course dictionaries.
    """
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    ws = wb.active
    
    header_row = [cell.value for cell in ws[1]]
    header_map = {}
    for idx, val in enumerate(header_row):
        if val:
            header_map[str(val).strip()] = idx
            
    # Auto-detect semester and year from filename if possible
    detected_sem = default_semester
    detected_year = default_year
    filename = os.path.basename(excel_path)
    fn_match = re.search(r'(Monsoon|Summer|Winter)[_-]?(\d{4})', filename, re.IGNORECASE)
    if fn_match:
        detected_sem = fn_match.group(1).capitalize()
        detected_year = int(fn_match.group(2))

    courses = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        code = row[header_map.get('Course Code', 0)]
        if not code:
            continue
        code = str(code).strip()
        
        name = row[header_map.get('Course Name', 1)]
        name = str(name).strip() if name else ""
        
        credits = row[header_map.get('Credits', 3)]
        credits_val = float(credits) if credits is not None else 0.0
        
        level = row[header_map.get('Level', 5)]
        level_str = str(level).strip() if level else "Undergraduate"
        if level_str.endswith(" Courses"):
            level_str = level_str[:-8].strip()
            
        term = row[header_map.get('Term', 6)]
        semester = str(term).strip() if term else detected_sem
        year = detected_year
        
        faculty = row[header_map.get('Faculty', 8)]
        if faculty:
            faculties = [
                re.sub(r'\s+', ' ', f).strip()
                for f in str(faculty).split(',')
                if f.strip() and "Not added" not in f
            ]
        else:
            faculties = []
            
        schedule = row[header_map.get('Schedule', 9)]
        sections = parse_schedule_text(schedule)
        
        prereq = row[header_map.get('Prerequisite Course', 10)]
        prereq_str = str(prereq).strip() if prereq else "None"
        
        antireq = row[header_map.get('Antirequisite Course', 11)]
        antireq_str = str(antireq).strip() if antireq else "None"
        
        ger = row[header_map.get('GER Categories', 12)]
        ger_cat = str(ger).strip() if ger and str(ger).strip() not in ['Not Applicable', 'None', ''] else None
        
        desc = row[header_map.get('Course Description', 13)]
        desc_str = str(desc).strip() if desc else ""
        
        course_doc = {
            "code": code,
            "name": name,
            "level": level_str,
            "credits": credits_val,
            "faculties": faculties,
            "semester": semester,
            "year": year,
            "prerequisite": prereq_str,
            "antirequisite": antireq_str,
            "description": desc_str,
            "gerCategory": ger_cat,
            "sections": sections,
        }
        courses.append(course_doc)
        
    return courses

def main():
    parser = argparse.ArgumentParser(description="Parse Course Directory Excel file into JSON format.")
    parser.add_argument("excel_file", help="Path to the Excel (.xlsx) file")
    parser.add_argument("-o", "--output", default="courses.json", help="Path to output JSON file (default: courses.json)")
    parser.add_argument("--semester", default="Winter", help="Semester name (default: Winter)")
    parser.add_argument("--year", type=int, default=2027, help="Academic year (default: 2027)")
    parser.add_argument("--no-validate", action="store_true", help="Skip schema validation")
    
    args = parser.parse_args()
    
    print(f"Reading course directory from: {args.excel_file}")
    courses = parse_course_directory_excel(args.excel_file, default_semester=args.semester, default_year=args.year)
    print(f"Parsed {len(courses)} courses.")
    
    if not args.no_validate:
        schema_path = os.path.join(os.path.dirname(__file__), "schema.json")
        if os.path.exists(schema_path):
            print(f"Validating against schema: {schema_path}")
            with open(schema_path, "r") as f:
                schema = json.load(f)
            validate(instance=courses, schema=schema)
            print("Schema validation successful!")
        else:
            print("Warning: schema.json not found, skipping validation.")
            
    with open(args.output, "w") as f:
        json.dump(courses, f, indent=2)
    print(f"Successfully saved to: {args.output}")

if __name__ == "__main__":
    main()
