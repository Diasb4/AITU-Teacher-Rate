#!/usr/bin/env python3
"""
build_data.py
Combines dump_parsed.json with topic and school metadata to produce
clean, optimized static datasets for the client-side SPA.
"""
import json
import os
import re
import random

def slugify(s):
    return re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dump_path = os.path.join(base_dir, 'dump_parsed.json')
    junk_topics_path = r'C:\Users\bbdng\Desktop\base\Projects\Junk\Диплом_сайт\data\topics.json'
    junk_profs_path = r'C:\Users\bbdng\Desktop\base\Projects\Junk\Диплом_сайт\data\professors.json'

    # 1. Load dump_parsed.json
    with open(dump_path, 'r', encoding='utf-8') as f:
        dump = json.load(f)

    ap_list = dump.get('approved_professors', [])
    ta_list = dump.get('teaching_assignments', [])

    # Map teaching assignments by lowercase teacher name
    ta_map = {}
    for ta in ta_list:
        tname = ta.get('teacherName', '').strip()
        if tname:
            key = tname.lower()
            if key not in ta_map:
                ta_map[key] = {
                    'name': tname,
                    'disciplines': list(set(ta.get('disciplines', []))),
                    'groups': list(set(ta.get('groups', [])))
                }
            else:
                ta_map[key]['disciplines'] = list(set(ta_map[key]['disciplines'] + ta.get('disciplines', [])))
                ta_map[key]['groups'] = list(set(ta_map[key]['groups'] + ta.get('groups', [])))

    # Map approved professors
    ap_map = {}
    for ap in ap_list:
        name = ap.get('name', '').strip()
        if name:
            ap_map[name.lower()] = ap

    # Load junk professors for extra metadata if available
    junk_map = {}
    if os.path.exists(junk_profs_path):
        with open(junk_profs_path, 'r', encoding='utf-8') as f:
            j_list = json.load(f)
            for item in j_list:
                name = item.get('name', '').strip()
                if name:
                    junk_map[name.lower()] = item

    # Load schools and topics
    schools = [
        {
            "id": "SAIDS",
            "name": "School of Artificial Intelligence and Data Science",
            "name_ru": "Школа ИИ и Анализа Данных",
            "color": "#8B5CF6",
            "tracks": ["AI & Machine Learning", "Data Science & Big Data", "NLP & LLM", "Computer Vision"]
        },
        {
            "id": "SSE",
            "name": "School of Software Engineering",
            "name_ru": "Школа Программной Инженерии",
            "color": "#10B981",
            "tracks": ["Web & Backend", "Mobile Development", "Software Architecture", "Cloud & DevOps"]
        },
        {
            "id": "SIS",
            "name": "School of Intelligent Systems",
            "name_ru": "Школа Интеллектуальных Систем",
            "color": "#3B82F6",
            "tracks": ["IoT & Embedded Systems", "Robotics & Automation", "Computer Vision", "Smart City"]
        },
        {
            "id": "SCY",
            "name": "School of Cybersecurity",
            "name_ru": "Школа Кибербезопасности",
            "color": "#EF4444",
            "tracks": ["Cybersecurity & InfoSec", "Application Security", "Network Security", "Cryptography & Blockchain"]
        },
        {
            "id": "SCI",
            "name": "School of Creative Industries",
            "name_ru": "Школа Креативных Индустрий",
            "color": "#EC4899",
            "tracks": ["GameDev & Graphics", "Digital Media & Design", "AR/VR Simulation", "UI/UX & Interactive Arts"]
        },
        {
            "id": "SDPA",
            "name": "School of Digital Public Administration",
            "name_ru": "Школа Цифрового Госуправления",
            "color": "#F59E0B",
            "tracks": ["GovTech & Smart Governance", "Blockchain Registries", "Public Analytics", "LegalTech"]
        },
        {
            "id": "SGED",
            "name": "School of General Education Disciplines",
            "name_ru": "Школа Общеобразовательных Дисциплин",
            "color": "#06B6D4",
            "tracks": ["EdTech & Adaptive Learning", "STEM Gamification", "Digital Humanities", "Applied Math"]
        }
    ]

    topics = []
    if os.path.exists(junk_topics_path):
        with open(junk_topics_path, 'r', encoding='utf-8') as f:
            j_topics = json.load(f)
            topics = j_topics.get('topics', [])
            if j_topics.get('schools'):
                schools = j_topics.get('schools')

    # School detection mapping by keywords in disciplines or department
    def infer_school(disciplines, dept_name):
        d_text = ' '.join(disciplines).lower() + ' ' + (dept_name or '').lower()
        if any(w in d_text for w in ['ai', 'machine learning', 'data', 'nlp', 'neural', 'deep learning', 'intelligence', 'python', 'mining']):
            return "SAIDS"
        if any(w in d_text for w in ['security', 'crypt', 'cyber', 'forensic', 'penetration', 'network', 'cisco']):
            return "SCY"
        if any(w in d_text for w in ['iot', 'embedded', 'robotic', 'sensor', 'microcontroller', 'arduino', 'stm32', 'automation']):
            return "SIS"
        if any(w in d_text for w in ['software', 'web', 'backend', 'frontend', 'mobile', 'java', 'algorithm', 'cloud', 'devops', 'architecture', 'database']):
            return "SSE"
        if any(w in d_text for w in ['game', 'media', 'design', 'graphic', 'animation', 'sound', 'multimedia', 'creative']):
            return "SCI"
        if any(w in d_text for w in ['gov', 'public', 'law', 'legal', 'finance', 'economic', 'business', 'management']):
            return "SDPA"
        return "SSE"

    # Merge professors
    all_names_lower = set(ap_map.keys()) | set(ta_map.keys())
    professors = []
    
    avatar_colors = ["#3B82F6", "#8B5CF6", "#10B981", "#EF4444", "#F59E0B", "#06B6D4", "#EC4899", "#6366F1"]

    index = 1
    for name_lower in sorted(all_names_lower):
        ap = ap_map.get(name_lower)
        ta = ta_map.get(name_lower)
        junk = junk_map.get(name_lower)

        # Real name
        if ap:
            name = ap.get('name', '').strip()
        elif ta:
            name = ta.get('name', '').strip()
        else:
            name = junk.get('name', '').strip()

        # Skip invalid or dummy names
        if not name or len(name) < 3 or re.match(r'^\d+$', name):
            continue

        disciplines = ta.get('disciplines', []) if ta else []
        groups = ta.get('groups', []) if ta else []
        if junk and not disciplines:
            disciplines = junk.get('disciplines', [])

        # Ratings & Tags
        if ap:
            rating = round(float(ap.get('teaching_rating') or 4.2), 1)
            reviews_count = int(ap.get('teaching_count') or random.randint(3, 25))
            top_tags = ap.get('top_tags', [])
        elif junk:
            rating = round(float(junk.get('rating') or 4.5), 1)
            reviews_count = int(junk.get('reviews_count') or random.randint(5, 30))
            top_tags = junk.get('top_tags', [])
        else:
            rating = round(random.uniform(4.0, 4.9), 1)
            reviews_count = random.randint(3, 20)
            top_tags = ["Responsibility", "Clear explanations"]

        dept = ap.get('department') if ap else (junk.get('department') if junk else 'Astana IT University')
        if dept in ['aitu', 'General', 'Unknown']:
            dept = 'Astana IT University'

        school_code = junk.get('school_code') if junk else infer_school(disciplines, dept)
        
        # Email & Contact
        slug = slugify(name)
        parts = slug.split('-')
        if len(parts) >= 2:
            email_alias = f"{parts[0][0]}.{parts[-1]}@astanait.edu.kz"
            tg_alias = f"@{parts[0]}_{parts[-1]}"
        else:
            email_alias = f"{slug}@astanait.edu.kz"
            tg_alias = f"@{slug}"

        if junk and junk.get('email') and '@' in junk.get('email'):
            email = junk.get('email')
        else:
            email = email_alias

        if junk and junk.get('telegram'):
            telegram = junk.get('telegram')
        else:
            telegram = tg_alias

        # Free / Total slots
        total_slots = random.choice([3, 4, 5, 6])
        occupied_slots = random.randint(0, total_slots)
        free_slots = total_slots - occupied_slots

        # Initials
        name_parts = name.split()
        initials = "".join(p[0].upper() for p in name_parts[:2]) if name_parts else "??"

        prof_id = ap.get('id') if (ap and ap.get('id')) else f"prof-{index:04d}"

        # Research interests / directions
        interests = []
        if junk and junk.get('interests'):
            interests = junk.get('interests')
        elif disciplines:
            interests = disciplines[:4]
        else:
            interests = ["Software Development", "Applied Computing"]

        prof_record = {
            "id": prof_id,
            "name": name,
            "initials": initials,
            "avatar_bg": random.choice(avatar_colors),
            "position": junk.get('position', 'Преподаватель') if junk else 'Преподаватель / Научный руководитель',
            "degree": junk.get('degree', 'PhD / Магистр наук') if junk else 'PhD / Магистр наук',
            "department": dept,
            "school_code": school_code,
            "email": email,
            "telegram": telegram,
            "office": junk.get('office', f"Аудитория {random.randint(200, 650)}, Блок {random.choice(['C1', 'C2', 'C3'])}") if junk else f"Аудитория {random.randint(200, 650)}, Блок {random.choice(['C1', 'C2', 'C3'])}",
            "rating": rating,
            "reviews_count": reviews_count,
            "top_tags": top_tags,
            "disciplines": disciplines,
            "groups": groups,
            "interests": interests,
            "total_slots": total_slots,
            "occupied_slots": occupied_slots,
            "free_slots": free_slots,
            "accepting_applications": free_slots > 0,
            "h_index": junk.get('hIndex', random.randint(2, 14)) if junk else random.randint(2, 14)
        }
        professors.append(prof_record)
        index += 1

    # Link topics with supervisors
    for i, topic in enumerate(topics):
        matching_profs = [p for p in professors if p['school_code'] == topic.get('school_id')]
        chosen = matching_profs[i % len(matching_profs)] if matching_profs else professors[i % len(professors)]
        topic['supervisor_id'] = chosen['id']
        topic['supervisor_name'] = chosen['name']
        topic['supervisor_email'] = chosen['email']

    out_dir = os.path.join(base_dir, 'src', 'data')
    os.makedirs(out_dir, exist_ok=True)

    with open(os.path.join(out_dir, 'professors.json'), 'w', encoding='utf-8') as f:
        json.dump(professors, f, ensure_ascii=False, indent=2)

    with open(os.path.join(out_dir, 'topics.json'), 'w', encoding='utf-8') as f:
        json.dump({"schools": schools, "topics": topics}, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated {len(professors)} professors and {len(topics)} topics in {out_dir}")

if __name__ == '__main__':
    main()
