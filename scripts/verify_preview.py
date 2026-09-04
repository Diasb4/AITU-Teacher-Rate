import urllib.request
import re
import sys

def test():
    base_url = 'http://localhost:4173'
    print(f"Testing root {base_url}...")
    with urllib.request.urlopen(base_url) as resp:
        if resp.status != 200:
            print(f"Failed root: {resp.status}")
            sys.exit(1)
        html = resp.read().decode('utf-8')
        print(f"[OK] Root HTML returned 200 OK ({len(html)} bytes)")

    assets = re.findall(r'(?:src|href)=["\'](\./assets/[^"\']+)["\']', html)
    print(f"Found {len(assets)} assets in HTML: {assets}")

    for asset in assets:
        url = f"{base_url}/{asset.lstrip('./')}"
        with urllib.request.urlopen(url) as a_resp:
            content = a_resp.read()
            if a_resp.status != 200:
                print(f"[FAIL] {url} -> {a_resp.status}")
                sys.exit(1)
            print(f"[OK] {asset} -> HTTP {a_resp.status} ({len(content)} bytes)")

    print("\nAll assets loaded successfully with 200 OK! Ready for 100% static free hosting.")

if __name__ == '__main__':
    test()
