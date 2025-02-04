import os
from pdf2image import convert_from_path
from pathlib import Path

def extract_first_page_as_image(input_pdf_path, output_image_path):
    # Full path to pdftoppm executable
    poppler_path = r'C:\poppler-24.08.0\Library\bin'

    # Convert the first page of the PDF to an image
    images = convert_from_path(input_pdf_path, first_page=1, last_page=1, poppler_path=poppler_path)

    # Ensure the paper_first_page directory exists
    output_subdir = os.path.dirname(output_image_path)
    if not os.path.exists(output_subdir):
        os.makedirs(output_subdir)

    # Save the first image as a JPG file
    output_image_path_jpg = output_image_path.replace('.pdf', '.jpg')
    images[0].save(output_image_path_jpg, 'JPEG')

    # Generate the URL path for the first page image
    filename = os.path.basename(output_image_path_jpg)
    url_path = f"/paper_first_page/{filename}"

    # Return the URL path and download path
    download_path = f"/paper/{os.path.basename(input_pdf_path)}"
    return url_path, download_path

def generate_sql_statements(papers_directory):
    sql_statements = []

    # List all PDFs in the 'papers' directory
    for filename in os.listdir(papers_directory):
        if filename.endswith(".pdf"):
            input_pdf_path = os.path.join(papers_directory, filename)
            output_image_path = os.path.join(papers_directory, 'paper_first_page', f'first_page_{filename}')

            # Extract the first page as a JPG and get the URL and download paths
            url_path, download_path = extract_first_page_as_image(input_pdf_path, output_image_path)

            # Create the SQL statement for each paper
            sql_statement = f"INSERT INTO papers (title, url_path, download_path) VALUES ('{filename}', '{url_path}', '{download_path}');\n"
            sql_statements.append(sql_statement)

    # Write SQL statements to a .py file
    with open("populate_papers.py", "w") as f:
        f.write("import sqlite3\n\n")
        f.write("def insert_data():\n")
        f.write("    conn = sqlite3.connect('your_database.db')\n")
        f.write("    cursor = conn.cursor()\n")
        f.write("    try:\n")
        
        for stmt in sql_statements:
            f.write(f"        cursor.execute(\"{stmt.strip()}\")\n")
        
        f.write("\n")
        f.write("    conn.commit()\n")
        f.write("    conn.close()\n")
        f.write("\n")
        f.write("if __name__ == '__main__':\n")
        f.write("    insert_data()\n")

    print("SQL populate file 'populate_papers.py' has been generated.")

def main():
    # Define the directories
    current_dir = os.getcwd()
    paper_dir = os.path.join(current_dir, 'papers')
    output_dir = os.path.join(current_dir, 'paper_first_page')
    
    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Generate SQL statements for all PDFs in the 'papers' directory
    generate_sql_statements(paper_dir)
    
if __name__ == "__main__":
    main()
