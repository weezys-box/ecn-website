import os

def rename_subfolders(base_dir):
    # Iterate over items in the specified directory
    for item in os.listdir(base_dir):
        item_path = os.path.join(base_dir, item)
        # Only process directories
        if os.path.isdir(item_path):
            # Check if the folder name contains double underscores
            if "__" in item:
                new_name = item.replace("__", "_")
                new_path = os.path.join(base_dir, new_name)
                try:
                    os.rename(item_path, new_path)
                    print(f"Renamed: {item_path} -> {new_path}")
                except Exception as e:
                    print(f"Error renaming {item_path}: {e}")

if __name__ == "__main__":
    # Define the directory relative to your current directory (which is 'public')
    target_directory = "scraped_news_images"
    if os.path.exists(target_directory) and os.path.isdir(target_directory):
        rename_subfolders(target_directory)
    else:
        print(f"Directory '{target_directory}' not found in the current directory.")
