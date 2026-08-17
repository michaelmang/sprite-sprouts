# EPUB CFI Extraction and Catalog Restructuring

This toolkit provides two Python scripts to extract CFI (Canonical Fragment Identifier) locations from EPUB files and restructure your catalog.json format to include proper navigation data.

## Problem Statement

Your catalog contains chapter metadata with print page numbers in titles (e.g., "The Necessity of Scripture. 7"), but lacks CFI locations needed for ebook reader navigation. This causes sync issues between your chapter list and the actual ebook content.

## Solution Overview

1. **epub_cfi_extractor.py** - Extracts CFI locations from EPUB files
2. **catalog_restructurer.py** - Cleans up catalog format and integrates CFI data

## Installation

### Required Python Packages

```bash
pip install --break-system-packages lxml
```

The scripts use only Python standard library (no external dependencies required for basic usage).

## Quick Start

### 1. Inspect Your EPUB File

First, examine what's in your EPUB:

```bash
python3 epub_cfi_extractor.py path/to/book.epub --inspect
```

This outputs the EPUB's table of contents with CFI locations:

```json
[
  {
    "title": "Introduction: Questions on The Doctrine of Scripture",
    "src": "intro.xhtml",
    "file": "intro.xhtml",
    "fragment": null,
    "cfi": "epubcfi(/6/4!/4)",
    "play_order": 1
  },
  {
    "title": "The Necessity of Verbal Revelation",
    "src": "chapter1.xhtml#section1",
    "file": "chapter1.xhtml",
    "fragment": "section1",
    "cfi": "epubcfi(/6/6!/4[section1])",
    "play_order": 2
  }
]
```

### 2. Generate a Catalog Structure Report

See what needs to be cleaned up:

```bash
python3 catalog_restructurer.py catalog.json --report
```

Output:
```
============================================================
CATALOG STRUCTURE REPORT
============================================================

Total books: 1

============================================================
Book ID: 834
Title: 21 Questions on The Doctrine of Scripture
Chapters: 22

EPUB: Available

Chapter Analysis:
  - With audio: 22/22
  - With CFI: 0/22

Sample chapter structure:
  Original title: Introduction: Questions on The Doctrine of Scripture. 3
  Cleaned title: Introduction: Questions on The Doctrine of Scripture
  Print page: 3
============================================================
```

### 3. Process Your EPUB and Update Catalog

Extract CFI data and match it with your catalog:

```bash
python3 epub_cfi_extractor.py book.epub \
  --catalog catalog.json \
  --book-id 834 \
  --output updated_catalog.json
```

This will:
- Extract all chapter CFI locations from the EPUB
- Match them with catalog chapters by title similarity
- Add CFI data to each chapter
- Save the updated catalog

### 4. Restructure Catalog Format

Clean up the catalog structure:

```bash
python3 catalog_restructurer.py updated_catalog.json \
  --output final_catalog.json
```

## Detailed Usage

### epub_cfi_extractor.py

#### Extract TOC only (JSON output)

```bash
python3 epub_cfi_extractor.py book.epub
```

#### Inspect EPUB structure

```bash
python3 epub_cfi_extractor.py book.epub --inspect
```

#### Update catalog with CFI data

```bash
python3 epub_cfi_extractor.py book.epub \
  --catalog catalog.json \
  --book-id 834 \
  --output updated_catalog.json
```

**Parameters:**
- `epub_file` - Path to EPUB file
- `--catalog` - Path to catalog.json
- `--book-id` - Book ID in catalog to update
- `--output` - Output file (default: overwrites catalog)
- `--inspect` - Just show EPUB structure

### catalog_restructurer.py

#### Generate structure report

```bash
python3 catalog_restructurer.py catalog.json --report
```

#### Restructure catalog format

```bash
python3 catalog_restructurer.py catalog.json --output new_catalog.json
```

#### Merge CFI data from processed catalog

