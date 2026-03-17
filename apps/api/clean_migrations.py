import os
import shutil
import sys

def clean_migrations():
    """Clean up the migrations/versions directory by removing all migration files except custom_migration.py."""
    versions_dir = os.path.join('migrations', 'versions')
    
    if not os.path.exists(versions_dir):
        print(f"Directory {versions_dir} does not exist.")
        return
    
    # Get all files in the versions directory
    files = os.listdir(versions_dir)
    
    # Keep only custom_migration.py
    for file in files:
        if file != 'custom_migration.py':
            file_path = os.path.join(versions_dir, file)
            if os.path.isfile(file_path):
                print(f"Removing migration file: {file}")
                os.remove(file_path)
    
    print("Migration files cleanup completed.")

if __name__ == "__main__":
    clean_migrations()
