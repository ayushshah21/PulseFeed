# PulseFeed: Personalized News Delivery Platform

PulseFeed is a cutting-edge news delivery platform designed to bring personalized news content directly to your inbox. Leveraging the Google News RSS Feed, PulseFeed curates a list of articles tailored to your individual preferences and delivers them at a frequency of your choosing.

## Features

- **Personalized News Curation**: Users can select their favorite news topics to receive articles that matter most to them.
- **Flexible Delivery Schedule**: Choose how often you receive your news digest - daily, every 3 days, weekly, etc.
- **Intelligent Article Ranking**: Utilizes OpenAI's GPT-4 to parse user preferences and a custom ranking algorithm within PostgreSQL to prioritize news delivery.
- **Seamless User Experience**: Easy sign-up process with an intuitive interface for managing preferences and viewing past news digests.

## How It Works

1. **User Preferences**: Sign up and select your preferred news topics and delivery frequency.
2. **Content Aggregation**: PulseFeed fetches the latest news from Google News RSS Feeds, filtering content based on your preferences.
3. **Content Ranking**: Articles are ranked using a sophisticated algorithm that considers user interaction data and content relevancy.
4. **Email Digest**: A curated list of top articles is compiled and sent to your email based on your selected frequency.

## Technologies Used

- **Backend**: Flask (Python)
- **Database**: PostgreSQL
- **Frontend**: React.js
- **APIs**: OpenAI's GPT-4, Google News RSS Feed
- **Deployment**: AWS (Amazon Web Services)