```bash
python3 catalog_restructurer.py original_catalog.json \
  --merge-cfi cfi_enhanced_catalog.json \
  --output merged_catalog.json
```

**Parameters:**
- `catalog_file` - Path to catalog.json
- `--output` - Output file (default: overwrites input)
- `--report` - Generate structure report
- `--no-cfi-placeholder` - Don't add empty CFI fields
- `--merge-cfi` - Merge CFI data from another catalog

## Output Format

### Before (Original Catalog)

```json
{
  "id": 834,
  "title": "21 Questions on The Doctrine of Scripture",
  "chapters": [
    {
      "id": 2342,
      "title": "Introduction: Questions on The Doctrine of Scripture. 3",
      "audioFileName": "Introduction- Questions on The Doctrine of Scripture.mp3",
      "audioFileUrl": "https://...",
      "audioFileInS3": true,
      "order": 0
    }
  ]
}
```

### After (Restructured with CFI)

```json
{
  "id": 834,
  "title": "21 Questions on The Doctrine of Scripture",
  "epub_url": "https://www.monergism.com/...",
  "chapter_count": 22,
  "chapters": [
    {
      "id": 2342,
      "title": "Introduction: Questions on The Doctrine of Scripture",
      "print_page": 3,
      "order": 0,
      "cfi": "epubcfi(/6/4!/4)",
      "epub_src": "intro.xhtml",
      "audio": {
        "filename": "Introduction- Questions on The Doctrine of Scripture.mp3",
        "url": "https://...",
        "in_s3": true
      }
    }
  ]
}
```

### Key Changes

1. **Cleaned Titles** - Page numbers removed from title, stored separately as `print_page`
2. **CFI Locations** - Added `cfi` field with proper EPUB navigation string
3. **EPUB Source** - Added `epub_src` showing the actual EPUB file/fragment
4. **Structured Audio** - Audio data grouped under `audio` object
5. **Chapter Count** - Added `chapter_count` at book level

## How CFI Matching Works

The extractor uses a multi-step matching algorithm:

1. **Title Similarity** - Compares cleaned catalog titles with EPUB TOC titles
2. **Word Overlap** - Counts common words between titles
3. **Order Fallback** - Uses chapter order as fallback if title matching fails

Example matching:
```
Catalog: "The Necessity of Verbal Revelation. 5"
EPUB: "The Necessity of Verbal Revelation"
→ Match score: 4 (all words match)
→ CFI assigned: "epubcfi(/6/6!/4)"
```

## Understanding CFI Format

CFI (Canonical Fragment Identifier) format explained:

```
epubcfi(/6/8!/4[section-id])
         │  │  │  └─ Optional fragment ID
         │  │  └─ Path within document (/4 = body element)
         │  └─ Spine item reference (even numbers: 4, 6, 8...)
         └─ Package document reference (always /6)
```

Spine calculation:
- First chapter: `/6/4`
- Second chapter: `/6/6`
- Third chapter: `/6/8`
- Formula: `/6/{(spine_index * 2) + 4}`

## Workflow for Processing Multiple Books

### Step 1: Batch Extract CFI Data

```bash
#!/bin/bash
# process_all_books.sh

for book in epubs/*.epub; do
  book_id=$(basename "$book" .epub)
  echo "Processing book ID: $book_id"
  
  python3 epub_cfi_extractor.py "$book" \
    --catalog catalog.json \
    --book-id "$book_id" \
    --output "temp_catalog_${book_id}.json"
done
```

### Step 2: Merge All Updates

```bash
# Start with original
cp catalog.json merged_catalog.json

# Merge each processed book
for temp in temp_catalog_*.json; do
  python3 catalog_restructurer.py merged_catalog.json \
    --merge-cfi "$temp" \
    --output merged_catalog.json
done
```

### Step 3: Final Restructure

```bash
python3 catalog_restructurer.py merged_catalog.json \
  --output final_catalog.json
```

