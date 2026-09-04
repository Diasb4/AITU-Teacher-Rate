#!/usr/bin/env python3
"""
generate_prepod_data.py
Generates rich AITU Rate My Professor data from dump_parsed.json.
"""
import json
import os
import random

TAG_METADATA = {
  "Best teacher": {"category": "positive", "emoji": "🏆", "desc": "Один из лучших преподавателей университета"},
  "Chill vibes": {"category": "positive", "emoji": "😎", "desc": "Комфортная атмосфера на парах и спокойное общение"},
  "Favourite teacher": {"category": "positive", "emoji": "❤️", "desc": "Любимец студентов потока"},
  "+swag +rep": {"category": "positive", "emoji": "🔥", "desc": "Максимальное уважение и авторитет"},
  "Fair game": {"category": "positive", "emoji": "⚖️", "desc": "Честное и прозрачное оценивание"},
  "Tough but fair": {"category": "neutral", "emoji": "🧐", "desc": "Требовательный, но ставит справедливые баллы"},
  "Respect is key": {"category": "neutral", "emoji": "🤝", "desc": "Ценит уважение и культуру общения"},
  "Attendance is key": {"category": "neutral", "emoji": "📌", "desc": "Очень важна посещаемость занятий"},
  "AI Strict": {"category": "warning", "emoji": "🤖", "desc": "Жестко проверяет работы на использование AI/ChatGPT"},
  "Hard grader": {"category": "warning", "emoji": "✍️", "desc": "Придирчиво проверяет домашние задания и рубежки"},
  "Psychological Horror": {"category": "danger", "emoji": "😱", "desc": "Сложнейший курс, готовьтесь не спать ночами"},
  "Pray for your Scholorship": {"category": "danger", "emoji": "🙏", "desc": "Высокий риск потерять стипендию на рубежке"},
  "You are cooked lil bro": {"category": "danger", "emoji": "💀", "desc": "Без упорного труда сдать практически невозможно"},
  "Retake": {"category": "danger", "emoji": "⚠️", "desc": "Многие студенты уходят на повторный курс (ретейк)"},
  "cringe": {"category": "warning", "emoji": "😬", "desc": "Специфическая подача материала"}
}

AVATAR_COLORS = [
  "#3B82F6", "#8B5CF6", "#10B981", "#EF4444", "#F59E0B", 
  "#06B6D4", "#EC4899", "#6366F1", "#14B8A6", "#84CC16"
]

SAMPLE_FEEDBACK_TEMPLATES = [
  ("Отличный преподаватель! Материал объясняет доступно, на лекциях не скучно. Если делать все домашки вовремя, сдать на А не составит труда.", 5, "A"),
  ("Очень комфортная атмосфера на парах. Всегда готов ответить на вопросы и разобрать сложные моменты из практики.", 5, "A-"),
  ("Требовательный, но справедливый. Списать не получится, прокторинг строгий, но знания дает отличные.", 4, "B+"),
  ("Много практики и реальных задач. Советую не пропускать лекции, так как на рубежке попадаются именно те нюансы, которые разбирались на паре.", 4, "B"),
  ("Сложный предмет и строгая проверка. Готовьтесь разбираться самостоятельно по презентациям и документации.", 3, "C+"),
  ("Очень жесткий прокторинг, проверяет каждое движение глаз. Сдать реально, только если выучить всё наизусть.", 3, "B-"),
  ("Придирчив к оформлению кода и отчетов. За малейшее использование ИИ без объяснений сразу снижает баллы.", 3, "C"),
  ("Преподаватель с огромным опытом. Главное — проявлять активность и вовремя сдавать лабы.", 5, "A")
]

