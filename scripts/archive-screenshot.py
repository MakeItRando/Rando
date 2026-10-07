#!/usr/bin/env python3
"""Archive owner-supplied PNG/JPEG screenshots losslessly as SVG wrappers.

Why SVG: the GitHub tooling agents use often only accepts text files, and an
SVG that embeds the original bytes renders directly on GitHub. The original
image can be recovered byte-for-byte from the base64 data URI.

Usage:
  python3 scripts/archive-screenshot.py OUT_DIR "slug|source note|/path/a.png" ...
Writes OUT_DIR/NN-slug.svg for each argument (NN = order given) and
OUT_DIR/manifest.json with the original size, SHA-256 and dimensions.

Recover an original:
  python3 - <<'PY'
  import re,base64;s=open('NN-slug.svg').read()
  open('out.png','wb').write(base64.b64decode(re.search(r'base64,([^"]+)',s).group(1)))
  PY
"""
import base64, hashlib, json, os, struct, sys
from html import escape


def dims(b):
    if b[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png", *struct.unpack(">II", b[16:24])
    if b[:2] == b"\xff\xd8":
        i = 2
        while i < len(b):
            m, ln = b[i + 1], struct.unpack(">H", b[i + 2:i + 4])[0]
            if m in (0xC0, 0xC1, 0xC2):
                h, w = struct.unpack(">HH", b[i + 5:i + 9])
                return "image/jpeg", w, h
            i += 2 + ln
    raise SystemExit("unsupported image")


def main():
    out, items = sys.argv[1], sys.argv[2:]
    os.makedirs(out, exist_ok=True)
    manifest = []
    for n, item in enumerate(items, 1):
        slug, note, path = item.split("|", 2)
        b = open(path, "rb").read()
        mime, w, h = dims(b)
        name = f"{n:02d}-{slug}.svg"
        title = escape(f"Owner-supplied conversation screenshot {n:02d}: {slug}")
        data = base64.b64encode(b).decode()
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
               f'width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n<title>{title}</title>\n'
               f'<image width="{w}" height="{h}" xlink:href="data:{mime};base64,{data}"/>\n</svg>\n')
        open(os.path.join(out, name), "w").write(svg)
        manifest.append({"file": name, "source": note, "originalBytes": len(b),
                         "originalSHA256": hashlib.sha256(b).hexdigest(), "mime": mime,
                         "width": w, "height": h})
    json.dump(manifest, open(os.path.join(out, "manifest.json"), "w"), indent=2)
    print(json.dumps(manifest, indent=1))


if __name__ == "__main__":
    main()
