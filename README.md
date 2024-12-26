# Obsidian scripts

## Purpose

The repository consist of useful scripts utilizing obsidian API and 'Templater' plugin, which essentially gives the ability to run the API inside obsidian notes.  
(You could say that, the templater plugin is much more powerful that that and can serve different puproses)

> **NOTE:** The scripts are never updated manually in this repo. They are always updated from the pipeline of my private repository where I keep my obsidian notes and configs. If the pipeline finds any changes made to any of the scripts it updates this repo so its scripts are up to date. Essentially the one-way sync occurs each time the pipeline is triggered.

## Scripts

1. **generate_folder_overviews.js**
   - **Do what**
     ```mermaid
     flowchart TD
      A["Start Process"] --> B["Gather Files from Vault"]
      B --> C["Identify Unique Folders"]
      C --> D["Process Each Folder"]
  
      D -->|Not Blacklisted| E["Generate Folder Overview"]
      D -->|Blacklisted| F["Skip Folder"]
  
      E --> G["Output and Save Overview"]
  
      F --> D    
      D -->|Completed All Folders| H["Clean Unnecessary Files"]
      H --> I["Process Complete"]

     ```
   - **Get what**
     - A new folder with overview notes for every folder in the vault. All folder and files are linked!
       ![image](https://github.com/user-attachments/assets/29c89909-afa8-4736-adb5-381a545e4367)
