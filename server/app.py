import os
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from bs4 import BeautifulSoup
import re
import matplotlib.pyplot as plt 
import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from googleapiclient.discovery import build
from fpdf import FPDF


# Google Search API Setup
API_KEY = 'AIzaSyC9ziRxhBq7fTL7-0HII4Ol2OtLAi34j3c'
CSE_ID = 'f74b55b08ce5a4bd2'

app = Flask(__name__)
CORS(app, supports_credentials=True)

def google_search(query, api_key, cse_id, num=2):
    """Perform a Google search and return the top num results."""
    service = build("customsearch", "v1", developerKey=api_key)
    res = service.cse().list(q=query, cx=cse_id, num=num).execute()
    return res.get('items', [])

def extract_text_from_url(url):
    """Scrape and extract text from a given URL."""
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        for script in soup(["script", "style"]):
            script.extract()  # Remove JavaScript and CSS

        text = soup.get_text()
        text = re.sub(r'\s+', ' ', text)  # Remove extra whitespace
        return text.strip()
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def calculate_cosine_similarity(text1, text2):
    """Calculate the cosine similarity between two texts."""
    vectorizer = TfidfVectorizer()
    vector1 = vectorizer.fit_transform([text1])
    vector2 = vectorizer.transform([text2])
    cosine_sim = cosine_similarity(vector1, vector2)[0][0]
    return cosine_sim

def detect_plagiarism(content, api_key, cse_id):
    """Detect plagiarism by querying portions of the content using Google Search."""
    plagiarized_sources = []
    total_similarity_score = 0
    total_sentences = 0

    sentences = content.split('. ')

    for sentence in sentences:
        if len(sentence.strip()) > 15:  # Only search meaningful sentences
            print(f"Searching for: {sentence.strip()[:20]}...")  # Print part of the sentence being searched
            search_results = google_search(sentence.strip(), api_key, cse_id)

            for result in search_results:
                url = result['link']
                page_text = extract_text_from_url(url)

                if page_text:
                    cosine_sim = calculate_cosine_similarity(sentence.strip(), page_text)
                    total_similarity_score += cosine_sim
                    total_sentences += 1

                    if cosine_sim > 0.5:  # Adjust the threshold as needed
                        plagiarized_sources.append({
                            'sentence': sentence.strip(),
                            'source_url': url,
                            'source_title': result['title'],
                            'similarity_score': cosine_sim
                        })

    average_similarity_score = (total_similarity_score / total_sentences) * 100 if total_sentences > 0 else 0
    return plagiarized_sources, average_similarity_score

def generate_similarity_chart(plagiarized_sources):
    """Generate a bar chart showing similarity scores for each plagiarized source."""
    if plagiarized_sources:
        urls = [entry['source_url'] for entry in plagiarized_sources]
        scores = [entry['similarity_score'] for entry in plagiarized_sources]
        shortened_urls = [url if len(url) <= 30 else url[:30] + '...' for url in urls]

        plt.figure(figsize=(10, 6))
        plt.bar(shortened_urls, scores, color='blue')
        plt.ylabel('Similarity Score')
        plt.title('Similarity Scores by URL')
        plt.xticks(rotation=45, ha="right", fontsize=8)
        plt.tight_layout()

        chart_file = 'similarity_chart.png'
        plt.savefig(chart_file)
        plt.close()
        return chart_file
    return None

def generate_pie_chart(average_similarity_score):
    """Generate a pie chart for the average similarity score."""
    labels = ['Original', 'Plagiarized']
    sizes = [100 - average_similarity_score, average_similarity_score]
    colors = ['green', 'red']
    explode = (0, 0.1)

    plt.figure (figsize=(6, 6))
    plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%', shadow=True, startangle=140)
    plt.axis('equal')

    pie_chart_file = 'average_similarity_pie_chart.png'
    plt.savefig(pie_chart_file)
    plt.close()
    return pie_chart_file
def generate_pdf_report(content, plagiarized_sources, average_similarity_score, chart_file, pie_chart_file):
    """Generate a plagiarism report in PDF format."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", style='B', size=16)
    pdf.cell(200, 10, txt="Plagiarism Report", ln=True, align='C')
    pdf.ln(5)

    if pie_chart_file:
        pdf.set_font("Arial", style='B', size=12)
        pdf.cell(200, 10, txt="Plagiarism Breakdown:", ln=True, align='C')
        pdf.image(pie_chart_file, x=55, w=100)
        pdf.ln(5)

    pdf.set_font("Arial", style='B', size=12)
    pdf.multi_cell(0, 10, txt="Uploaded Content:", align='L')
    pdf.set_font("Arial", size=12)
    pdf.ln(5)
    pdf.multi_cell(0, 10, txt=content, align='L')
    pdf.ln(5)

    if plagiarized_sources:
        pdf.set_font("Arial", style='B', size=12)
        pdf.multi_cell(0, 10, txt="Sources for Plagiarized Sections:", align='L')
        pdf.ln(5)
        pdf.set_font("Arial", size=12)

        for entry in plagiarized_sources:
            pdf.set_font("Arial", style='B', size=12)
            pdf.multi_cell(0, 10, txt="Sentence:", align='L')
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, txt=f"{entry['sentence']}", align='L')
            pdf.set_font("Arial", style='B', size=12)
            pdf.multi_cell(0, 10, txt="Source:", align='L')
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, txt=f"{entry['source_title']} - {entry['source_url']}", align='L')
            pdf.set_font("Arial", style='B', size=12)
            pdf.multi_cell(0, 10, txt="Similarity Score:", align='L')
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, txt=f"{entry['similarity_score']:.2f}", align='L')
            pdf.ln(5)

    pdf_file_path = "plagiarism_report.pdf"
    pdf.output(pdf_file_path)
    return pdf_file_path
@app.route('/api/detect-plagiarism', methods=['POST'])
def plagiarism_check():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data.get('text')
    if not text.strip():
        return jsonify({"error": "Text is empty"}), 400

    # Save the text to sample.txt
    with open('sample.txt', 'w', encoding='utf-8') as file:
        file.write(text)

    # Perform plagiarism detection
    plagiarized_sources, average_similarity_score = detect_plagiarism(text, API_KEY, CSE_ID)
    chart_file = generate_similarity_chart(plagiarized_sources)
    pie_chart_file = generate_pie_chart(average_similarity_score)
    pdf_file_path = generate_pdf_report(text, plagiarized_sources, average_similarity_score, chart_file, pie_chart_file)

    try:
        # Return the PDF file and similarity score as part of the response directly
        response = send_file(pdf_file_path, as_attachment=True)
        response.headers['Content-Disposition'] = 'attachment; filename=plagiarism_report.pdf'
        response.headers['average-similarity-score'] = f"{average_similarity_score:.2f}"
        return response
    except Exception as e:
        print(f"Error sending file: {e}")
        return jsonify({"error": "Failed to generate report"}), 500


if __name__ == '__main__':
    app.run(port=5000) 