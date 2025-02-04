import os
import datetime

# Directory containing the papers
papers_directory = "public/papers"

# Output file for the SQL script
output_sql_file = "populate_papers.sql"

# Function to sanitize SQL strings
def sanitize(value):
    return value.replace("'", "''")

# List to hold SQL insert statements
sql_statements = []

# Iterate through files in the directory
for filename in os.listdir(papers_directory):
    # Get full path
    file_path = os.path.join(papers_directory, filename)
    
    # Skip directories, focus only on files
    if os.path.isfile(file_path):
        # Extract file title without extension
        title = os.path.splitext(filename)[0]
        
        # Placeholder data for author and description
        # author = "Unknown Author"
        # description = "Automatically generated description."
        
        # Use current date as the published date
        published_date = datetime.date.today().strftime('%Y-%m-%d')
        
        # Sanitize inputs
        title = sanitize(title)
        # description = sanitize(description)
        file_path = sanitize(file_path)
        
        # Build the SQL statement
        sql = f"INSERT INTO papers (title, published_date, download_path) " \
              f"VALUES ('{title}', '{published_date}', '{file_path}');"
        
        # Add to list
        sql_statements.append(sql)

# Write all SQL statements to the output file
with open(output_sql_file, "w") as f:
    f.write("\n".join(sql_statements))

print(f"SQL script generated and saved to {output_sql_file}")
