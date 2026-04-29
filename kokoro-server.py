from http.server import HTTPServer, BaseHTTPRequestHandler
import json, io, soundfile as sf
from kokoro_onnx import Kokoro

print("Loading Kokoro model...")
kokoro = Kokoro("kokoro-v0_19.onnx", "voices.bin")
print("Kokoro ready on http://localhost:3001")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[kokoro-server] {args[0]} {args[1]}")

    def do_GET(self):
        message = "Kokoro TTS server is running. Send a POST request to generate audio."
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(message.encode('utf-8'))

    def do_POST(self):
        length = int(self.headers['Content-Length'])
        body = json.loads(self.rfile.read(length))

        text = body.get('input', '')
        voice = body.get('voice', 'af_bella')
        speed = float(body.get('speed', 0.93))

        samples, rate = kokoro.create(text, voice=voice, speed=speed, lang='en-us')

        buf = io.BytesIO()
        sf.write(buf, samples, rate, format='WAV')
        audio = buf.getvalue()

        self.send_response(200)
        self.send_header('Content-Type', 'audio/mpeg')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(audio)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


HTTPServer(('localhost', 3001), Handler).serve_forever()
