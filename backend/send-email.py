import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

# SMTP server configuration
smtp_server = "smtp.gmail.com"
smtp_port = 587
smtp_user = "aashah2003@gmail.com"
smtp_password = os.environ.get("GMAIL_PASSWORD")

# Email content
recipient_email = "aas225@lehigh.edu"
subject = "PulseFeed Daily Digest"

# HTML content
html_content = """
<html>
  <head></head>
  <body>
  <h1>PulseFeed Daily Digest </h1>
    <p>Hi Ayush Shah,<br>
       Here are your top articles to read this morning:</p>
    <div style="margin-bottom: 20px;">
      <!-- Repeat this block for each article -->
      <div style="margin-bottom: 10px;">
        <a href="https://www.cbssports.com/college-basketball/news/west-virginia-to-hire-darian-devries-drake-coach-led-bulldogs-to-three-out-of-last-four-ncaa-tournaments/" style="text-decoration: none; color: #000;">
          <h2 style="margin: 0;">West Virginia Hires New Coach</h2>
          <p style="margin: 0;">Author: Johnathon Ganford</p>
          <p>TL/DR: As their NCAA Title hopes come to end, West Virginia wastes no time making some key frontline changes to their coaching staff</p>
        </a>
      </div>
      <!-- End of article block -->
    </div>
  </body>
</html>
"""

# Setting up the MIME
message = MIMEMultipart()
message["From"] = smtp_user
message["To"] = recipient_email
message["Subject"] = subject

# Attach the HTML content
message.attach(MIMEText(html_content, "html"))

# Send the email
server = smtplib.SMTP(smtp_server, smtp_port)
server.starttls()
server.login(smtp_user, smtp_password)
text = message.as_string()
server.sendmail(smtp_user, recipient_email, text)
server.quit()

print("Email sent successfully!")