## Troubleshooting

### Issue: "Could not find OPF file"

The EPUB is malformed or corrupted. Verify with:
```bash
unzip -l book.epub | grep -i opf
```

### Issue: "No chapters extracted"

The EPUB might not have a traditional TOC. Try:
```bash
python3 epub_cfi_extractor.py book.epub --inspect
```

Look for spine items instead of TOC entries.

### Issue: "Chapter titles don't match"

The matching algorithm uses fuzzy matching. Check:
```bash
python3 catalog_restructurer.py catalog.json --report
```

Verify the "Sample chapter structure" shows correct title cleaning.

### Issue: "CFI locations seem wrong"

Verify spine order in the EPUB:
```bash
unzip -p book.epub OEBPS/content.opf | grep -A 10 "<spine"
```

## Advanced: Custom Chapter Matching

If automatic matching fails, you can manually create a mapping:

```python
# custom_matcher.py
import json
from epub_cfi_extractor import EPUBCFIExtractor

# Load your catalog
with open('catalog.json', 'r') as f:
    catalog = json.load(f)

# Extract EPUB chapters
with EPUBCFIExtractor('book.epub') as extractor:
    epub_chapters = extractor.extract_toc()

# Manual mapping
chapter_mapping = {
    2342: 0,  # Catalog chapter ID 2342 → EPUB chapter 0
    2343: 1,  # Catalog chapter ID 2343 → EPUB chapter 1
    # ... etc
}

# Apply mapping
book = catalog[0]  # Assuming first book
for chapter in book['chapters']:
    ch_id = chapter['id']
    if ch_id in chapter_mapping:
        epub_idx = chapter_mapping[ch_id]
        chapter['cfi'] = epub_chapters[epub_idx]['cfi']
        chapter['epub_src'] = epub_chapters[epub_idx]['src']

# Save
with open('mapped_catalog.json', 'w') as f:
    json.dump(catalog, f, indent=2)
```

## Testing Your Updated Catalog

After processing, verify the CFI locations work:

```python
# test_cfi.py
import json

with open('final_catalog.json', 'r') as f:
    catalog = json.load(f)

book = catalog[0]
print(f"Book: {book['title']}")
print(f"Total chapters: {book['chapter_count']}")
print(f"\nChapters with CFI: {sum(1 for ch in book['chapters'] if ch.get('cfi'))}")
print(f"Chapters without CFI: {sum(1 for ch in book['chapters'] if not ch.get('cfi'))}")

# Show first few chapters
print("\nFirst 5 chapters:")
for ch in book['chapters'][:5]:
    print(f"  {ch['order']}: {ch['title']}")
    print(f"     CFI: {ch.get('cfi', 'MISSING')}")
    print(f"     Source: {ch.get('epub_src', 'MISSING')}")
```

## Integration with Your App

Once you have the updated catalog, integrate it into your ebook reader:

```javascript
// Example: Navigate to chapter using CFI
function navigateToChapter(book, chapterIndex) {
  const chapter = book.chapters[chapterIndex];
  
  if (chapter.cfi) {
    // Use CFI for precise navigation
    epubReader.gotoCfi(chapter.cfi);
  } else if (chapter.epub_src) {
    // Fallback to file-based navigation
    epubReader.goto(chapter.epub_src);
  } else {
    // Last resort: use order
    epubReader.gotoPage(chapter.order);
  }
}

// Example: Sync current location with TOC
function getCurrentChapter(currentCfi) {
  return book.chapters.find(ch => {
    // Simple prefix matching (may need more sophisticated comparison)
    return currentCfi.startsWith(ch.cfi?.split('!')[0] || '');
  });
}
```

## License

These scripts are provided as-is for your use in restructuring your catalog data.

## Support

If you encounter issues or need custom matching logic for your specific EPUB format, please provide:
1. Sample EPUB file
2. Sample catalog entry
3. Expected chapter mapping
# sprite-sprouts