def get_initials(name):
    parts = name.strip().split()
    if len(parts) >= 2:
        return f"{parts[0][0]}{parts[1][0]}".upper()
    elif len(parts) == 1 and len(parts[0]) > 0:
        return parts[0][:2].upper()
    return "??"

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dump_path = os.path.join(base_dir, 'dump_parsed.json')
    out_dir = os.path.join(base_dir, 'src', 'data')
    os.makedirs(out_dir, exist_ok=True)

    with open(dump_path, 'r', encoding='utf-8') as f:
        dump = json.load(f)

    ap_list = dump.get('approved_professors', [])
    ta_list = dump.get('teaching_assignments', [])

    ta_map = {}
    for ta in ta_list:
        name = ta.get('teacherName', '').strip()
        if name:
            key = name.lower()
            if key not in ta_map:
                ta_map[key] = {
                    'name': name,
                    'disciplines': list(set(ta.get('disciplines', []))),
                    'groups': list(set(ta.get('groups', [])))
                }
            else:
                ta_map[key]['disciplines'] = list(set(ta_map[key]['disciplines'] + ta.get('disciplines', [])))
                ta_map[key]['groups'] = list(set(ta_map[key]['groups'] + ta.get('groups', [])))

    professors = []
    ap_names = set()

    for idx, ap in enumerate(ap_list):
        name = ap.get('name', '').strip()
        if not name:
            continue
        key = name.lower()
        ap_names.add(key)
        ta = ta_map.get(key)
        disciplines = ta['disciplines'] if ta else []
        groups = ta['groups'] if ta else []

        teaching_rating = float(ap.get('teaching_rating') or 4.0)
        teaching_count = int(ap.get('teaching_count') or 1)
        proctoring_rating = float(ap.get('proctoring_rating') or 4.0)
        proctoring_count = int(ap.get('proctoring_count') or 1)
        tags = ap.get('top_tags') or []

        # Generate realistic initial reviews for professors
        num_reviews = min(max(1, teaching_count), 4)
        reviews = []
        for r_idx in range(num_reviews):
            template = random.choice(SAMPLE_FEEDBACK_TEMPLATES)
            disc = random.choice(disciplines) if disciplines else "Общий курс"
            grp = random.choice(groups) if groups else "IT-2401"
            reviews.append({
                "id": f"rev-{idx}-{r_idx}",
                "author": f"Студент группы {grp}",
                "date": f"2026-0{random.randint(1, 3)}-{random.randint(10, 28)}",
                "rating": template[1],
                "grade": template[2],
                "discipline": disc,
                "text": template[0],
                "tags": [random.choice(tags)] if tags else ["Fair game"],
                "likes": random.randint(1, 24)
            })

        professors.append({
            "id": ap.get('id') or f"prof-{idx+1:04d}",
            "name": name,
            "initials": get_initials(name),
            "avatar_bg": random.choice(AVATAR_COLORS),
            "department": ap.get('department') or 'Astana IT University',
            "teaching_rating": round(teaching_rating, 1),
            "teaching_count": teaching_count,
            "proctoring_rating": round(proctoring_rating, 1),
            "proctoring_count": proctoring_count,
            "top_tags": tags,
            "disciplines": disciplines,
            "groups": groups,
            "reviews": reviews
        })

    # Add remaining teachers from teaching assignments
    for key, ta in ta_map.items():
        if key not in ap_names:
            name = ta['name']
            idx = len(professors) + 1
            professors.append({
                "id": f"prof-{idx:04d}",
                "name": name,
                "initials": get_initials(name),
                "avatar_bg": random.choice(AVATAR_COLORS),
                "department": 'Astana IT University',
                "teaching_rating": 4.0,
                "teaching_count": 2,
                "proctoring_rating": 3.5,
                "proctoring_count": 2,
                "top_tags": ["Fair game"],
                "disciplines": ta['disciplines'],
                "groups": ta['groups'],
                "reviews": [
                    {
                        "id": f"rev-{idx}-0",
                        "author": f"Студент {random.choice(ta['groups']) if ta['groups'] else 'AITU'}",
                        "date": "2026-02-14",
                        "rating": 4,
                        "grade": "B+",
                        "discipline": random.choice(ta['disciplines']) if ta['disciplines'] else "Дисциплина",
                        "text": "Спокойный преподаватель, оценивает строго по критериям силлабуса.",
                        "tags": ["Fair game"],
                        "likes": 5
                    }
                ]
            })

    # Compile unique disciplines dictionary with teaching professors
    disciplines_dict = {}
    for prof in professors:
        for d in prof['disciplines']:
            if d not in disciplines_dict:
                disciplines_dict[d] = {
                    "name": d,
                    "professorsCount": 0,
                    "professorIds": [],
                    "avgRating": 0.0
                }
            disciplines_dict[d]["professorsCount"] += 1
            disciplines_dict[d]["professorIds"].append(prof['id'])

    disciplines_list = sorted(disciplines_dict.values(), key=lambda x: x['professorsCount'], reverse=True)

    # Save outputs
    with open(os.path.join(out_dir, 'professors_rating.json'), 'w', encoding='utf-8') as f:
        json.dump(professors, f, ensure_ascii=False, indent=2)

    with open(os.path.join(out_dir, 'disciplines.json'), 'w', encoding='utf-8') as f:
        json.dump(disciplines_list, f, ensure_ascii=False, indent=2)

    with open(os.path.join(out_dir, 'tags.json'), 'w', encoding='utf-8') as f:
        json.dump(TAG_METADATA, f, ensure_ascii=False, indent=2)

    print(f"Generated {len(professors)} professors, {len(disciplines_list)} disciplines in {out_dir}")

if __name__ == '__main__':
    main()
