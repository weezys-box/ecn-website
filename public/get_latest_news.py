import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_news(pages_to_extract):
    base_url = "https://energy.gov.ng/news_events.php"
    base_folder = "scraped_news_images"
    os.makedirs(base_folder, exist_ok=True)
    
    for page in range(1, pages_to_extract + 1):
        print(f"Extracting page {page}...")
        response = requests.get(f"{base_url}?page={page}")
        if response.status_code != 200:
            print(f"Failed to fetch page {page}, status code: {response.status_code}")
            continue
        
        soup = BeautifulSoup(response.text, 'html.parser')
        news_blocks = soup.find_all("div", class_="news1")  # Adjust class if needed
        
        for news_block in news_blocks:
            title = news_block.find("strong").get_text(strip=True)
            read_more_link = news_block.find("a", string="Read More")
            if not read_more_link:
                continue
            
            news_url = f"https://energy.gov.ng/{read_more_link['href']}"
            news_response = requests.get(news_url)
            if news_response.status_code != 200:
                print(f"Failed to fetch {news_url}, status code: {news_response.status_code}")
                continue
            
            news_soup = BeautifulSoup(news_response.text, 'html.parser')
            content = "\n".join([p.get_text(strip=True) for p in news_soup.find_all("p")])
            published_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            images = news_soup.find_all("img")
            image_paths = []
            for idx, img in enumerate(images[4:7]):
                img_url = img["src"]
                if not img_url.startswith("http"):
                    img_url = f"https://energy.gov.ng/{img_url}"
                
                img_response = requests.get(img_url, stream=True)
                if img_response.status_code == 200:
                    safe_title = "".join(c if c.isalnum() or c.isspace() else "_" for c in title).strip().replace(" ", "_")
                    news_folder = os.path.join(base_folder, safe_title)
                    os.makedirs(news_folder, exist_ok=True)
                    
                    image_path = os.path.join(news_folder, f"image_{idx + 1}.jpg")
                    with open(image_path, "wb") as f:
                        f.write(img_response.content)
                    image_paths.append(image_path)
            
            image_1 = f"'{image_paths[0]}'" if len(image_paths) > 0 else 'NULL'
            image_2 = f"'{image_paths[1]}'" if len(image_paths) > 1 else 'NULL'
            image_3 = f"'{image_paths[2]}'" if len(image_paths) > 2 else 'NULL'
            
            title = title.replace("'", "''")
            content = content.replace("'", "''")
            
            sql = (
                f"INSERT INTO news (title, content, published_at, image_1, image_2, image_3) VALUES ("
                f"'{title}', '{content}', '{published_at}', {image_1}, {image_2}, {image_3});"
            )
            
            with open("news_inserts_final.sql", "a", encoding="utf-8") as sql_file:
                sql_file.write(sql + "\n")
            
            print(f"Scraped and saved: {title}")
    
if __name__ == "__main__":
    pages = int(input("How many pages do you want to extract? "))
    scrape_news(pages)
