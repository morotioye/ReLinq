# ReLinq
A smart personal CRM app that automatically tracks updates from your connections' LinkedIn profiles, generates personalized messages, and notifies you with timely, tailored outreach suggestions via Twilio.

Technical Specification:
- A Mongo DB database to store two collections: user and users' connections
- A python script that utilizes a chrome driver and the beautiful soup module to web-scrape User-Posts on linkedin
- The text obtained from the scrape would be fed into an Open AI trained model to generated smart responses
- Leveraging Twilio to send tailor-made responses
