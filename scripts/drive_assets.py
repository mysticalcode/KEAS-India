import html
import ast
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path


FOLDER_URL = "https://drive.google.com/drive/folders/1l4bdrOhhQLyHeIG2x5IPd1RSwwS52FFC?usp=sharing"


def fetch(url):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def folder_url(folder_id):
    return f"https://drive.google.com/drive/folders/{folder_id}?usp=sharing"


def extract_ivd(text):
    marker = "window['_DRIVE_ivd'] = "
    start = text.find(marker)
    if start < 0:
        return ""
    start += len(marker)
    end = text.find(";if (window['_DRIVE_ivdc'])", start)
    if end < 0:
        return ""
    literal = text[start:end].strip()
    try:
        return ast.literal_eval(literal)
    except Exception:
        return ""


def flatten(value):
    if isinstance(value, list):
        for item in value:
            yield from flatten(item)
    else:
        yield value


def parse_listing(text):
    ivd = extract_ivd(text)
    haystacks = [text, ivd]
    items = {}

    # The most reliable part of Drive's public payload is the row fragment:
    # [[null,"<id>"], ... "mime", ... [[[["Name"...]]]] ...]
    row_pattern = re.compile(
        r'\[\[null,"(?P<id>[A-Za-z0-9_-]{20,})"\].{0,260}?"(?P<mime>application/[^"]+|image/[^"]+|video/[^"]+)".{0,1400}?\[\[\[\["(?P<name>[^"]+)"',
        re.S,
    )
    for source in haystacks:
        for match in row_pattern.finditer(source):
            file_id = match.group("id")
            items[file_id] = {
                "id": file_id,
                "name": html.unescape(match.group("name")),
                "mime": match.group("mime").replace("\\/", "/"),
            }

    # Fallback for the compact escaped array in _DRIVE_ivd.
    compact_pattern = re.compile(
        r'\["(?P<id>[A-Za-z0-9_-]{20,})",\["[A-Za-z0-9_-]{20,}"\],"(?P<name>[^"]+)","(?P<mime>[^"]+)"'
    )
    for source in haystacks:
        for match in compact_pattern.finditer(source):
            file_id = match.group("id")
            items.setdefault(
                file_id,
                {
                    "id": file_id,
                    "name": html.unescape(match.group("name")),
                    "mime": match.group("mime").replace("\\/", "/"),
                },
            )

    return list(items.values())


def list_folder(folder_id="1l4bdrOhhQLyHeIG2x5IPd1RSwwS52FFC", depth=0, seen=None):
    seen = seen or set()
    if folder_id in seen:
        return []
    seen.add(folder_id)
    raw = fetch(folder_url(folder_id))
    text = raw.decode("utf-8", "ignore")
    Path(f"references/drive-folder-{folder_id}.html").write_text(text, encoding="utf-8")
    items = parse_listing(text)
    all_items = []
    for item in sorted(items, key=lambda row: row["name"].lower()):
        item["depth"] = depth
        all_items.append(item)
        print(f"{'  ' * depth}{item['id']}\t{item['mime']}\t{item['name']}")
        if item["mime"] == "application/vnd.google-apps.folder" and depth < 3:
            all_items.extend(list_folder(item["id"], depth + 1, seen))
    return all_items


def download(file_id, name):
    out_dir = Path("public/uploads/drive")
    out_dir.mkdir(parents=True, exist_ok=True)
    safe_name = re.sub(r"[^A-Za-z0-9._ -]+", "-", name).strip()
    out_path = out_dir / safe_name
    url = f"https://drive.google.com/uc?export=download&id={urllib.parse.quote(file_id)}"
    data = fetch(url)
    text_start = data[:200].decode("utf-8", "ignore").lower()
    if "<!doctype html" in text_start or "<html" in text_start:
        raise RuntimeError(f"Drive returned an HTML confirmation page for {name}; file may be too large or blocked.")
    out_path.write_bytes(data)
    print(out_path)


if __name__ == "__main__":
    if len(sys.argv) == 1 or sys.argv[1] == "list":
        list_folder()
    elif sys.argv[1] == "download":
        download(sys.argv[2], sys.argv[3])
    else:
        raise SystemExit("Usage: drive_assets.py list | download <file_id> <name>")
