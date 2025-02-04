import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

# Base URL of the website
base_url = "https://energy.gov.ng/news_events.php"

# Folder to save images
base_folder = "scraped_news_images"
os.makedirs(base_folder, exist_ok=True)

# Get the webpage content
response = requests.get(base_url)
if response.status_code != 200:
    print(f"Failed to fetch {base_url}, status code: {response.status_code}")
    exit()

# Parse the webpage content
soup = BeautifulSoup(response.text, 'html.parser')

# Find the first news block
news_block = soup.find("div", class_="news1")  # Adjust class name if needed

if not news_block:
    print("No news block found.")
    exit()

# Extract the title
title = news_block.find("strong").get_text(strip=True)

# Find and visit the "Read More" link
read_more_link = news_block.find("a", string="Read More")["href"]
news_url = f"https://energy.gov.ng/{read_more_link}"
news_response = requests.get(news_url)

if news_response.status_code != 200:
    print(f"Failed to fetch {news_url}, status code: {news_response.status_code}")
    exit()

# Parse the news page
news_soup = BeautifulSoup(news_response.text, 'html.parser')

# Extract the content (all text within <p> tags)
content = "\n".join([p.get_text(strip=True) for p in news_soup.find_all("p")])

# Assign a publication date (current timestamp for the most recent news)
published_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Extract all images, starting from the 4th one
images = news_soup.find_all("img")
image_paths = []
for idx, img in enumerate(images[4:7]):  # Start from the 4th and limit to 3 images
    img_url = img["src"]
    if not img_url.startswith("http"):
        img_url = f"https://energy.gov.ng/{img_url}"
    img_response = requests.get(img_url, stream=True)
    if img_response.status_code == 200:
        # Ensure valid folder name
        safe_title = "".join(c if c.isalnum() or c.isspace() else "_" for c in title)
        safe_title = safe_title.strip().replace(" ", "_")

        # Create a unique folder for the news
        news_folder = os.path.join(base_folder, safe_title)
        os.makedirs(news_folder, exist_ok=True)

        # Save the image
        image_path = os.path.join(news_folder, f"image_{idx + 1}.jpg")
        with open(image_path, "wb") as f:
            f.write(img_response.content)
        image_paths.append(image_path)

# Prepare image paths for SQL insert (ensure NULL is properly handled)
image_1 = f"'{image_paths[0]}'" if len(image_paths) > 0 else 'NULL'
image_2 = f"'{image_paths[1]}'" if len(image_paths) > 1 else 'NULL'
image_3 = f"'{image_paths[2]}'" if len(image_paths) > 2 else 'NULL'

# Escape single quotes in title and content
title = title.replace("'", "''")  # Escape single quotes
content = content.replace("'", "''")  # Escape single quotes

# Construct SQL query
sql = (
    f"INSERT INTO news (title, content, published_at, image_1, image_2, image_3) VALUES ("
    f"'{title}', '{content}', '{published_at}', {image_1}, {image_2}, {image_3});"
)

# Save SQL statement to a file
with open("news_inserts_final.sql", "w", encoding="utf-8") as sql_file:
    sql_file.write(sql)

print("First news scraping and SQL generation completed.")
