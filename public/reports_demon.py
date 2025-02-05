import os
import pymysql
from datetime import datetime
from pdf2image import convert_from_path

# Database Configuration
DB_HOST = "your_db_host"
DB_USER = "your_db_user"
DB_PASS = "your_db_password"
DB_NAME = "your_db_name"

# Directory Paths
BASE_DIR = os.getcwd()  # Current directory
REPORTS_DIR = os.path.join(BASE_DIR, "reports")  # Reports folder
IMAGE_DIR = os.path.join(BASE_DIR, "thumbnails")  # Save images here

# Ensure image directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)

# Connect to MySQL
def connect_db():
    return pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME)

# Process Reports
reports_data = []

for file in os.listdir(REPORTS_DIR):
    if file.endswith(".pdf"):
        pdf_path = os.path.join(REPORTS_DIR, file)
        
        # Convert first page to JPG
        images = convert_from_path(pdf_path, first_page=1, last_page=1, poppler_path=r"C:/poppler-24.08.0/Library/bin")

        if images:
            image_filename = file.replace(".pdf", ".jpg")
            image_path = os.path.join(IMAGE_DIR, image_filename)

            # Use forward slashes for image path
            image_path = image_path.replace("\\", "/")
            images[0].save(image_path, "JPEG")

            # Static download path (without unique ID)
            download_path = f"../reports/{file}"

            # Use forward slashes for download path
            download_path = download_path.replace("\\", "/")

            # Store in reports_data list
            reports_data.append((file.replace(".pdf", ""), download_path, image_path, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

# Generate SQL Insert Statements File
sql_file = "bulk_insert_reports.py"
with open(sql_file, "w") as f:
    f.write("INSERT INTO reports (title, download_path, image_path, published_date) VALUES\n")
    values = ",\n".join([f"('{title}', '{download}', '{image}', '{date}')" for title, download, image, date in reports_data])
    f.write(values + ";")

print(f"SQL file '{sql_file}' generated successfully.")
