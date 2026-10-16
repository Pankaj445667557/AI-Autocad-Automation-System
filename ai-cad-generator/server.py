"""
AI-Based Automated CAD Model Generation System Using SolidWorks API
Local Prototype Server Runner
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 70)
        print("  AI CAD Generator - SolidWorks Automation Web Prototype")
        print("=" * 70)
        print(f"  [+] Serving at: {url}")
        print(f"  [+] Directory:  {DIRECTORY}")
        print("  [+] Press Ctrl+C to stop the server")
        print("=" * 70)
        
        # Open in browser automatically
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  [!] Server stopped by user.")
            sys.exit(0)

if __name__ == '__main__':
    main()
