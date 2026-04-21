import html
import os
import re
import smtplib
from pathlib import Path
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env", override=True)

app = Flask(__name__)

CONTACT_TO_EMAIL = os.environ.get("CONTACT_TO_EMAIL", "manmohany810@gmail.com")
MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = int(os.environ.get("MAIL_PORT", "587"))
MAIL_USERNAME = os.environ.get("MAIL_USERNAME", "").strip()
MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "").strip()
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def _send_contact_email(name: str, sender_email: str, body: str) -> None:
    if not MAIL_USERNAME or not MAIL_PASSWORD:
        raise RuntimeError("mail_not_configured")

    safe_name = name.replace("\n", " ").replace("\r", " ").strip()[:200]
    safe_body_plain = body
    safe_body_html = html.escape(body)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Portfolio contact from {safe_name}"
    msg["From"] = MAIL_USERNAME
    msg["To"] = CONTACT_TO_EMAIL
    msg["Reply-To"] = sender_email

    plain = (
        f"Name: {safe_name}\n"
        f"Email: {sender_email}\n\n"
        f"Message:\n{safe_body_plain}\n"
    )
    html_part = f"""\
<html><body>
<p><strong>Name:</strong> {html.escape(safe_name)}</p>
<p><strong>Email:</strong> <a href="mailto:{html.escape(sender_email)}">{html.escape(sender_email)}</a></p>
<p><strong>Message:</strong></p>
<pre style="white-space:pre-wrap;font-family:inherit;">{safe_body_html}</pre>
</body></html>
"""
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html_part, "html", "utf-8"))

    with smtplib.SMTP(MAIL_SERVER, MAIL_PORT, timeout=30) as server:
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, [CONTACT_TO_EMAIL], msg.as_string())


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "All fields are required."}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"success": False, "error": "Please enter a valid email address."}), 400

    try:
        _send_contact_email(name, email, message)
    except RuntimeError:
        return jsonify(
            {
                "success": False,
                "error": "Email is not configured on the server yet. Please try again later.",
            }
        ), 503
    except smtplib.SMTPAuthenticationError:
        return jsonify(
            {
                "success": False,
                "error": "Could not send email (authentication failed). Check server mail settings.",
            }
        ), 502
    except (OSError, smtplib.SMTPException) as e:
        app.logger.exception("Contact email failed: %s", e)
        return jsonify(
            {
                "success": False,
                "error": "Could not send your message right now. Please try again in a few minutes.",
            }
        ), 502

    return jsonify(
        {
            "success": True,
            "message": "Message received! I'll get back to you soon.",
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8000)
