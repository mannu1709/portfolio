# Portfolio Contact Email Setup

To receive contact form messages in your Gmail (`manmohany810@gmail.com`):

1. Enable **2-Step Verification** on your Google account.
2. Create a Gmail **App Password**.
3. Create `.env` in project root with:

```env
MAIL_USERNAME=manmohany810@gmail.com
MAIL_PASSWORD=your-16-char-app-password
CONTACT_TO_EMAIL=manmohany810@gmail.com
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

or if you use `pyproject.toml` tooling, install/sync dependencies via your tool.

5. Run the app:

```bash
python app.py
```

Now when someone submits the Contact form, the message is sent to your Gmail inbox.
