# import re
# from datetime import datetime
# import requests
# from bs4 import BeautifulSoup
# import spacy
# from rake_nltk import Rake
# from transformers import pipeline
# import logging

# logging.basicConfig(level=logging.DEBUG)
# nlp = spacy.load("en_core_web_sm")

# def detect_outdated(content):
#     doc = nlp(content)
#     outdated = []
#     current_year = datetime.now().year
#     for ent in doc.ents:
#         if ent.label_ == "DATE":
#             year_match = re.search(r'\d{4}', ent.text)
#             if year_match and int(year_match.group()) < current_year:
#                 outdated.append((ent.text, ent.start_char, ent.end_char))
#         elif ent.label_ in ["CARDINAL", "PERCENT", "QUANTITY"]:
#             outdated.append((ent.text, ent.start_char, ent.end_char))
#     return outdated

# def extract_keywords(content):
#     try:
#         r = Rake()
#         r.extract_keywords_from_text(content)
#         return r.get_ranked_phrases()[:10]
#     except Exception as e:
#         logging.error(f"Keyword extraction failed: {str(e)}")
#         return []

# def fetch_current_trends(topic, current_year):
#     query = f"top {topic} {current_year} site:forbes.com OR site:g2.com OR site:capterra.com"
#     url = f"https://www.google.com/search?q={query}"
#     headers = {"User-Agent": "Mozilla/5.0"}
#     try:
#         response = requests.get(url, headers=headers, timeout=5)
#         if response.status_code != 200:
#             return [f"Mock trend: AI-powered {topic} dominate in {current_year}."]
#         soup = BeautifulSoup(response.text, "html.parser")
#         snippets = []
#         for div in soup.find_all("div", class_="BNeawe s3v9rd AP7Wnd"):
#             text = div.get_text()
#             if text and len(text) > 50:
#                 snippets.append(text)
#         return snippets[:5] or [f"Mock trend: AI-powered {topic} dominate in {current_year}."]
#     except Exception:
#         return [f"Mock trend: AI-powered {topic} dominate in {current_year}."]

# def update_content(content, title, outdated, trends, old_keywords, topic):
#     current_year = str(datetime.now().year)
#     for old, start, end in outdated:
#         if re.match(r'\d{4}', old):
#             content = content[:start] + current_year + content[end:]

#     trends_str = " ".join(trends)
#     new_keywords = ", ".join(old_keywords[:5] + [f"best {topic} {current_year}", f"AI-powered {topic}"])

#     try:
#         generator = pipeline("text2text-generation", model="google/flan-t5-base")
#     except Exception as e:
#         return None, None, str(e)

#     title_prompt = f"Rewrite this title to be SEO-friendly with keywords '{new_keywords}' and current year {current_year}: {title}"
#     updated_title = generator(title_prompt, max_length=50)[0]['generated_text']

#     chunks = [content[i:i+500] for i in range(0, len(content), 500)]
#     updated_chunks = []
#     for chunk in chunks:
#         prompt = f"Update this blog content to be SEO-friendly, replace outdated info with: {trends_str}, incorporate keywords: {new_keywords}, preserve tone: {chunk}"
#         updated_chunk = generator(prompt, max_length=256)[0]['generated_text']
#         updated_chunks.append(updated_chunk)

#     updated_content = " ".join(updated_chunks)
#     return updated_title, updated_content, None

# def update_meta_tags(meta_tags, new_keywords, updated_title, updated_content):
#     if "description" in meta_tags:
#         new_desc = re.sub(r'\s+', ' ', updated_content[:150]) + "..."
#         meta_tags["description"] = new_desc
#     if "keywords" in meta_tags:
#         meta_tags["keywords"] = new_keywords
#     meta_tags["title"] = updated_title
#     return meta_tags


import re
import logging
from datetime import datetime
import spacy
from rake_nltk import Rake
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch
import random

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Load Hugging Face model + tokenizer
MODEL_NAME = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

# Device setup (GPU if available)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)


# Generate text with variation
def generate_text(prompt, max_length=256, temperature=0.7, top_p=0.9):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(
        **inputs,
        max_length=max_length,
        do_sample=True,
        temperature=temperature,
        top_p=top_p,
        num_return_sequences=1,
        pad_token_id=tokenizer.eos_token_id
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


# Detect outdated entities (years, numbers)
def detect_outdated(content):
    doc = nlp(content)
    outdated = []
    current_year = datetime.now().year
    for ent in doc.ents:
        if ent.label_ == "DATE":
            year_match = re.search(r"\d{4}", ent.text)
            if year_match and int(year_match.group()) < current_year:
                outdated.append((ent.text, ent.start_char, ent.end_char))
        elif ent.label_ in ["CARDINAL", "PERCENT", "QUANTITY"]:
            outdated.append((ent.text, ent.start_char, ent.end_char))
    return outdated


# Extract SEO keywords
def extract_keywords(content):
    try:
        r = Rake()
        r.extract_keywords_from_text(content)
        return r.get_ranked_phrases()[:10]
    except Exception as e:
        logging.error(f"Keyword extraction failed: {str(e)}")
        return []


# Fetch trends (mock for now, replace with live scraping later)
def fetch_current_trends(topic, current_year):
    base_trends = [
        f"AI-powered {topic} tools are revolutionizing the industry in {current_year}.",
        f"Top {topic} strategies to boost your business in {current_year}.",
        f"Emerging trends in {topic} for {current_year} include automation and personalization.",
        f"How {topic} is evolving with new technologies in {current_year}.",
        f"Best practices for {topic} in {current_year} to stay ahead of competition."
    ]
    random.shuffle(base_trends)
    return base_trends[:3]


# Update title + content
def update_content(content, title, outdated, trends, old_keywords, topic):
    current_year = str(datetime.now().year)

    # Replace outdated years
    for old, start, end in outdated:
        if re.match(r"\d{4}", old):
            content = content[:start] + current_year + content[end:]

    trends_str = " ".join(trends)
    new_keywords = ", ".join(old_keywords[:5] + [f"best {topic} {current_year}", f"AI-powered {topic}"])

    # SEO Title
    title_prompt = (
        f"Rewrite this title to be SEO-friendly with keywords '{new_keywords}' "
        f"and current year {current_year}: {title}"
    )
    updated_title = generate_text(title_prompt, max_length=50, temperature=0.8, top_p=0.9)

    # SEO Content
    chunk_size = 500
    chunks = [content[i:i+chunk_size] for i in range(0, len(content), chunk_size)]
    updated_chunks = []
    for chunk in chunks:
        prompt = (
            f"Update this blog content to be SEO-friendly, replace outdated info with: {trends_str}, "
            f"incorporate keywords: {new_keywords}, preserve original tone: {chunk}"
        )
        updated_chunk = generate_text(prompt, max_length=256, temperature=0.8, top_p=0.9)
        updated_chunks.append(updated_chunk)

    updated_content = " ".join(updated_chunks)
    return updated_title, updated_content, None


# Update meta tags
def update_meta_tags(meta_tags, new_keywords, updated_title, updated_content):
    if "description" in meta_tags:
        new_desc = re.sub(r"\s+", " ", updated_content[:150]) + "..."
        meta_tags["description"] = new_desc
    if "keywords" in meta_tags:
        meta_tags["keywords"] = new_keywords
    meta_tags["title"] = updated_title
    return meta_tags
